import FlexCol from "@/components/_common/flexboxes/FlexCol"
import SearchBar from "@/components/GroupPage/SearchRow/SearchBar/SearchBar"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import urls from "@/utils/urls"
import { Flex } from "@mantine/core"
import { Checkbox, IconButton } from "@mui/material"
import { deleteFromArray } from "endoh-utils"
import { useMemo } from "react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { MdClose } from "react-icons/md"

type Props = {
  watch: UseFormWatch<IdeaDto>
  setValue: UseFormSetValue<IdeaDto>
}

const WaitingIdeasSection = ({ ...props }: Props) => {
  const routerQuery = useRouterQueryString()

  const waitingIdeas = useMemo(
    () =>
      (props.watch("waitingIdeas") || []).sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      }),
    [props.watch("waitingIdeas")]
  )

  return (
    <FlexCol className="WaitingIdeasSection">
      <SearchBar
        label="Waiting for ideas"
        ignoreIdeaIds={[props.watch("id"), ...waitingIdeas.map((w) => w.id)]}
        popperMinWidth={400}
        overrideOnSelect={(idea) => {
          if (waitingIdeas.find((w) => w.id === idea.id)) return
          props.setValue("waitingIdeas", [
            ...waitingIdeas,
            {
              id: idea.id,
              isDone: idea.isDone,
              name: idea.name,
              tabId: idea.tabId ?? "",
            },
          ])
        }}
      />

      <FlexCol gap={0.5}>
        {waitingIdeas.map((idea) => {
          return (
            <Flex key={idea.id} justify={"space-between"}>
              <Flex>
                <div>
                  <Checkbox disabled checked={idea.isDone} />
                </div>
                <a
                  href={urls.pages.groupTabIdea(
                    routerQuery.groupId,
                    idea.tabId,
                    idea.id
                  )}
                  target="_blank"
                  style={{
                    marginTop: 8,
                    color: "unset",
                  }}
                >
                  {idea.name}
                </a>
              </Flex>
              <div
                style={{
                  marginTop: 8,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    props.setValue(
                      "waitingIdeas",
                      deleteFromArray(waitingIdeas, (w) => w.id === idea.id)
                    )
                  }}
                >
                  <MdClose />
                </IconButton>
              </div>
            </Flex>
          )
        })}
      </FlexCol>
    </FlexCol>
  )
}

export default WaitingIdeasSection
