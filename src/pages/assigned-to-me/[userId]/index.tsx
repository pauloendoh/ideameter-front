import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { Suspense } from "react"
import Loading from "@/components/layout/LoadingPage/LoadingPage"
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { ideaId } = context.query
//   let linkPreview = null
//   if (ideaId) {
//     const res = await myAxios.get<{ title: string; description: string }>(
//       urls.api.ideaName(String(ideaId))
//     )
//     if (res.data) linkPreview = res.data
//   }
//   return {
//     props: {
//       linkPreview,
//     },
//   }
// }

const DynamicAssignedToMePage = dynamic(
  () => import("@/components/AssignedIdeasPage"),
  {
    suspense: true,
  }
)

const GroupId: NextPage = (props) => {
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

export default GroupId
