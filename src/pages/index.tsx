import HomePage from "@/components/HomePage/HomePage"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import type { NextPage } from "next"
import LandingPage from "../components/LandingPage/LandingPage"

const Home: NextPage = () => {
  const { authUser } = useAuthStore()
  if (authUser) return <HomePage />
  return <LandingPage />
}

export default Home
