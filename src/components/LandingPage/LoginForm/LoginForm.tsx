import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import AuthUserGetDto from "@/types/domain/auth/AuthUserGetDto"
import LoginDto from "@/types/domain/auth/LoginDto"
import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import { Button, Link, Typography } from "@mui/material"
import { AxiosError } from "axios"
import { Controller, useForm } from "react-hook-form"
import FlexCol from "../../_common/flexboxes/FlexCol"
import MyTextField from "../../_common/inputs/MyTextField"

interface Props {
  onClickSignUp: () => void
}

const RegisterForm = (props: Props) => {
  const { setErrorMessage, setSuccessMessage } = useSnackbarStore()
  const { setAuthUser } = useAuthStore()

  const { handleSubmit, formState, control } = useForm<LoginDto>({
    defaultValues: {
      identificator: "",
      password: "",
    },
  })

  const onSubmit = (values: LoginDto) => {
    myAxios
      .post<AuthUserGetDto>(urls.api.login, values)
      .then((res) => {
        setAuthUser(res.data)
        setSuccessMessage("Login successful!")
      })
      .catch((err: AxiosError<any>) => {
        setErrorMessage(err?.response?.data?.message || "Error during login")
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlexCol sx={{ gap: 2 }}>
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
          <Button type="submit" variant="contained" color="primary">
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

export default RegisterForm
