import FlexCol from "@/components/_common/flexboxes/FlexCol"
import { IdeaChangeDto } from "@/hooks/react-query/domain/idea-change/useIdeaChangesQuery"
import { Box, Typography } from "@mui/material"
import { useMemo } from "react"

type Props = {
  ideaChange: IdeaChangeDto
}

const IdeaChangeDialogDetailsRight = (props: Props) => {
  const title = useMemo(() => {
    if (props.ideaChange.changeType === "Description") {
      return "Description"
    }
    return "Title"
  }, [props.ideaChange.changeType])
  return (
    <FlexCol mt={5}>
      <Typography fontSize={20}>{title}</Typography>
      <Box mt={1}>
        <Typography fontSize={12}>New</Typography>
        <Box
          sx={(theme) => ({
            p: 1,
            borderRadius: 1,
            backgroundColor: theme.palette.primary.main,
          })}
          dangerouslySetInnerHTML={
            props.ideaChange.changeType === "Description"
              ? {
                  __html: props.ideaChange.newText,
                }
              : undefined
          }
          children={
            props.ideaChange.changeType === "Description"
              ? undefined
              : props.ideaChange.newText
          }
        />
      </Box>

      {props.ideaChange.prevText.length > 0 && (
        <Box mt={2}>
          <Typography fontSize={12}>Old</Typography>
          <Box
            sx={(theme) => ({
              p: 1,
              borderRadius: 1,
              backgroundColor: theme.palette.grey[700],
              textDecoration: "line-through",
            })}
            dangerouslySetInnerHTML={
              props.ideaChange.changeType === "Description"
                ? {
                    __html: props.ideaChange.prevText,
                  }
                : undefined
            }
            children={
              props.ideaChange.changeType === "Description"
                ? undefined
                : props.ideaChange.prevText
            }
          />
        </Box>
      )}
    </FlexCol>
  )
}

export default IdeaChangeDialogDetailsRight
