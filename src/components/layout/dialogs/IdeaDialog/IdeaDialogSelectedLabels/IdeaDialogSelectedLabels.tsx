import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import LabelDto from "@/types/domain/label/LabelDto"
import { Button, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { MdAdd } from "react-icons/md"
import SelectLabelsDialog from "../../SelectLabelsDialog/SelectLabelsDialog"

interface Props {
  idea: IdeaDto
  onChangeSelectedLabels: (newLabels: LabelDto[]) => void
}

const IdeaDialogSelectedLabels = (props: Props) => {
  const router = useRouter()
  const query = router.query as { groupId: string }

  const [openDialog, setOpenDialog] = useState(false)

  const sortedLabels = useMemo(() => {
    return (
      props.idea.labels?.sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt)
      ) || []
    )
  }, [props.idea.labels])

  return (
    <FlexCol gap={1}>
      <Typography>Labels</Typography>

      <Flex sx={{ flexWrap: "wrap", gap: 1 }}>
        {sortedLabels.map((label) => (
          <Button
            key={label.id}
            variant="contained"
            style={{ backgroundColor: label.bgColor, minHeight: 32 }}
            onClick={() => setOpenDialog(true)}
          >
            <Typography style={{ fontWeight: "bold", color: "white" }}>
              {label.name}
            </Typography>
          </Button>
        ))}
        <DarkButton
          onClick={() => setOpenDialog(true)}
          sx={{ width: 32, minHeight: 32 }}
        >
          <MdAdd />
        </DarkButton>

        <SelectLabelsDialog
          groupId={query.groupId}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          selectedLabels={sortedLabels}
          onChangeSelectedLabels={props.onChangeSelectedLabels}
        />
      </Flex>
    </FlexCol>
  )
}

export default IdeaDialogSelectedLabels
