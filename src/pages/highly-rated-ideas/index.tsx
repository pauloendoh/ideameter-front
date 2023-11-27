import HighlyRatedIdeasPage from "@/components/HighlyRatedIdeasPage/HighlyRatedIdeasPage"
import Head from "next/head"

const Page = () => (
  <>
    <Head>
      <title>Ideameter</title>
      <meta property="og:title" content="Ideameter - Highly rated ideas" />
    </Head>
    <HighlyRatedIdeasPage />
  </>
)

export default Page
