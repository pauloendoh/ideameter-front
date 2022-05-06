import useGroupRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useGroupRatingsQuery";
import useTabIdeasQuery from "@/hooks/react-query/domain/group/tab/idea/useTabIdeasQuery";
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import TabDto from "@/types/domain/group/tab/TabDto";
import urls from "@/utils/urls";
import { Badge, Tab, Typography } from "@mui/material";
import Link from "next/link";
import React, { useMemo } from "react";

interface Props {
  groupId: string;
  tab: TabDto;
}

const GroupTabItem = (props: Props) => {
  const { authUser } = useAuthStore();
  const { data: groupRatings } = useGroupRatingsQuery(props.groupId);
  const { data: tabIdeas } = useTabIdeasQuery(props.tab.id);

  const notRatedCount = useMemo(() => {
    if (!authUser || !groupRatings || !tabIdeas) return 0;

    const tabIdeaIds = tabIdeas
      .filter((idea) => idea.tabId === props.tab.id)
      .map((idea) => idea.id);

    const userRatings = groupRatings.filter(
      (rating) => rating.userId === authUser.id
    );
    const userRatingIdeaIds = userRatings.map((r) => r.ideaId);

    const userRatedTabIdeaIds = tabIdeaIds.filter((ideaId) =>
      userRatingIdeaIds.includes(ideaId)
    );

    return tabIdeaIds.length - userRatedTabIdeaIds.length;
  }, [authUser, groupRatings, tabIdeas]);

  return (
    <Link href={urls.pages.groupTab(props.groupId, props.tab.id)}>
      <a style={{ color: "inherit" }}>
        <Tab
          key={props.tab.id}
          title={props.tab.name}
          sx={{
            maxWidth: {
              xs: 100,
              md: 150,
              lg: 200,
            },
          }}
          label={
            <Badge
              color="error"
              overlap="rectangular"
              badgeContent={notRatedCount}
              componentsProps={{
                badge: {
                  style: { right: -4 },
                  title: `You have ${notRatedCount} ideas to rate`,
                },
              }}
            >
              <Typography noWrap sx={{ maxWidth: "100%" }}>
                {props.tab.name}
              </Typography>
            </Badge>
          }
        />
      </a>
    </Link>
  );
};

export default GroupTabItem;
