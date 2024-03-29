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
      <FlexVCenter style={{ gap: 8 }}>
        <div
          style={{
            width: 16,
          }}
        >
          <MdCircle style={{ color: label.bgColor }} />
        </div>
        <Typography>{label.name}</Typography>
      </FlexVCenter>
    </li>
  )
}

export default LabelSelectorOption
