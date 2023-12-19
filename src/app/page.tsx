"use client";

//TODO: QRcode generator for guest page
//TODO: guest page to vote for musics
//TODO: make all styles cool and nice (for DJ's)
//TODO: ranking and musics list requests paginations

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthContext";
import LoginForm from "./components/LoginForm";

export default function Home() {
  const { currentUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    currentUser && router.push("/home");
  }, [currentUser]);

  return (
    <>
      <header>DJ QUEUE</header>
      <main>
        <LoginForm />
      </main>
    </>
  );
}
