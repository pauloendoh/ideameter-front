import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import LabelDto from "@/types/domain/label/LabelDto"
import { Typography } from "@mui/material"
import { MdCircle } from "react-icons/md"

interface Props {
  label: LabelDto
  liProps: React.HTMLAttributes<HTMLLIElement>
}

const LabelSelectorOption = ({ label, liProps }: Props) => {
  return (
    <li
      {...liProps}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <FlexVCenter justifyContent="space-between" width="100%">
        <FlexVCenter gap={1}>
          <MdCircle style={{ color: label.bgColor }} />
          <Typography>{label.name}</Typography>
        </FlexVCenter>

        <Typography fontSize={10} pl={2} fontStyle="italic">
          {label.group?.name || "No group"}
        </Typography>
      </FlexVCenter>
    </li>
  )
}

export default LabelSelectorOption
