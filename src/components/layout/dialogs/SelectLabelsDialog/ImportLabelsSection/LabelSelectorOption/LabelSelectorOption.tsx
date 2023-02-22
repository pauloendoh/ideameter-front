import Flex from "@/components/_common/flexboxes/Flex"
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
      <Flex justifyContent="space-between" width="100%">
        <Flex gap={1}>
          <MdCircle style={{ color: label.bgColor, width: 24, marginTop: 3 }} />
          <Typography title={label.name} fontSize={14} noWrap width={120}>
            {label.name}
          </Typography>
        </Flex>

        <Typography
          fontSize={10}
          pl={2}
          fontStyle="italic"
          title={label.group?.name || "No group"}
          noWrap
          width={80}
        >
          {label.group?.name || "No group"}
        </Typography>
      </Flex>
    </li>
  )
}

export default LabelSelectorOption
