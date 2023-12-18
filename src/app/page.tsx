"use client";

import { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import MusicMenu from "./components/MusicMenu";
import Ranking from "./components/Ranking";
import UserMenu from "./components/UserMenu";
import UserMusics from "./components/UserMusicsList";
import CustomTabPanel from "./components/CustomTabPanel";

export default function Home() {
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <header>DJ QUEUE</header>
      <main>
        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Ranking" />
          <Tab label="My Musics" />
        </Tabs>
        <CustomTabPanel value={tabValue} index={0}>
          <Ranking />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <UserMusics />
        </CustomTabPanel>
      </main>
      <footer>
        <MusicMenu />
        <UserMenu />
      </footer>
    </>
  );
}
