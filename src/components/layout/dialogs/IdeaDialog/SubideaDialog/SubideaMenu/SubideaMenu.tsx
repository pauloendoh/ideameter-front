import useDeleteSubideaMutation from "@/hooks/react-query/domain/subidea/useDeleteSubideaMutation";
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import useConfirmDialogStore from "@/hooks/zustand/dialogs/useConfirmDialogStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { MdMoreHoriz } from "react-icons/md";

interface Props {
  subidea: IdeaDto;
  afterDelete?: () => void;
}

const ariaName = `subidea-menu`;

const SubideaMenu = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const { groupId } = useRouterQueryString();
  const openConfirmDialog = useConfirmDialogStore((s) => s.openConfirmDialog);
  const { mutate: submitDeleteSubidea } = useDeleteSubideaMutation();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    openConfirmDialog({
      title: "Delete subidea?",
      onConfirm: () => {
        submitDeleteSubidea(
          { groupId: groupId!, subidea: props.subidea },
          {
            onSuccess: () => {
              handleClose();
              if (props.afterDelete) props.afterDelete();
            },
          }
        );
      },
    });
  };

  return (
    <div>
      <IconButton
        id={`${ariaName}-button`}
        aria-controls={open ? ariaName : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MdMoreHoriz />
      </IconButton>

      <Menu
        id={ariaName}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": `${ariaName}-button`,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default SubideaMenu;
