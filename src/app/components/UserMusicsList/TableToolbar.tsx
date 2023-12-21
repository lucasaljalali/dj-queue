"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { AlertColor, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/services/firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import ResultMessage from "../ResultMessage";
import QRcodeButton from "../QRcodeButton";
import AddMusicButton from "../AddMusicButton";

interface TableToolbarProps {
  numSelected: number;
  selected: readonly string[];
  setSelected: Dispatch<SetStateAction<readonly string[]>>;
}

export default function TableToolbar({ numSelected, selected, setSelected }: TableToolbarProps) {
  const [snackbarState, setSnackbarState] = useState({ open: false, message: "", severity: "info" as AlertColor });

  let loading = false;

  function handleDeleteClick() {
    loading = true;
    selected.forEach(async (id) => {
      try {
        await deleteDoc(doc(db, "musics", id));
        setSnackbarState({ open: true, message: "Success!", severity: "success" });
        setSelected([]);
      } catch (error: any) {
        setSnackbarState({ open: true, message: error.code, severity: "error" });
        console.error(error);
      } finally {
        loading = false;
      }
    });
    loading = false;
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
      className="responsiveToolbar"
    >
      {numSelected > 0 ? (
        <>
          <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
          <Tooltip title="Delete">
            <IconButton disabled={loading} onClick={handleDeleteClick}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
            My Musics
          </Typography>

          <div className="musicListButtonsContainer">
            <QRcodeButton />
            <AddMusicButton />
          </div>
        </>
      )}

      <ResultMessage state={snackbarState} setState={setSnackbarState} />
    </Toolbar>
  );
}
