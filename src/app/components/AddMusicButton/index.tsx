"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import AddMusicForm from "../AddMusicForm";
import AddIcon from "@mui/icons-material/Add";

export default function AddMusicButton() {
  const [addFormOpen, setAddFormOpen] = useState(false);

  return (
    <div id="addMusicButton">
      <Button id="demo-customized-button" variant="contained" startIcon={<AddIcon />} onClick={() => setAddFormOpen(true)}>
        Add Music
      </Button>

      <AddMusicForm setState={setAddFormOpen} open={addFormOpen} />
    </div>
  );
}
