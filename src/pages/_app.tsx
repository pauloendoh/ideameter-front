import SnackbarWrapper from "@/components/layout/SnackbarWrapper/SnackbarWrapper"
import useCheckAuthOrLogout from "@/hooks/domain/auth/useCheckAuthOrLogout"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"

import {
  CacheProvider as EmotionCacheProvider,
  EmotionCache,
} from "@emotion/react"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AppProps } from "next/app"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import createEmotionCache from "../createEmotionCache"
import theme from "../theme"
import "./global.css"

const IoProvider = dynamic<any>(
  () => import("socket.io-react-hook").then((module) => module.IoProvider),
  {
    ssr: false,
  }
)

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const [queryClient] = useState(new QueryClient())
  const { checkAuthOrLogout, loading } = useCheckAuthOrLogout()

  useEffect(() => {
    checkAuthOrLogout()
  }, [])

  return (
    <EmotionCacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <IoProvider>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />

              <Component {...pageProps} />
              <ReactQueryDevtools initialIsOpen={false} />
            </IoProvider>
          </LocalizationProvider>
          <SnackbarWrapper />
        </ThemeProvider>
      </QueryClientProvider>
    </EmotionCacheProvider>
  )
}
