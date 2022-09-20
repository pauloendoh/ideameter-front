import { useRouter } from "next/router"

export const useRouterQueryString = () => {
  const router = useRouter()
  return router.query as { groupId?: string; tabId?: string; ideaId?: string }
}
