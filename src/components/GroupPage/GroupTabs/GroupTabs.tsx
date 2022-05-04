import TabDto from "@/types/domain/group/tab/TabDto";
import urls from "@/utils/urls";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Props {
  groupId: string;
  tabs: TabDto[];
}

const GroupTabs = (props: Props) => {
  const [tabIndex, setTabIndex] = useState<number>();

  const router = useRouter();
  const query = router.query as { tab?: string };

  useEffect(() => {
    if (query.tab) {
      setTabIndex(props.tabs.findIndex((tab) => tab.id === query.tab));
      return;
    }

    const firstTab = props.tabs[0];
    if (firstTab) router.push(urls.pages.groupTab(props.groupId, firstTab.id));
  }, [query.tab, props.tabs]);

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
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        aria-label="basic tabs example"
        variant="scrollable"
        scrollButtons="auto"
      >
        {props.tabs.map((tab, index) => (
          <Link href={urls.pages.groupTab(props.groupId, tab.id)}>
            <a style={{ color: "inherit" }}>
              <Tab
                key={tab.id}
                label={
                  <Typography sx={{ maxWidth: 125 }} noWrap>
                    {tab.name}
                  </Typography>
                }
              />
            </a>
          </Link>
        ))}
      </Tabs>
    </Box>
  );
};

export default GroupTabs;
