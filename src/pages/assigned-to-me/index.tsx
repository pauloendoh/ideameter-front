import Loading from "@/components/layout/LoadingPage/LoadingPage"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { Suspense } from "react"

const DynamicAssignedToMePage = dynamic(
  () => import("@/components/AssignedIdeasPage/AssignedIdeasPage"),
  {
    suspense: true,
  }
)

const AssignedToMePage: NextPage = () => (
  <>
    <Head>
      <title>Ideameter</title>
      <meta property="og:title" content="Ideameter - Assigned To Me" />
    </Head>
    <Suspense fallback={<Loading />}>
      <DynamicAssignedToMePage />
    </Suspense>
  </>
)

export default AssignedToMePage
