import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./contexts/AuthContext";
import { StyledEngineProvider } from "@mui/material";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DJ QUEUE",
  description: "Created by Lucas Al Jalali",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <AuthProvider>
        <html lang="en" suppressHydrationWarning={true}>
          <body className={inter.className}>{children}</body>
        </html>
      </AuthProvider>
    </StyledEngineProvider>
  );
}
