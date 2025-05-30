import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import UserGroupDto from "@/types/domain/group/UserGroupDto"
import { Autocomplete } from "@mui/lab"
import { Avatar, Chip } from "@mui/material"
import { useMemo } from "react"
import MembersMultiSelectorOption from "./MembersMultiSelectorOption/MembersMultiSelectorOption"

interface Props {
  selectedMemberIds: string[]
  onChange: (memberIds: string[]) => void
  inputLabel?: string
  inputRef?: React.RefObject<HTMLInputElement>
}

const MembersMultiSelector = (props: Props) => {
  const { groupId } = useRouterQueryString()

  const { data: members } = useGroupMembersQuery(groupId)

  const sortedMembers = useMemo(() => {
    // by username alphabetically
    const sorted = (members ?? []).sort((a, b) =>
      (a.user?.username ?? "").localeCompare(b.user?.username ?? "")
    )
    return [...sorted]
  }, [members])

  const value = useMemo(() => {
    return sortedMembers?.filter((member) =>
      props.selectedMemberIds?.includes(member.userId)
    )
  }, [props.selectedMemberIds, sortedMembers])

  return (
    <Autocomplete
      multiple
      id="tags-standard"
      options={sortedMembers}
      value={value}
      onKeyDown={(e) => {
        e.stopPropagation()
      }}
      disableCloseOnSelect
      onChange={(e, values) => {
        if (typeof values === "string") return
        const newSelectedItems = values as UserGroupDto[]

        const memberIds = newSelectedItems.map((item) => item.userId)

        props.onChange(memberIds)
      }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.user?.username ?? ""
      }
      renderInput={(params) => (
        <MyTextField
          {...params}
          label={props.inputLabel ?? "Members"}
          size="small"
          inputRef={props.inputRef}
        />
      )}
      renderOption={(liProps, member) => (
        <MembersMultiSelectorOption liProps={liProps} groupMember={member} />
      )}
      renderTags={(labels, getTagProps) =>
        labels.map((item, index) => (
          <Chip
            {...getTagProps({ index })}
            size="small"
            avatar={
              <Avatar
                src={item.user?.profile?.pictureUrl}
                alt={item.user?.username}
              />
            }
            label={item.user?.username}
          />
        ))
      }
    />
  )
}

export default MembersMultiSelector
