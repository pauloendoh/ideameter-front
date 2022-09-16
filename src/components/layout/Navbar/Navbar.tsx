import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { Typography } from "@mui/material"
import S from "./Navbar.styles"
import NavbarUserMenu from "./NavbarUserMenu/NavbarUserMenu"
import NavbarUserNotifications from "./NavbarUserNotifications/NavbarUserNotifications"

const Navbar = () => {
  return (
    <S.AppBarRoot
      position="fixed"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <S.NavbarToolbar>
        <FlexVCenter>
          <Typography>Ideameter</Typography>
        </FlexVCenter>

        <FlexVCenter sx={{ gap: 2 }}>
          <NavbarUserNotifications />
          <NavbarUserMenu />
        </FlexVCenter>
      </S.NavbarToolbar>
    </S.AppBarRoot>
  )
}

export default Navbar
