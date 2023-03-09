import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import { buildCommentDto } from "@/hooks/react-query/domain/comment/types/CommentDto"
import useSaveCommentMutation from "@/hooks/react-query/domain/comment/useSaveCommentMutation"
import { LoadingButton } from "@mui/lab"
import { Button } from "@mui/material"
import { useState } from "react"

type Props = {
  ideaId: string
  onClose: () => void
}

const CommentInput = (props: Props) => {
  const { mutate: submitSaveComment, isLoading } = useSaveCommentMutation()
  const [text, setText] = useState("")

  const handleSubmit = () => {
    submitSaveComment(
      {
        ideaId: props.ideaId,
        dto: buildCommentDto({
          targetIdeaId: props.ideaId,
          text,
        }),
      },
      {
        onSuccess: () => {
          props.onClose()
        },
      }
    )
  }

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <MyTextField
        fullWidth
        autoFocus
        multiline
        minRows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onCtrlEnter={(e) => {
          handleSubmit()
          e.stopPropagation()
        }}
      />
      <FlexVCenter justifyContent={"flex-end"} mt={1} gap={1}>
        <LoadingButton
          variant="contained"
          onClick={handleSubmit}
          loading={isLoading}
        >
          Save
        </LoadingButton>
        <Button onClick={props.onClose}>Cancel</Button>
      </FlexVCenter>
    </div>
  )
}

export default CommentInput
