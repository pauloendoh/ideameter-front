import HighImpactVotedPage from "@/components/HighImpactVotedPage/HighImpactVotedPage"
import Head from "next/head"

const Page = () => (
  <>
    <Head>
      <title>Ideameter</title>
      <meta property="og:title" content="Ideameter - High impact voted" />
    </Head>
    <HighImpactVotedPage />
  </>
)

export default Page
