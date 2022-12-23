import AuthUserGetDto from "@/types/domain/auth/AuthUserGetDto"
import SimpleUserDto from "@/types/domain/user/SimpleUserDto"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import { useHotkeys } from "react-hotkeys-hook"

export const useAssignMeFromDialogHotkey = (params: {
  dialogIsOpen: boolean
  authUser: AuthUserGetDto | null
  currentAssignedUsers: SimpleUserDto[]
  onChange: (value: SimpleUserDto[]) => void
}) => {
  const { dialogIsOpen, authUser, currentAssignedUsers, onChange } = params
  useHotkeys(
    "a",
    (e) => {
      if (!dialogIsOpen) return

      const user: SimpleUserDto = {
        id: authUser!.id,
        email: authUser!.email,
        username: authUser!.username,
      }
      const assignedUsers = [...currentAssignedUsers]
      const newAssignedUsers = pushOrRemove(assignedUsers, user, "id")
      onChange(newAssignedUsers)
    },

    [dialogIsOpen, currentAssignedUsers]
  )
}
