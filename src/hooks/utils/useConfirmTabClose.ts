import { useEffect } from "react"

const useConfirmTabClose = (
  mustConfirm: boolean,
  message = "You have unsaved changes. Continue?" // depends on the browser
) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (mustConfirm) {
        event.returnValue = message
        return message
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mustConfirm])
}

export default useConfirmTabClose
