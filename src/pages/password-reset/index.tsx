import type { NextPage } from "next"
import dynamic from "next/dynamic"

const PasswordResetPageContent = dynamic(
  () => import("@/components/PasswordResetPage/PasswordResetPageContent"),
  {
    ssr: false,
  }
)

const PasswordResetPage: NextPage = () => {
  return <PasswordResetPageContent />
}

export default PasswordResetPage
