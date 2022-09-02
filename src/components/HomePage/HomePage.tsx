import { useCheckAndRedirectLastOpenedGroup } from "@/hooks/domain/group/useCheckAndRedirectLastOpenedGroup";
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import { useEffect } from "react";
import HomeLayout from "../layout/HomeLayout/HomeLayout";

const HomePage = () => {
  const query = useRouterQueryString();

  const checkAndRedirectLastOpenedGroup = useCheckAndRedirectLastOpenedGroup();

  useEffect(() => {
    if (!query.groupId) checkAndRedirectLastOpenedGroup();
  }, []);

  return <HomeLayout />;
};

export default HomePage;
