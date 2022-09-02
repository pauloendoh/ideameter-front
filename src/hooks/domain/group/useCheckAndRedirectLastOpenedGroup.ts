import myAxios from "@/utils/axios/myAxios";
import urls from "@/utils/urls";
import router from "next/router";

export const useCheckAndRedirectLastOpenedGroup = () => {
  const checkAndRedirectLastOpenedGroup = () => {
    myAxios.get<string>(urls.api.lastOpenedGroupId).then((res) => {
      if (res.data) router.push(urls.pages.groupId(res.data));
    });
  };

  return checkAndRedirectLastOpenedGroup;
};
