"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddMusicForm from "./AddForm";

export default function MusicMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Musics
      </Button>
      <Menu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            setAddFormOpen(true);
          }}
        >
          <AddIcon />
          Add
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleClose}>
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <DeleteIcon />
          Delete
        </MenuItem>
      </Menu>

      <AddMusicForm setState={setAddFormOpen} open={addFormOpen} />
    </div>
  );
}
