import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyReactLinkify from "@/components/_common/text/MyReactLinkify/MyReactLinkify"
import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import useSubideaRatingsQueryUtils from "@/hooks/react-query/domain/rating/useSubideaRatingsQueryUtils"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import { Badge, Box, TableCell, Tooltip, Typography } from "@mui/material"
import { useMemo } from "react"
import { MdDescription } from "react-icons/md"
import HighestSubideaInfo from "../../HighestSubideaInfo/HighestSubideaInfo"
import UserGroupAvatar from "../../UserTableCell/UserGroupAvatar/UserGroupAvatar"
import HighImpactVoteIcon from "./HighImpactVoteIcon/HighImpactVoteIcon"

interface Props {
  ideaRating: IdeaRating
}

const IdeaNameTableCell = (props: Props) => {
  const { groupId } = useRouterQueryString()
  const hasSubideas = useMemo(
    () => props.ideaRating.subideas.length > 0,
    [props.ideaRating.subideas]
  )

  const { data: subideasRatings } = useSubideaRatingsQueryUtils(
    props.ideaRating.idea.id,
    groupId!
  )

  const notRatedSubideasCount = useMemo(() => {
    if (!subideasRatings) return 0
    if (props.ideaRating.idea.isDone) return 0

    const notRated = subideasRatings.filter(
      (sr) => sr.yourRating === undefined && !sr.idea.isDone
    )

    return notRated.length
  }, [subideasRatings])

  const isSubidea = useMemo(() => {
    return !!props.ideaRating.idea.parentId
  }, [props.ideaRating.idea.parentId])

  const sortedLabels = useMemo(
    () => props.ideaRating.idea.labels.sort((a, b) => a.position - b.position),
    [props.ideaRating.idea.labels]
  )

  return (
    <TableCell>
      <FlexCol style={{ gap: 8 }}>
        {sortedLabels.length > 0 && (
          <Flex style={{ flexWrap: "wrap", gap: 4 }}>
            {sortedLabels.map((label) => (
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
          <Badge
            color="error"
            overlap="rectangular"
            badgeContent={notRatedSubideasCount}
          >
            <span
              style={{
                whiteSpace: "break-spaces",
                fontWeight: hasSubideas ? "bold" : undefined,
              }}
            >
              <MyReactLinkify openNewTab stopPropagation>
                {props.ideaRating.idea.name}
              </MyReactLinkify>

              {!isSubidea && props.ideaRating.idea.description.length > 0 && (
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

        {hasSubideas && (
          <HighestSubideaInfo ideaId={props.ideaRating.idea.id} />
        )}

        {isSubidea && props.ideaRating.idea.description.length > 0 && (
          <Flex>
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                whiteSpace: "pre-wrap",
              }}
            >
              {props.ideaRating.idea.description}
            </Typography>
          </Flex>
        )}

        <FlexVCenter justifyContent="space-between">
          <Flex gap={0.5} flexWrap="wrap">
            {props.ideaRating.idea.assignedUsers?.map((user) => (
              <UserGroupAvatar
                userId={user.id}
                groupId={groupId!}
                avatarProps={{
                  sx: { width: 24, height: 24, fontSize: 14 },
                }}
                widthAndHeight={24}
                key={user.id}
              />
            ))}
          </Flex>

          {props.ideaRating.idea.highImpactVotes?.length > 0 && (
            <HighImpactVoteIcon
              groupId={groupId!}
              ideaRating={props.ideaRating}
            />
          )}
        </FlexVCenter>
      </FlexCol>
    </TableCell>
  )
}

export default IdeaNameTableCell
