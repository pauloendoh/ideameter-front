import NextLink from "next/link"

import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import useGroupInsightsDialogStore from "@/hooks/zustand/dialogs/useGroupInsightsDialogStore"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { useGroupMembersLastRatingsQuery } from "@/types/domain/insights/useGroupMembersLastRatingsQuery"
import useMissingRatingsFromGroupQuery from "@/types/domain/insights/useMissingRatingsFromGroupQuery"
import { capitalize } from "@/utils/text/capitalize"
import urls from "@/utils/urls"
import {
  Badge,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { format } from "timeago.js"

interface Props {
  groupId: string
}

const MissingRatingsTab = (props: Props) => {
  const { dialogIsOpen } = useGroupInsightsDialogStore()
  const { data: missingRatings } = useMissingRatingsFromGroupQuery(
    props.groupId
  )

  const { authUser } = useAuthStore()

  const [selectedUserId, setSelectedUserId] = useState("")

  useEffect(() => {
    if (authUser) {
      setSelectedUserId(authUser.id)
    }
  }, [])

  const { data: groupMembers } = useGroupMembersQuery(props.groupId)

  const selectedUser = useMemo(() => {
    return groupMembers?.find((item) => item.userId === selectedUserId)
  }, [selectedUserId, groupMembers])

  const { data: allLastRatings } = useGroupMembersLastRatingsQuery(
    props.groupId,
    {
      enabled: dialogIsOpen,
    }
  )

  const visibleLastRatings = useMemo(() => {
    return (
      allLastRatings?.find((item) => item.userId === selectedUserId)?.ratings ||
      []
    )
  }, [allLastRatings, selectedUserId])

  return (
    <FlexCol sx={{ gap: 2 }}>
      <FlexVCenter sx={{ gap: 1 }}>
        {missingRatings?.map((item) => (
          <Badge key={item.userId} badgeContent={item.count} color="primary">
            <UserGroupAvatar
              onClick={() => setSelectedUserId(item.userId)}
              groupId={props.groupId}
              userId={item.userId}
              selected={selectedUserId === item.userId}
            />
          </Badge>
        ))}
      </FlexVCenter>
      <FlexCol>
        {selectedUser && (
          <Paper>
            <Typography
              variant="h6"
              sx={{
                p: 2,
              }}
            >
              {selectedUser.user?.username}'s last ratings
            </Typography>
            {visibleLastRatings.length === 0 && (
              <Typography p={2}>No ratings found</Typography>
            )}
            {visibleLastRatings.length > 0 && (
              <Table
                sx={{
                  th: {
                    fontWeight: "bold",
                  },
                  "th, td": {
                    p: 1.5,
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Idea</TableCell>
                    <TableCell width="76px" align="center">
                      Rating
                    </TableCell>
                    <TableCell width="120px" align="center">
                      Last updated
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleLastRatings.map((rating) => {
                    return (
                      <TableRow key={rating.idea.id}>
                        <TableCell
                          sx={{
                            "a:hover": {
                              textDecoration: "underline !important",
                            },
                          }}
                        >
                          <NextLink
                            key={rating.idea.id}
                            href={urls.pages.groupTabIdea(
                              props.groupId,
                              rating.idea.tabId,
                              rating.idea.id
                            )}
                          >
                            <a
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                              }}
                            >
                              {rating.idea.name}
                            </a>
                          </NextLink>
                        </TableCell>
                        <TableCell align="center" width="76px">
                          {rating.rating}
                        </TableCell>
                        <TableCell align="center" width="120px">
                          <span title={rating.updatedAt}>
                            {capitalize(format(rating.updatedAt))}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </Paper>
        )}
      </FlexCol>
    </FlexCol>
  )
}

export default MissingRatingsTab
