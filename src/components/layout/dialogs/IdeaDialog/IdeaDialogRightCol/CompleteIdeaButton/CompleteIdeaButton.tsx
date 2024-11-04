import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { useTheme } from "@mui/material"
import { useMemo } from "react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"

interface Props {
  watch: UseFormWatch<IdeaDto>
  setValue: UseFormSetValue<IdeaDto>
}

const CompleteIdeaButton = ({ watch, setValue }: Props) => {
  const theme = useTheme()

  const toggleIsDone = () => {
    const newCompletedAt = watch("isDone") ? null : new Date().toISOString()
    setValue("completedAt", newCompletedAt)

    setValue("isDone", !watch("isDone"))
    if (watch("isDone")) {
      setValue("completedAt", new Date().toISOString())
    } else {
      setValue("completedAt", null)
    }
  }

  const buttonBgColor = useMemo(() => {
    return watch("isDone") ? theme.palette.primary.main : undefined
  }, [watch("isDone")])

  return (
    <DarkButton
      startIcon={watch("isDone") ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
      sx={{
        justifyContent: "flex-start",
        pl: 2,
        backgroundColor: buttonBgColor,
        ":hover": {
          background: buttonBgColor,
        },
      }}
      onClick={toggleIsDone}
    >
      {watch("isDone") ? "Completed" : "Complete idea"}
    </DarkButton>
  )
}

export default CompleteIdeaButton
