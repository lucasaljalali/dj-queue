"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Tab, Tabs } from "@mui/material";
import MusicMenu from "../../components/MusicMenu";
import Ranking from "../../components/Ranking";
import UserMenu from "../../components/UserMenu";
import UserMusics from "../../components/UserMusicsList";
import CustomTabPanel from "../../components/CustomTabPanel";

export default function Home() {
  const [tabValue, setTabValue] = useState(0);
  const { currentUser } = useAuth();
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const router = useRouter();

  useEffect(() => {
    !currentUser && router.push("/");
  }, [currentUser]);

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
