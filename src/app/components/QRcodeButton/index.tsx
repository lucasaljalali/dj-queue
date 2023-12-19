"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Box, Button, Dialog, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { createUserHash } from "@/app/utils/createUserHash";
import QRCode from "react-qr-code";
import CloseIcon from "@mui/icons-material/Close";

export default function QRcodeButton() {
  const [qrCodeOpen, setQrCodeOpen] = useState(false);

  const { currentUser } = useAuth();

  const currentURL = window.location.href;
  const userInfoHash = currentUser
    ? createUserHash(currentUser.uid, currentUser.displayName || currentUser.email || "", currentUser.photoURL || "")
    : null;
  const voteURL = currentUser ? currentURL.replace(/\/[^/]*$/, `/${userInfoHash}`) : null;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  console.log({ voteURL });
  return (
    <div id="addMusicButton">
      <Button id="qrCodeButton" onClick={() => setQrCodeOpen(true)}>
        Generate QRcode
      </Button>

      <Dialog onClose={() => setQrCodeOpen(false)} open={qrCodeOpen} fullScreen={fullScreen}>
        <div className="dialogHeader">
          <Typography variant="h5">QR Code for Votes</Typography>

          <IconButton aria-label="close" onClick={() => setQrCodeOpen(false)}>
            <CloseIcon />
          </IconButton>
        </div>

        <Box className="dialogForm">
          {voteURL && <QRCode style={{ height: "auto", maxWidth: "100%", width: "100%" }} size={350} value={voteURL} />}
        </Box>
      </Dialog>
    </div>
  );
}
