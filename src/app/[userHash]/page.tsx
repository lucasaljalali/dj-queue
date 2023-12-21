"use client";

import { useEffect, useState } from "react";
import { DJInfo, extractUserInfo } from "../utils/decryptUserHash";
import { Avatar, Typography } from "@mui/material";
import { CookiesProvider } from "react-cookie";
import VotingList from "../components/VotingList";

export default function UserListToVote({ params }: { params: { userHash: string } }) {
  const [djData, setDjData] = useState<DJInfo | null>(null);

  useEffect(() => {
    const djUserInfo = extractUserInfo(params.userHash);

    djUserInfo && setDjData(djUserInfo);
  }, [params.userHash]);

  return (
    <CookiesProvider>
      <header>
        <div className="profileImageContainter">
          {djData && (
            <>
              <Avatar alt={djData?.displayName || undefined} src={djData?.photoURL || undefined} sx={{ width: 100, height: 100 }} />
              <Typography variant="h6">{`${djData?.displayName}'s Musics List `}</Typography>
            </>
          )}
        </div>
      </header>
      <main>{djData?.uid && <VotingList djId={djData.uid} />}</main>
    </CookiesProvider>
  );
}
