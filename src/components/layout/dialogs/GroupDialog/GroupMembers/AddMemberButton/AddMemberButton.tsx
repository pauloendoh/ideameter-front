import AddMemberDialog from "@/components/layout/dialogs/AddMemberDialog/AddMemberDialog"
import FlexCircle from "@/components/_common/flexboxes/FlexCircle"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import { Button, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { RiUserAddLine } from "react-icons/ri"

interface Props {
  groupId: string
}

const AddMemberButton = (props: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data } = useGroupMembersQuery(props.groupId)

  const currentMemberIds = useMemo(() => {
    return data?.map((member) => member.userId) || []
  }, [data])

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        sx={{
          color: "inherit",
          display: "flex",
          justifyContent: "left",

          p: 1,
          borderRadius: 0.5,
        }}
      >
        <FlexVCenter sx={{ gap: 1.5 }}>
          <FlexCircle
            sx={{
              background: (theme) => theme.palette.primary.main,
              width: 32,
              height: 32,
            }}
          >
            <RiUserAddLine />
          </FlexCircle>
          <Typography>Add member</Typography>
        </FlexVCenter>
      </Button>

      <AddMemberDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        groupId={props.groupId}
        currentMemberIds={currentMemberIds}
      />
    </>
  )
}

export default AddMemberButton
