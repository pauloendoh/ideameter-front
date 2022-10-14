import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import { Box, Button, Container, Link, Paper, Typography } from "@mui/material"
import { AxiosError } from "axios"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import FlexCol from "../_common/flexboxes/FlexCol"
import FlexHCenter from "../_common/flexboxes/FlexHCenter"
import FlexVCenter from "../_common/flexboxes/FlexVCenter"
import MyTextField from "../_common/inputs/MyTextField"

type FormData = {
  password: string
  password2: string
}

type Dto = FormData & {
  token: string
  userId: string
}

interface Props {
  test?: string
}

const PasswordResetPageContent = (props: Props) => {
  const router = useRouter()
  const { token, userId } = router.query as {
    token?: string
    userId?: string
  }

  const { setErrorMessage, setSuccessMessage } = useSnackbarStore()

  const { handleSubmit, formState, control, watch } = useForm<FormData>({
    defaultValues: {
      password: "",
      password2: "",
    },
  })

  const [sent, setSent] = useState(false)

  const onSubmit = (values: FormData) => {
    myAxios
      .post(urls.api.resetPassword, {
        ...values,
        userId,
        token,
      } as Dto)
      .then(() => {
        setSent(true)
      })
      .catch((err: AxiosError<any>) => {
        setErrorMessage(
          err?.response?.data?.message || "Error while sending email."
        )
      })
  }

  const enableButton = useMemo(() => {
    const password = watch("password")
    const password2 = watch("password2")

    if (password.length === 0 || password2.length === 0) return false
    if (password !== password2) return false
    return true
  }, [watch("password"), watch("password2")])

  if (router.isReady && (!token || !userId)) {
    setErrorMessage("Token or user not found. Redirecting to login...")
    router.push(urls.pages.index)
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper sx={{ p: 2 }}>
        <FlexHCenter>
          <div>
            {sent ? (
              <Box my={3}>
                <Typography variant="body2" align="center">
                  Successful password reset!
                </Typography>
              </Box>
            ) : (
              <>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FlexCol mt={2}>
                    <Controller
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <MyTextField
                          id="password"
                          size="small"
                          label="New password"
                          type="password"
                          fullWidth
                          required
                          InputLabelProps={{ required: false }}
                          {...field}
                        />
                      )}
                    />
                    <Box mt={1} />
                    <Controller
                      control={control}
                      name="password2"
                      render={({ field }) => (
                        <MyTextField
                          id="password2"
                          size="small"
                          label="Confirm new password"
                          type="password"
                          fullWidth
                          required
                          InputLabelProps={{ required: false }}
                          {...field}
                        />
                      )}
                    />

                    <Button
                      disabled={!enableButton}
                      sx={{ mt: 1 }}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Reset Password
                    </Button>
                  </FlexCol>
                </form>
              </>
            )}

            <FlexVCenter mt={2} sx={{ justifyContent: "center" }}>
              <Typography variant="body2">
                Return to{" "}
                <NextLink href={urls.pages.index} passHref>
                  <Link sx={{ cursor: "pointer" }}>sign in</Link>
                </NextLink>
              </Typography>
            </FlexVCenter>
          </div>
        </FlexHCenter>
      </Paper>
    </Container>
  )
}

export default PasswordResetPageContent
