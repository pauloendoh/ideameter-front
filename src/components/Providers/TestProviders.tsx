import createEmotionCache from "@/createEmotionCache"
import { ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"

const clientSideEmotionCache = createEmotionCache()

interface Props {
  test?: string
  children?: ReactNode
}

const TestProviders = (props: Props) => {
  const [queryClient] = useState(new QueryClient())

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}

export default TestProviders
