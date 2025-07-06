import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import { Button, Menu } from "@mui/material"
import { valueIsOneOf } from "endoh-utils"
import React, { useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook"

type Props = {
  tabId: string
}

export const NewIdeaMenuButton = ({ ...props }: Props) => {
  const openDialog = useIdeaDialogStore((s) => s.openDialog)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const menuIsOpen = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const { mutate: submitNewIdea, isLoading } = useSaveIdeaMutation()

  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [title, setTitle] = React.useState("")
  useEffect(() => {
    if (menuIsOpen) {
      setTitle("")
      setTimeout(() => {
        inputRef.current?.focus()
      }, 250)
    }
  }, [menuIsOpen])

  const handleSave = () => {
    if (title.trim() === "") {
      return
    }
    submitNewIdea(
      buildIdeaDto({
        name: title,
        tabId: props.tabId,
      }),
      {
        onSuccess: (idea) => {
          openDialog(idea)
          handleClose()
        },
      }
    )
  }

  useHotkeys("q", () => {
    if (!menuIsOpen) {
      buttonRef.current?.click()
    }
  })

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        ref={buttonRef}
        onClick={handleClick}
      >
        + New idea (q)
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={menuIsOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{
          "& .MuiMenu-paper": {
            minWidth: "300px",
          },
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <FlexCol gap={1} p={1}>
            <MyTextField
              multiline
              inputRef={inputRef}
              fullWidth
              label="Idea title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (valueIsOneOf(e.key, ["Home", "End"])) {
                  e.stopPropagation()
                }
              }}
            />
            <SaveCancelButtons
              disabled={!title.trim()}
              onCancel={handleClose}
              isLoadingAndDisabled={isLoading}
              onEnabledAndCtrlEnter={handleSave}
            />
          </FlexCol>
        </form>
      </Menu>
    </div>
  )
}
