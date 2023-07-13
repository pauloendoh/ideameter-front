import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import { Autocomplete } from "@mui/lab"
import { useMemo } from "react"

type Value = null | "any" | string

interface Props {
  selectedUserId: null | "any" | string
  onChange: (value: Value) => void
}

const VotedHighImpactSelector = (props: Props) => {
  const { groupId } = useRouterQueryString()

  const { data: members } = useGroupMembersQuery(groupId)

  const options = useMemo(() => {
    return [
      { id: "any", username: "Any member", imageUrl: "" },
      ...(members?.map((member) => ({
        id: member.userId,
        username: member.user?.username!,
        imageUrl: member.user?.profile?.pictureUrl!,
      })) || []),
    ]
  }, [members])

  const value = useMemo(() => {
    return options?.find((option) => option.id === props.selectedUserId)
  }, [props.selectedUserId, options])

  return (
    <Autocomplete
      id="tags-standard"
      options={options}
      value={value}
      onKeyDown={(e) => {
        e.stopPropagation()
      }}
      disableCloseOnSelect
      onChange={(e, val) => {
        if (!val) {
          props.onChange(null)
          return
        }
        props.onChange(val.id)
      }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.username
      }
      renderInput={(params) => (
        <MyTextField {...params} label={"Voted as high impact"} size="small" />
      )}
    />
  )
}

export default VotedHighImpactSelector
