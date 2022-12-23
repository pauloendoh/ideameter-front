import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { Snackbar } from "@mui/material"
import MuiAlert, { AlertProps } from "@mui/material/Alert"
import React from "react"
import S from "./SnackbarWrapper.styles"

// Zustand version!
const SnackbarWrapper = () => {
  const {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
  } = useSnackbarStore()

  const handleCloseSuccess = (
    event?: Event | React.SyntheticEvent<any, Event>,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return
    }

    setSuccessMessage("")
  }

  const handleCloseError = (
    event?: Event | React.SyntheticEvent<any, Event>,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return
    }
    setErrorMessage("")
  }

  return (
    <S.Root>
      <Snackbar
        id="success-message"
        open={successMessage.length > 0}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" style={{ color: "white" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        id="error-message"
        open={errorMessage.length > 0}
        autoHideDuration={3000}
        onClose={handleCloseError}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <Alert onClose={handleCloseError} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </S.Root>
  )
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default SnackbarWrapper
