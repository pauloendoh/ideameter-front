import type { NextPage } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"

const DynamicAssignedToMePage = dynamic(
  () => import("@/components/AssignedIdeasPage/AssignedIdeasPage"),
  {
    ssr: false,
  }
)

const AssignedToMePage: NextPage = () => (
  <>
    <Head>
      <title>Ideameter</title>
      <meta property="og:title" content="Ideameter - Assigned To Me" />
    </Head>
    <DynamicAssignedToMePage />
  </>
)

export default AssignedToMePage
