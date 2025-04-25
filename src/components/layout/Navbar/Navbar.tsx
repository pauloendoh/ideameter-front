import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useMyMediaQuery } from "@/hooks/utils/useMyMediaQuery"
import { Typography } from "@mui/material"
import S from "./Navbar.styles"
import NavbarSearch from "./NavbarSearch/NavbarSearch"
import NavbarUserMenu from "./NavbarUserMenu/NavbarUserMenu"
import NavbarUserNotifications from "./NavbarUserNotifications/NavbarUserNotifications"

const Navbar = () => {
  const { isMobile } = useMyMediaQuery()

  return (
    <S.AppBarRoot
      position="fixed"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <S.NavbarToolbar>
        <FlexVCenter gap={10}>
          <Typography variant="h6">Ideameter</Typography>
        </FlexVCenter>

        <FlexVCenter>
          <NavbarSearch />
          <NavbarUserNotifications />
          <NavbarUserMenu />
        </FlexVCenter>
      </S.NavbarToolbar>
    </S.AppBarRoot>
  )
}

export default Navbar
