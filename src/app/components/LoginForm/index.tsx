import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { AlertColor, Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { object, ref, string } from "yup";
import { useFormik } from "formik";
import ResultMessage from "../ResultMessage";
import Image from "next/image";
import googleIcon from "../../../../public/images/google.png";

export default function LoginForm() {
  const [type, setType] = useState<"login" | "signup" | "forgot">("login");
  const [snackbarState, setSnackbarState] = useState({ open: false, message: "", severity: "info" as AlertColor });
  const { googleLogin, login, createUSer, resetPassword } = useAuth();
  let loading = false;
  const router = useRouter();

  const userSchema = object({
    email: string().email().required("required"),
    password: string()
      .min(8)
      .when([], {
        is: () => type !== "forgot",
        then: (schema) => schema.required("required"),
      }),
    passwordConfirmation: string()
      .oneOf([ref("password"), undefined], "Passwords must match")
      .when([], {
        is: () => type === "signup",
        then: (schema) => schema.required("required"),
      }),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      try {
        type === "login"
          ? await login(values.email, values.password)
          : type === "signup"
          ? await createUSer(values.email, values.password)
          : await resetPassword(values.email);

        setSnackbarState({ open: true, message: "Success!", severity: "success" });
      } catch (error: any) {
        setSnackbarState({ open: true, message: error.code, severity: "error" });
        console.error({ error });
      }
    },
    enableReinitialize: true,
  });

  function handleGoogleSignIn() {
    googleLogin();
  }

  return (
    <div className="loginContainer">
      <h1 id="loginTitle">DJ QUEUE</h1>
      <Button
        fullWidth
        variant="contained"
        startIcon={<Image src={googleIcon} width={20} height={20} alt="google icon" />}
        onClick={handleGoogleSignIn}
      >
        {"Login with Google"}
      </Button>
      <Divider sx={{ my: 4, mx: 10 }}>
        <Typography variant="caption">OR</Typography>
      </Divider>

      <Box component="form" onSubmit={formik.handleSubmit} className="loginForm">
        <TextField
          id="email"
          name="email"
          type="email"
          label={"Email"}
          variant="outlined"
          fullWidth
          disabled={loading}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        {type !== "forgot" && (
          <div className="passwordInputContainer">
            <TextField
              id="password"
              name="password"
              type="password"
              label={"Password"}
              variant="outlined"
              fullWidth
              disabled={loading}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            {type === "login" && (
              <Button size="small" id="forgotPasswordButton" onClick={() => setType("forgot")}>
                FORGOT PASSWORD
              </Button>
            )}
          </div>
        )}

        {type === "signup" && (
          <TextField
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            label={"Confirm password"}
            variant="outlined"
            fullWidth
            disabled={loading}
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
          />
        )}

        <Button disabled={loading} variant="contained" type="submit" fullWidth id="loginSubmitButton">
          {type === "login" ? "LOGIN" : type === "signup" ? "SIGN UP" : "RESET PASSWORD"}
        </Button>

        <Button size="small" onClick={() => (type === "login" ? setType("signup") : setType("login"))}>
          {type === "login" ? "CREATE NEW ACCOUNT" : "BACK TO LOGIN"}
        </Button>

        <ResultMessage state={snackbarState} setState={setSnackbarState} />
      </Box>
    </div>
  );
}
