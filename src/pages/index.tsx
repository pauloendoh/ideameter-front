import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import type { NextPage } from "next"
import dynamic from "next/dynamic"

const HomePage = dynamic(() => import("@/components/HomePage/HomePage"), {
  ssr: false,
})

const LandingPage = dynamic(
  () => import("../components/LandingPage/LandingPage"),
  {
    ssr: false,
  }
)

const Home: NextPage = () => {
  const { authUser } = useAuthStore()
  if (authUser) return <HomePage />
  return <LandingPage />
}

export default Home
