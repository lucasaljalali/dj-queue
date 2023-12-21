"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { AlertColor, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "@/app/services/firebase";
import { useCookies } from "react-cookie";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ResultMessage from "../ResultMessage";

interface TableToolbarProps {
  numSelected: number;
  selected: readonly string[];
  setSelected: Dispatch<SetStateAction<readonly string[]>>;
  djId: string;
}

export default function TableToolbar({ numSelected, selected, setSelected, djId }: TableToolbarProps) {
  const [cookies, setCookie] = useCookies([`${djId}_votes`]);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: "", severity: "info" as AlertColor });

  let loading = false;

  let currentVotes = cookies[`${djId}_votes`] || [];

  const updateCookie = (musicId: string, voted: boolean) => {
    const nextDay = new Date(new Date().setDate(new Date().getDate() + 1));

    if (voted) {
      const index = currentVotes.indexOf(musicId);
      if (index !== -1) {
        currentVotes.splice(index, 1);
        setCookie(`${djId}_votes`, currentVotes, { expires: nextDay });
      }
    } else {
      if (!currentVotes.includes(musicId)) {
        currentVotes.push(musicId);
        setCookie(`${djId}_votes`, currentVotes, { expires: nextDay });
      }
    }
  };

  function handleVotesClick() {
    loading = true;
    selected.forEach(async (id) => {
      try {
        const voted = currentVotes.includes(id);
        const musicRef = doc(db, "musics", id);
        const musicSnapshot = await getDoc(musicRef);
        const currentVotesCount = musicSnapshot?.data()?.votes;
        await updateDoc(musicRef, { votes: increment(voted ? (currentVotesCount <= 0 ? 0 : -1) : 1) });
        setSnackbarState({ open: true, message: "Success!", severity: "success" });
        updateCookie(id, voted);
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
