import TabDto from "@/types/domain/group/tab/TabDto";
import urls from "@/utils/urls";
import { Box, Tab, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import S from "./styles";

interface Props {
  groupId: string;
  tabs: TabDto[];
}

const GroupTabs = (props: Props) => {
  const [tabIndex, setTabIndex] = useState<number>();

  const router = useRouter();
  const query = router.query as { tabId?: string };

  useEffect(() => {
    if (query.tabId) {
      setTabIndex(props.tabs.findIndex((tab) => tab.id === query.tabId));
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
        {props.tabs.map((tab, index) => (
          <Link href={urls.pages.groupTab(props.groupId, tab.id)}>
            <a style={{ color: "inherit" }}>
              <Tooltip title={tab.name}>
                <Tab
                  key={tab.id}
                  sx={{
                    maxWidth: {
                      xs: 100,
                      md: 150,
                      lg: 200,
                    },
                  }}
                  label={
                    <Typography noWrap sx={{ maxWidth: "100%" }}>
                      {tab.name}
                    </Typography>
                  }
                />
              </Tooltip>
            </a>
          </Link>
        ))}
      </S.Tabs>
    </Box>
  );
};

export default GroupTabs;
