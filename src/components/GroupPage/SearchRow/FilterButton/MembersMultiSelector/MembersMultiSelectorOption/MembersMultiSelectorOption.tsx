import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import ProfilePicture from "@/components/_common/ProfilePicture/ProfilePicture"
import UserGroupDto from "@/types/domain/group/UserGroupDto"
import { Typography } from "@mui/material"

interface Props {
  groupMember: UserGroupDto
  liProps: React.HTMLAttributes<HTMLLIElement>
}

const MembersMultiSelectorOption = ({ groupMember, liProps }: Props) => {
  return (
    <li
      {...liProps}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <FlexVCenter style={{ gap: 8 }}>
        <ProfilePicture
          pictureUrl={groupMember.user?.profile?.pictureUrl ?? ""}
          username={groupMember.user?.username ?? ""}
          size={24}
        />
        <Typography>{groupMember.user?.username}</Typography>
      </FlexVCenter>
    </li>
  )
}

export default MembersMultiSelectorOption
