import { Box, Container, Paper, Typography } from "@mui/material"
import { useState } from "react"
import FlexHCenter from "../_common/flexboxes/FlexHCenter"
import LoginForm from "./LoginForm/LoginForm"
import PasswordResetForm from "./PasswordResetForm/PasswordResetForm"
import RegisterForm from "./RegisterForm/RegisterForm"

type CurrentFormType = "register" | "login" | "passwordReset"

const LandingPage = () => {
  const [currentForm, setCurrentForm] = useState<CurrentFormType>("login")

  return (
    <Container sx={{ mt: 10, maxWidth: 400 }}>
      <Paper sx={{ p: 2 }}>
        <FlexHCenter>
          <Typography variant="h6">
            {currentForm === "passwordReset"
              ? "Reset your password"
              : "Ideameter"}
          </Typography>

          <Box sx={{ mt: 3 }} />
          {currentForm === "register" && (
            <RegisterForm onClickSignIn={() => setCurrentForm("login")} />
          )}
          {currentForm === "login" && (
            <LoginForm
              onClickSignUp={() => setCurrentForm("register")}
              onClickForgotPassword={() => setCurrentForm("passwordReset")}
            />
          )}

          {currentForm === "passwordReset" && (
            <PasswordResetForm
              onClickReturnSignIn={() => setCurrentForm("login")}
            />
          )}
        </FlexHCenter>
      </Paper>
    </Container>
  )
}

export default LandingPage
