import { styles as S } from "./styles"

import FlexCol from "@/components/_common/flexboxes/FlexCol"
import MantineRTE from "@/components/_common/text/MantineRTE"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import useDebounce from "@/hooks/utils/useDebounce"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { RteImageDto } from "@/types/domain/rte-image/RteImageDto"
import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import { Grid } from "@mui/material"
import { KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react"
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form"
import IdeaDialogAssignedUsers from "../IdeaDialogAssignedUsers/IdeaDialogAssignedUsers"
import IdeaDialogSelectedLabels from "../IdeaDialogSelectedLabels/IdeaDialogSelectedLabels"
import IdeaDialogSubideasAccordion from "../IdeaDialogSubideasAccordion/IdeaDialogSubideasAccordion"
import IdeaDialogUsersVotedHighImpact from "../IdeaDialogUsersVotedHighImpact/IdeaDialogUsersVotedHighImpact"
import IdeaDialogRatingsAccordion from "./IdeaDialogRatingsAccordion/IdeaDialogRatingsAccordion"

interface Props {
  watch: UseFormWatch<IdeaDto>
  setValue: UseFormSetValue<IdeaDto>
  control: Control<IdeaDto>
  onSubmit: (idea: IdeaDto) => void
}

const IdeaDialogLeftCol = ({ watch, setValue, control, onSubmit }: Props) => {
  // some stuff to improve performance
  const [localDescription, setLocalDescription] = useState(watch("description"))
  const [canDirty, setCanDirty] = useState(false)

  const dialogIsOpen = useIdeaDialogStore((s) => s.dialogIsOpen)
  useEffect(() => {
    // reset
    if (dialogIsOpen) setCanDirty(false)
  }, [dialogIsOpen])

  const debouncedDescription = useDebounce(localDescription, 250)
  useEffect(() => {
    if (canDirty) setValue("description", debouncedDescription)
  }, [debouncedDescription, canDirty])

  const handleImageUpload = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append("file", file)

        myAxios
          .post<RteImageDto>(urls.api.rteImages, formData)
          .then((res) => {
            return resolve(res.data.imageUrl)
          })
          .catch(() => reject(new Error("Upload failed")))
      }),
    []
  )

  const { authUser } = useAuthStore()
  const { groupId } = useRouterQueryString()
  const { data: groupMembers } = useGroupMembersQuery(groupId)

  const mentions = useMemo(
    () => ({
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@"],
      source: (searchTerm: any, renderList: any, mentionChar: any) => {
        const list =
          groupMembers
            ?.filter((m) => m.userId !== authUser?.id)
            .map((m) => ({ id: m.userId, value: m.user.username })) || []
        const includesSearchTerm = list.filter((item) =>
          item.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
        renderList(includesSearchTerm)
      },
    }),
    [groupMembers, authUser]
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") return

    setCanDirty(true)

    // I had to add a default function for onCtrlEnter to remove console.error
    if (e.key === "Enter" && e.ctrlKey) {
      setValue("description", localDescription)
      onSubmit(watch())
    }
  }

  return (
    <Grid item xs={8}>
      <FlexCol sx={{ gap: 4 }}>
        <Grid container>
          <Grid item xs={6}>
            <IdeaDialogAssignedUsers watch={watch} setValue={setValue} />
          </Grid>
          <Grid item xs={6}>
            {watch("highImpactVotes")?.length > 0 && (
              <IdeaDialogUsersVotedHighImpact
                watch={watch}
                setValue={setValue}
              />
            )}
          </Grid>
        </Grid>

        <IdeaDialogSelectedLabels
          idea={watch()}
          onChangeSelectedLabels={(labels) => {
            setValue("labels", labels)
          }}
        />

        <S.MantineRteContainer>
          <MantineRTE
            placeholder="Idea description"
            value={localDescription}
            onChange={(text) => {
              setLocalDescription(text)
            }}
            onImageUpload={handleImageUpload}
            mentions={mentions}
            onKeyDown={handleKeyDown}
          />
        </S.MantineRteContainer>

        {watch("id") && watch("tabId") && groupId && (
          <IdeaDialogRatingsAccordion
            ideaId={watch("id")}
            groupId={groupId}
            tabId={String(watch("tabId"))}
          />
        )}

        {watch("id") && <IdeaDialogSubideasAccordion ideaId={watch("id")} />}
      </FlexCol>
    </Grid>
  )
}

export default IdeaDialogLeftCol
