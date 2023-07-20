import { useRouter } from "next/router"

type UrlQueryParams = {
  groupId: string
  tabId: string
  ideaId: string
  redirectTo: string
}

export const useRouterQueryString = () => {
  const router = useRouter()
  if (router?.isReady) return router?.query as UrlQueryParams

  // necessary to pass through tests
  return {} as UrlQueryParams
}
