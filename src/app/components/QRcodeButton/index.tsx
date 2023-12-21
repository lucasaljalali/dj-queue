"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Box, Button, Dialog, IconButton, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import { createUserHash } from "@/app/utils/createUserHash";
import QRCode from "react-qr-code";
import CloseIcon from "@mui/icons-material/Close";
import QrCodeIcon from "@mui/icons-material/QrCode";

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

  return (
    <div id="addMusicButton">
      <Button id="qrCodeButton" variant="outlined" startIcon={<QrCodeIcon />} onClick={() => setQrCodeOpen(true)}>
        QRcode
      </Button>

      <Dialog onClose={() => setQrCodeOpen(false)} open={qrCodeOpen} fullScreen={fullScreen}>
        <div className="dialogHeader">
          <Typography variant="h5">QR Code for Votes</Typography>

          <IconButton aria-label="close" onClick={() => setQrCodeOpen(false)}>
            <CloseIcon />
          </IconButton>
        </div>

        <Box className="dialogForm">
          {voteURL && (
            <>
              <QRCode style={{ height: "auto", maxWidth: "100%", width: "100%" }} size={350} value={voteURL} />
              <Link href={voteURL} target="_blank" sx={{ alignSelf: "center" }}>
                Open link
              </Link>
            </>
          )}
        </Box>
      </Dialog>
    </div>
  );
}
