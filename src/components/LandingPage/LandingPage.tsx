import { Box, Container, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import FlexHCenter from "../_common/flexboxes/FlexHCenter";
import LoginForm from "./LoginForm/LoginForm";
import RegisterForm from "./RegisterForm/RegisterForm";

type CurrentFormType = "register" | "login";

const LandingPage = () => {
  const [currentForm, setCurrentForm] = useState<CurrentFormType>("login");

  return (
    <Container sx={{ mt: 10, maxWidth: 400 }}>
      <Paper sx={{ p: 2 }}>
        <FlexHCenter>
          <Typography variant="h6">Ideameter</Typography>

          <Box sx={{ mt: 3 }} />
          {currentForm === "register" && (
            <RegisterForm onClickSignIn={() => setCurrentForm("login")} />
          )}
          {currentForm === "login" && (
            <LoginForm onClickSignUp={() => setCurrentForm("register")} />
          )}
        </FlexHCenter>
      </Paper>
    </Container>
  );
};

export default LandingPage;
