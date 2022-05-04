import GlobalDialogs from "@/components/layout/dialogs/GlobalDialogs/GlobalDialogs";
import LoadingPage from "@/components/layout/LoadingPage/LoadingPage";
import SnackbarWrapper from "@/components/layout/SnackbarWrapper/SnackbarWrapper";
import useCheckAuthOrLogout from "@/hooks/domain/auth/useCheckAuthOrLogout";
import {
  CacheProvider as EmotionCacheProvider,
  EmotionCache,
} from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import createEmotionCache from "../createEmotionCache";
import theme from "../theme";
import "./global.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [queryClient] = useState(new QueryClient());
  const { checkAuthOrLogout, loading } = useCheckAuthOrLogout();

  useEffect(() => {
    checkAuthOrLogout();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EmotionCacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />

          {loading ? <LoadingPage /> : <Component {...pageProps} />}
          <GlobalDialogs />
          <ReactQueryDevtools initialIsOpen={false} />

          <SnackbarWrapper />
        </ThemeProvider>
      </EmotionCacheProvider>
    </QueryClientProvider>
  );
}
