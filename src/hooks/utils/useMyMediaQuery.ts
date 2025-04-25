import { useMediaQuery, useViewportSize } from "@mantine/hooks"
import { useMemo } from "react"

export const useMyMediaQuery = () => {
  const { width: screenWidth } = useViewportSize()

  const isSmallScreen = useMemo(() => screenWidth < 768, [screenWidth])
  const isMobile = useMemo(() => screenWidth < 576, [screenWidth])
  const isLoading = useMemo(() => screenWidth === 0, [screenWidth])

  const isTouchScreen = useMediaQuery("pointer:coarce")

  return {
    screenWidth,
    isSmallScreen,
    isMobile,
    isLoading,
    isTouchScreen,
  }
}
