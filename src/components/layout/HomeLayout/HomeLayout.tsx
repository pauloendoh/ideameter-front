import Flex from "@/components/_common/flexboxes/Flex"
import useCheckAuthOrLogout from "@/hooks/domain/auth/useCheckAuthOrLogout"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { Box } from "@mui/material"
import React, { useEffect } from "react"
import Navbar from "../Navbar/Navbar"
import Sidebar from "../Sidebar/Sidebar"
import GlobalDialogs from "../dialogs/GlobalDialogs/GlobalDialogs"

interface Props {
  children?: React.ReactNode
}

const HomeLayout = (props: Props) => {
  const authUser = useAuthStore((s) => s.authUser)

  const { checkAuthOrLogout } = useCheckAuthOrLogout()

  useEffect(() => {
    checkAuthOrLogout()
  }, [])

  if (!authUser) return null

  return (
    <div>
      <Navbar />

      <Flex>
        <Sidebar />

        <Box sx={{ mt: 10, flexGrow: 1 }}>{props.children}</Box>

        <GlobalDialogs />
      </Flex>
    </div>
  )
}

export default HomeLayout
