"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Tab, Tabs } from "@mui/material";
import Ranking from "../../components/Ranking";
import UserMusics from "../../components/UserMusicsList";
import CustomTabPanel from "../../components/CustomTabPanel";
import MyUser from "../../components/MyUser";

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
          <Tab label="My User" />
        </Tabs>
        <CustomTabPanel value={tabValue} index={0}>
          <Ranking />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <UserMusics />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <MyUser />
        </CustomTabPanel>
      </main>
    </>
  );
}
