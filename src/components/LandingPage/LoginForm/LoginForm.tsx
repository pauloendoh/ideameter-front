import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import AuthUserGetDto from "@/types/domain/auth/AuthUserGetDto"
import LoginDto from "@/types/domain/auth/LoginDto"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { Button, Link, Typography } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import FlexCol from "../../_common/flexboxes/FlexCol"
import MyTextField from "../../_common/inputs/MyTextField"

interface Props {
  onClickSignUp: () => void
  onClickForgotPassword: () => void
}

const LoginForm = (props: Props) => {
  const { setErrorMessage, setSuccessMessage } = useSnackbarStore()
  const { setAuthUser } = useAuthStore()

  const axios = useAxios()
  const { handleSubmit, control } = useForm<LoginDto>({
    defaultValues: {
      identificator: "",
      password: "",
    },
  })

  const onSubmit = (values: LoginDto) => {
    axios.post<AuthUserGetDto>(urls.api.login, values).then((res) => {
      setAuthUser(res.data)
      setSuccessMessage("Login successful!")
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlexCol>
          <FlexCol sx={{ gap: 1 }}>
            <Controller
              control={control}
              name="identificator"
              render={({ field }) => (
                <MyTextField
                  id="identificator"
                  size="small"
                  label="Username or email"
                  fullWidth
                  required
                  autoFocus
                  InputLabelProps={{ required: false }}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <MyTextField
                  id="password"
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
          </FlexCol>
          <FlexVCenter sx={{ mt: 1, justifyContent: "flex-end" }}>
            <Link
              variant="body2"
              onClick={props.onClickForgotPassword}
              sx={{ cursor: "pointer" }}
            >
              Forgot your password?
            </Link>
          </FlexVCenter>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
        </FlexCol>
      </form>
      <Typography sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <Link href="#" onClick={props.onClickSignUp}>
          Sign up
        </Link>
      </Typography>
    </div>
  )
}

export default LoginForm
