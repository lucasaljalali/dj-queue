"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { auth } from "@/app/services/firebase";
import { AlertColor, Avatar, Box, Button, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "@/app/contexts/AuthContext";
import { object, string } from "yup";
import { sendPasswordResetEmail, updateProfile } from "firebase/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import ResultMessage from "../ResultMessage";

export default function MyUser() {
  const [snackbarState, setSnackbarState] = useState({ open: false, message: "", severity: "info" as AlertColor });

  const { currentUser } = useAuth();

  let loading = false;

  const userUpdateSchema = object({
    displayName: string().min(2).required("required"),
    photoURL: string().required("required"),
  });

  const formik = useFormik({
    initialValues: {
      displayName: currentUser?.displayName,
      photoURL: currentUser?.photoURL,
    },
    validationSchema: userUpdateSchema,
    onSubmit: async (values) => {
      if (auth.currentUser) {
        loading = true;
        try {
          await updateProfile(auth.currentUser, values);
          setSnackbarState({ open: true, message: "Success!", severity: "success" });
        } catch (error: any) {
          setSnackbarState({ open: true, message: error.code, severity: "error" });
          console.error({ error });
        } finally {
          loading = false;
        }
      }
    },
    enableReinitialize: true,
  });

  async function handleResetPassword() {
    if (currentUser?.email) {
      loading = true;
      try {
        await sendPasswordResetEmail(auth, currentUser.email);
        setSnackbarState({ open: true, message: "A email was sent to you!", severity: "success" });
      } catch (error: any) {
        setSnackbarState({ open: true, message: error.code, severity: "error" });
        console.error({ error });
      } finally {
        loading = false;
      }
    }
  }

  function logout() {
    auth.signOut();
  }

  return (
    <Box>
      <Paper>
        <div className="profileMainContainer">
          <div className="profileImageContainter">
            <Avatar
              alt={currentUser?.displayName || currentUser?.email || undefined}
              src={currentUser?.photoURL || undefined}
              sx={{ width: 100, height: 100 }}
            />
            <Typography variant="h6">{currentUser?.email}</Typography>
          </div>
          <IconButton onClick={logout} id="logoutButton">
            <LogoutIcon />
          </IconButton>
          <Box component="form" onSubmit={formik.handleSubmit} className="loginForm">
            <TextField
              id="displayName"
              name="displayName"
              type="text"
              label={"Name"}
              variant="outlined"
              fullWidth
              disabled={loading}
              value={formik.values.displayName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.displayName && Boolean(formik.errors.displayName)}
              helperText={formik.touched.displayName && formik.errors.displayName}
            />

            <TextField
              id="photoURL"
              name="photoURL"
              type="url"
              label={"Image URL"}
              variant="outlined"
              fullWidth
              disabled={loading}
              value={formik.values.photoURL}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.photoURL && Boolean(formik.errors.photoURL)}
              helperText={formik.touched.photoURL && formik.errors.photoURL}
            />

            <Button disabled={loading} onClick={handleResetPassword} fullWidth>
              {"RESET PASSWORD"}
            </Button>

            <Button disabled={loading} variant="contained" type="submit" fullWidth>
              {"SAVE"}
            </Button>
          </Box>

          <ResultMessage state={snackbarState} setState={setSnackbarState} />
        </div>
      </Paper>
    </Box>
  );
}
