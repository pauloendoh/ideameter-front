import { styles as S } from "./styles"

import FlexCol from "@/components/_common/flexboxes/FlexCol"
import MantineRTE from "@/components/_common/text/MantineRTE"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import useDebounce from "@/hooks/utils/useDebounce"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
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
import IdeaDialogUsersVotedHighImpact from "../IdeaDialogUsersVotedHighImpact/IdeaDialogUsersVotedHighImpact"

interface Props {
  watch: UseFormWatch<IdeaDto>
  setValue: UseFormSetValue<IdeaDto>
  control: Control<IdeaDto>
  onSubmit: (idea: IdeaDto) => void
}

const IdeaDialogLeftCol = ({ watch, setValue, control, onSubmit }: Props) => {
  // some stuff to improve performance
  const [localDescription, setLocalDescription] = useState(watch("description"))

  const debouncedDescription = useDebounce(localDescription, 250)
  useEffect(() => {
    setValue("description", debouncedDescription)
  }, [debouncedDescription])

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

  const onCtrlEnter = (e: KeyboardEvent<HTMLDivElement>) => {
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
            onChange={setLocalDescription}
            onImageUpload={handleImageUpload}
            mentions={mentions}
            onKeyDown={onCtrlEnter}
          />
        </S.MantineRteContainer>
      </FlexCol>
    </Grid>
  )
}

export default IdeaDialogLeftCol
