import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { Suspense } from "react"
import Loading from "@/components/layout/LoadingPage/LoadingPage"

const DynamicAssignedToMePage = dynamic(
  () => import("@/components/AssignedIdeasPage"),
  {
    suspense: true,
  }
)

const AssignedToMePage: NextPage = (props) => {
  console.log(props)
  return (
    <>
      <Head>
        <title>Ideameter</title>
        <meta property="og:title" content="Ideameter" />
      </Head>
      <Suspense fallback={<Loading />}>
        <DynamicAssignedToMePage />
      </Suspense>
    </>
  )
}

export default AssignedToMePage
