import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import AuthUserGetDto from "@/types/domain/auth/AuthUserGetDto"
import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import { Box, Button, Link, Typography } from "@mui/material"
import { AxiosError } from "axios"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import FlexCol from "../../_common/flexboxes/FlexCol"
import MyTextField from "../../_common/inputs/MyTextField"

interface Props {
  onClickReturnSignIn: () => void
}

const PasswordResetForm = (props: Props) => {
  const { setErrorMessage, setSuccessMessage } = useSnackbarStore()
  const { setAuthUser } = useAuthStore()

  const { handleSubmit, formState, control } = useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
  })

  const [sent, setSent] = useState(false)

  const onSubmit = (values: { email: string }) => {
    myAxios
      .post<AuthUserGetDto>(urls.api.sendPasswordResetEmail, values)
      .then(() => {
        setSent(true)
      })
      .catch((err: AxiosError<any>) => {
        setErrorMessage(
          err?.response?.data?.message || "Error while sending email."
        )
      })
  }

  return (
    <div>
      {sent ? (
        <Box my={3}>
          <Typography variant="body2" align="center">
            Thanks! You’ll get an email with a link to reset your password
            shortly
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Tell us your email associated with Ideameter, and we’ll send a link
            to reset your password.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FlexCol mt={2}>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <MyTextField
                    id="email"
                    size="small"
                    label="Email"
                    fullWidth
                    required
                    InputLabelProps={{ required: false }}
                    {...field}
                  />
                )}
              />
              <Button
                sx={{ mt: 1 }}
                type="submit"
                variant="contained"
                color="primary"
              >
                SEND LINK
              </Button>
            </FlexCol>
          </form>
        </>
      )}

      <FlexVCenter mt={2} sx={{ justifyContent: "center" }}>
        <Typography variant="body2">
          Return to{" "}
          <Link onClick={props.onClickReturnSignIn} sx={{ cursor: "pointer" }}>
            sign in
          </Link>
        </Typography>
      </FlexVCenter>
    </div>
  )
}

export default PasswordResetForm
