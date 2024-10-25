import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import { buildCommentDto } from "@/hooks/react-query/domain/comment/types/CommentDto"
import useSaveCommentMutation from "@/hooks/react-query/domain/comment/useSaveCommentMutation"
import { LoadingButton } from "@mui/lab"
import { useState } from "react"

type Props = {
  ideaId: string
  inputRef?: React.RefObject<HTMLTextAreaElement>
  saveButtonRef?: React.RefObject<HTMLButtonElement>
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
          setText("")
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
        inputRef={props.inputRef}
        placeholder="Add a comment..."
        fullWidth
        multiline
        minRows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onCtrlEnter={(e) => {
          handleSubmit()
          e.stopPropagation()
        }}
      />
      <FlexVCenter
        justifyContent={"flex-end"}
        mt={1}
        gap={1}
        visibility={text.trim() === "" ? "hidden" : "visible"}
      >
        <LoadingButton
          variant="contained"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={text.trim() === ""}
          ref={props.saveButtonRef}
        >
          Save
        </LoadingButton>
      </FlexVCenter>
    </div>
  )
}

export default CommentInput
