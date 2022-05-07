import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import TabDto from "@/types/domain/group/tab/TabDto";
import urls from "@/utils/urls";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import GroupTabItem from "./GroupTabItem/GroupTabItem";
import S from "./styles";

interface Props {
  groupId: string;
  tabs: TabDto[];
}

const GroupTabs = (props: Props) => {
  const { authUser } = useAuthStore();
  const [tabIndex, setTabIndex] = useState(0);

  const router = useRouter();
  const query = router.query as { tabId?: string };

  useEffect(() => {
    if (query.tabId) {
      const index = props.tabs.findIndex((tab) => tab.id === query.tabId);
      if (index !== -1) setTabIndex(index);
      return;
    }

    const firstTab = props.tabs[0];
    if (firstTab) router.push(urls.pages.groupTab(props.groupId, firstTab.id));
  }, [query.tabId, props.tabs]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box
      sx={{
        maxWidth: {
          xs: 320,
          md: 400,
          lg: 500,
          xl: 600,
        },
      }}
    >
      <S.Tabs
        value={tabIndex}
        onChange={handleChange}
        aria-label="basic tabs example"
        variant="scrollable"
        scrollButtons="auto"
      >
        {props.tabs.map((tab) => (
          <GroupTabItem key={tab.id} groupId={props.groupId} tab={tab} />
        ))}
      </S.Tabs>
    </Box>
  );
};

export default GroupTabs;
