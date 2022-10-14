import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"

const GroupPageContent = dynamic(
  () => import("@/components/GroupPage/GroupPageContent/GroupPageContent"),
  {
    ssr: false,
  }
)

interface Props {
  linkPreview: { title: string; description: string } | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { ideaId } = context.query
  let linkPreview = null
  if (ideaId) {
    const res = await myAxios.get<{ title: string; description: string }>(
      urls.api.ideaName(String(ideaId))
    )
    if (res.data) linkPreview = res.data
  }
  return {
    props: {
      linkPreview,
    },
  }
}

const GroupId: NextPage<Props> = (props) => {
  return (
    <>
      <Head>
        <title>Ideameter</title>
        <meta
          property="og:title"
          content={props.linkPreview?.title || "Ideameter"}
        />
        <meta
          property="og:description"
          content={
            props.linkPreview?.description ||
            "Quickly align ideas within your team"
          }
        />
      </Head>
      <GroupPageContent />
    </>
  )
}

export default GroupId
