import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import AuthUserGetDto from "@/types/domain/auth/AuthUserGetDto";
import myAxios from "@/utils/axios/myAxios";
import urls from "@/utils/urls";
import { Button, Link, Typography } from "@mui/material";
import { AxiosError } from "axios";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import RegisterDto from "../../../types/domain/auth/RegisterDto";
import FlexCol from "../../_common/flexboxes/FlexCol";
import MyTextField from "../../_common/inputs/MyTextField";

interface Props {
  onClickSignIn: () => void;
}

const RegisterForm = (props: Props) => {
  const { setErrorMessage, setSuccessMessage } = useSnackbarStore();
  const { setAuthUser } = useAuthStore();

  const { handleSubmit, formState, control } = useForm<RegisterDto>({
    defaultValues: {
      email: "",
      username: "",
      password1: "",
      password2: "",
    },
  });

  const onSubmit = (values: RegisterDto) => {
    if (values.password1 !== values.password2) {
      return;
    }

    // setResponseErrors([]);

    myAxios
      .post<AuthUserGetDto>(urls.api.register, values)
      .then((res) => {
        setAuthUser(res.data);
        setSuccessMessage("Successfully registered!");
      })
      .catch((err: AxiosError<string>) => {
        setErrorMessage(err?.response?.data || "Error");
        // setResponseErrors(err.response.data.errors);
        // setSubmitting(false);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlexCol sx={{ gap: 2 }}>
          <FlexCol sx={{ gap: 1 }}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <MyTextField
                  id="email"
                  size="small"
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  InputLabelProps={{ required: false }}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <MyTextField
                  id="username"
                  size="small"
                  label="Username"
                  fullWidth
                  required
                  InputLabelProps={{ required: false }}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="password1"
              render={({ field }) => (
                <MyTextField
                  id="password1"
                  size="small"
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  InputLabelProps={{ required: false }}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="password2"
              render={({ field }) => (
                <MyTextField
                  id="password2"
                  size="small"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  required
                  InputLabelProps={{ required: false }}
                  {...field}
                />
              )}
            />
          </FlexCol>
          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </FlexCol>
      </form>
      <Typography sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link href="#" onClick={props.onClickSignIn}>
          Sign in
        </Link>
      </Typography>
    </div>
  );
};

export default RegisterForm;
