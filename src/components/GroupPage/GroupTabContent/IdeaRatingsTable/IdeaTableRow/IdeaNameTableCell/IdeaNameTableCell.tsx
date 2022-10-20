import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyReactLinkify from "@/components/_common/text/MyReactLinkify/MyReactLinkify"
import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import useSubideaRatingsQueryUtils from "@/hooks/react-query/domain/rating/useSubideaRatingsQueryUtils"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { Badge, Box, TableCell, Tooltip, Typography, useTheme } from "@mui/material"
import { useMemo } from "react"
import { MdDescription, MdOfflineBolt } from "react-icons/md"
import HighestSubideaInfo from "../../HighestSubideaInfo/HighestSubideaInfo"
import UserGroupAvatar from "../../UserTableCell/UserGroupAvatar/UserGroupAvatar"

interface Props {
  ideaRating: IdeaRating
}

const IdeaNameTableCell = (props: Props) => {
  const theme = useTheme()
  const { groupId } = useRouterQueryString()
  const hasSubideas = useMemo(
    () => props.ideaRating.subideas.length > 0,
    [props.ideaRating.subideas]
  )

  const { data: subideasRatings } = useSubideaRatingsQueryUtils(
    props.ideaRating.idea.id,
    groupId!
  )

  const authUser = useAuthStore((s) => s.authUser)

  const youVotedHighImpact = useMemo(
    () =>
      Boolean(
        props.ideaRating.idea.highImpactVotes?.find((v) => v.userId === authUser!.id)
      ),
    [props.ideaRating.idea.highImpactVotes, authUser]
  )

  const notRatedSubideasCount = useMemo(() => {
    if (!subideasRatings) return 0
    if (props.ideaRating.idea.isDone) return 0

    return subideasRatings.filter((r) => r.yourRating === null).length
  }, [subideasRatings])

  return (
    <TableCell>
      <FlexCol style={{ gap: 8 }}>
        {props.ideaRating.idea.labels?.length > 0 && (
          <Flex style={{ flexWrap: "wrap", gap: 4 }}>
            {props.ideaRating.idea.labels.map((label) => (
              <div
                key={label.id}
                style={{
                  background: label.bgColor,
                  padding: "2px 4px",
                  borderRadius: 4,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {label.name}
              </div>
            ))}
          </Flex>
        )}
        <Box>
          <Badge color="error" overlap="rectangular" badgeContent={notRatedSubideasCount}>
            <span
              style={{
                whiteSpace: "break-spaces",
                fontWeight: hasSubideas ? "bold" : undefined,
              }}
            >
              <MyReactLinkify openNewTab stopPropagation>
                {props.ideaRating.idea.name}
              </MyReactLinkify>

              {props.ideaRating.idea.description.length > 0 && (
                <Tooltip title="This idea contains a description">
                  <span>
                    <MdDescription
                      style={{
                        position: "relative",
                        bottom: notRatedSubideasCount > 0 ? -10 : -2,
                        left: 6,
                      }}
                    />
                  </span>
                </Tooltip>
              )}
            </span>
          </Badge>
        </Box>

        {hasSubideas && <HighestSubideaInfo ideaId={props.ideaRating.idea.id} />}

        <FlexVCenter justifyContent="space-between">
          <Flex gap={0.5} flexWrap="wrap">
            {props.ideaRating.idea.assignedUsers?.map((user) => (
              <UserGroupAvatar
                userId={user.id}
                groupId={groupId!}
                avatarProps={{
                  sx: { width: 24, height: 24, fontSize: 14 },
                }}
                key={user.id}
              />
            ))}
          </Flex>

          {props.ideaRating.idea.highImpactVotes?.length > 0 && (
            <Tooltip
              arrow
              title={
                <FlexCol gap={0.5}>
                  <Typography>
                    {props.ideaRating.idea.highImpactVotes.length} voted as high impact
                  </Typography>
                  <FlexVCenter gap={0.5}>
                    {props.ideaRating.idea.highImpactVotes.map((vote) => (
                      <UserGroupAvatar
                        userId={vote.userId}
                        groupId={groupId!}
                        avatarProps={{
                          sx: { width: 24, height: 24, fontSize: 12 },
                        }}
                        key={vote.userId}
                      />
                    ))}
                  </FlexVCenter>
                </FlexCol>
              }
            >
              {/* had to use div instead of FlexVCenter due to tooltip */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <MdOfflineBolt
                  fontSize={18}
                  style={{
                    color: youVotedHighImpact ? theme.palette.secondary.main : undefined,
                  }}
                />
                <Typography
                  style={{
                    color: youVotedHighImpact ? theme.palette.secondary.main : undefined,
                  }}
                >
                  {props.ideaRating.idea.highImpactVotes.length}
                </Typography>
              </div>
            </Tooltip>
          )}
        </FlexVCenter>
      </FlexCol>
    </TableCell>
  )
}

export default IdeaNameTableCell
