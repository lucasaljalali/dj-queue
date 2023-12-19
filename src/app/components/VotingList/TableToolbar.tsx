"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { AlertColor, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { deleteDoc, doc, increment, updateDoc } from "firebase/firestore";
import { db } from "@/app/services/firebase";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ResultMessage from "../ResultMessage";

interface TableToolbarProps {
  numSelected: number;
  selected: readonly string[];
  setSelected: Dispatch<SetStateAction<readonly string[]>>;
}

export default function TableToolbar({ numSelected, selected, setSelected }: TableToolbarProps) {
  const [snackbarState, setSnackbarState] = useState({ open: false, message: "", severity: "info" as AlertColor });

  let loading = false;

  let currentVotes = JSON.parse(sessionStorage.getItem("votes") || "[]") as string[];

  const updateSessionStorage = (musicId: string, voted: boolean) => {
    if (voted) {
      const index = currentVotes.indexOf(musicId);
      if (index !== -1) {
        currentVotes.splice(index, 1);
        sessionStorage.setItem("votes", JSON.stringify(currentVotes));
      }
    } else {
      if (!currentVotes.includes(musicId)) {
        currentVotes.push(musicId);
        sessionStorage.setItem("votes", JSON.stringify(currentVotes));
      }
    }
  };

  function handleVotesClick() {
    loading = true;
    selected.forEach(async (id) => {
      try {
        const voted = currentVotes.includes(id);
        const musicRef = doc(db, "musics", id);
        await updateDoc(musicRef, { votes: increment(voted ? -1 : 1) });
        setSnackbarState({ open: true, message: "Success!", severity: "success" });
        updateSessionStorage(id, voted);
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
    >
      {numSelected > 0 ? (
        <>
          <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
          <Tooltip title="Vote">
            <IconButton disabled={loading} onClick={handleVotesClick}>
              <ThumbUpIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div"></Typography>
      )}

      <ResultMessage state={snackbarState} setState={setSnackbarState} />
    </Toolbar>
  );
}
