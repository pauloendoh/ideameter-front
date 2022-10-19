import GroupPageContent from "@/components/GroupPage/GroupPageContent/GroupPageContent"
import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"

interface Props {
  linkPreview: { title: string; description: string } | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
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
        <meta property="og:title" content={props.linkPreview?.title || "Ideameter"} />
        <meta
          property="og:description"
          content={
            props.linkPreview?.description || "Quickly align ideas within your team"
          }
        />
      </Head>
      <GroupPageContent />
    </>
  )
}

export default GroupId
