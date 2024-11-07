import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexHCenter from "@/components/_common/flexboxes/FlexHCenter"
import MyNextLink from "@/components/_common/MyNextLink/MyNextLink"
import TimeagoSpan from "@/components/_common/text/TimeagoSpan"
import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import useGroupInsightsDialogStore from "@/hooks/zustand/dialogs/useGroupInsightsDialogStore"
import { useLastCommentsInGroupQuery } from "@/types/domain/insights/useLastCommentsInGroupQuery"
import urls from "@/utils/urls"
import {
  CircularProgress,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"

interface Props {
  groupId: string
}

const LastCommentsTab = (props: Props) => {
  const { dialogIsOpen } = useGroupInsightsDialogStore()
  const { data } = useLastCommentsInGroupQuery(props.groupId, {
    enabled: dialogIsOpen,
  })
  return (
    <Paper>
      <FlexCol sx={{ gap: 2 }}>
        <Typography variant="h6" p={2} pb={0}>
          Last comments
        </Typography>

        {!data && <CircularProgress />}

        {!data?.length ? (
          <Typography p={2}>No comments found</Typography>
        ) : (
          <Table
            sx={{
              // first and 3rd columns are centered
              "& td:first-child, & td:nth-child(3), & th:first-child, & th:nth-child(3)":
                {
                  textAlign: "center",
                },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell width="40px">User</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell width="120px">Updated at</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((comment) => (
                <TableRow key={comment.createdAt}>
                  <TableCell>
                    <FlexHCenter>
                      <UserGroupAvatar
                        groupId={props.groupId}
                        userId={comment.user.id}
                      />
                    </FlexHCenter>
                  </TableCell>
                  <TableCell>
                    <MyNextLink
                      href={urls.pages.groupTabIdea(
                        props.groupId,
                        comment.targetIdea.tabId,
                        comment.targetIdea.id
                      )}
                    >
                      <Link
                        sx={{
                          textDecoration: "none",
                          fontWeight: 500,
                          ":hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {comment.targetIdea.name}
                      </Link>
                    </MyNextLink>
                    <Typography
                      variant="body2"
                      title={comment.text}
                      sx={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {comment.text}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <TimeagoSpan date={comment.updatedAt} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </FlexCol>
    </Paper>
  )
}

export default LastCommentsTab
