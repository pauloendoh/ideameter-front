import dynamic from "next/dynamic"
import Head from "next/head"

const DynamicAssignedToMePage = dynamic(
  () => import("@/components/AssignedIdeasPage/AssignedIdeasPage"),
  {
    ssr: false,
  }
)

const Page = () => (
  <>
    <Head>
      <title>Ideameter</title>
      <meta property="og:title" content="Ideameter - Assigned to me" />
    </Head>
    <DynamicAssignedToMePage />
  </>
)

export default Page
