"use client";

//TODO: improve select all to select just the ones in that page

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
    <main>
      <LoginForm />
    </main>
  );
}
