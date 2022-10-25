import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useDeleteTabMutation from "@/hooks/react-query/domain/group/tab/useDeleteTabMutation"
import useGroupTabsQuery from "@/hooks/react-query/domain/group/tab/useGroupTabsQuery"
import useConfirmDeleteTabDialogStore from "@/hooks/zustand/dialogs/useConfirmDeleteTabDialogStore"
import useTabDialogStore from "@/hooks/zustand/dialogs/useTabDialogStore"
import TabDto from "@/types/domain/group/tab/TabDto"
import urls from "@/utils/urls"
import { Menu, MenuItem, Typography } from "@mui/material"
import { useRouter } from "next/router"
import React from "react"
import { MdDelete, MdEdit } from "react-icons/md"
import S from "./TabMenuOptions.styles"

interface Props {
  tab: TabDto
}

const TabMenuOptions = (props: Props) => {
  const router = useRouter()
  const { openDialog } = useTabDialogStore()
  const deleteTabMutation = useDeleteTabMutation()
  const { openDialog: openConfirmDeleteTabDialog } = useConfirmDeleteTabDialogStore()
  const { data: groupTabs } = useGroupTabsQuery(props.tab.groupId)

  const [anchorEl, setAnchorEl] = React.useState<null | SVGElement>(null)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
    event.preventDefault()
    event.stopPropagation()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    openConfirmDeleteTabDialog(props.tab, () => {
      deleteTabMutation.mutate(props.tab, {
        onSuccess: () => {
          handleClose()

          if (groupTabs && groupTabs.length > 0) {
            const otherTab = groupTabs[0]

            router.push(urls.pages.groupTab(otherTab.groupId, otherTab.id))
          }
        },
      })
    })
  }

  return (
    <div>
      <S.MdArrowDropDown
        onClick={(e) => handleClick(e)}
        style={{ width: 24, height: 24 }}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={(e, reason) => {
          handleClose()
        }}
        BackdropProps={{
          onClick: (e) => {
            e.stopPropagation()
            handleClose()
          },
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={(e) => {
            handleClose()
            e.stopPropagation()
            openDialog(props.tab)
          }}
        >
          <FlexVCenter gap={1}>
            <MdEdit />
            <Typography>Edit tab</Typography>
          </FlexVCenter>
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            handleClose()
            e.stopPropagation()
            handleDelete()
          }}
        >
          <FlexVCenter gap={1} sx={{ color: (theme) => theme.palette.error.main }}>
            <MdDelete />
            <Typography>Delete tab</Typography>
          </FlexVCenter>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default TabMenuOptions
