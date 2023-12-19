"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  AlertColor,
  Box,
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { number, object, string } from "yup";
import { IMusic, MusicGenre } from "@/app/global";
import { useFormik } from "formik";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/services/firebase";
import CloseIcon from "@mui/icons-material/Close";
import ResultMessage from "../ResultMessage";

interface AddMusicFormProps {
  setState: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  data: IMusic;
}

export default function EditMusicForm({ setState, open, data }: AddMusicFormProps) {
  const [snackbarState, setSnackbarState] = useState({ open: false, message: "", severity: "info" as AlertColor });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  let loading = false;
  const musicGenres: MusicGenre[] = ["Rock", "Jazz", "Electronic", "Techno", "Country", "Pop", "Funk"];

  const addMusicSchema = object({
    title: string().required(),
    genre: string().required().oneOf(musicGenres),
    duration: number(),
  });

  const formik = useFormik({
    initialValues: {
      title: data.title,
      genre: data.genre,
      duration: data.duration,
    },
    validationSchema: addMusicSchema,
    onSubmit: async (values) => {
      loading = true;
      try {
        const musicRef = doc(db, "musics", data.id);
        await updateDoc(musicRef, values);
        setSnackbarState({ open: true, message: "Success!", severity: "success" });
        setState(false);
      } catch (error: any) {
        setSnackbarState({ open: true, message: error.code, severity: "error" });
        console.error(error);
      } finally {
        loading = false;
      }
    },
    enableReinitialize: true,
  });

  return (
    <Dialog onClose={() => setState(false)} open={open} fullScreen={fullScreen}>
      <div className="dialogHeader">
        <Typography variant="h5">Edit Music</Typography>

        <IconButton aria-label="close" onClick={() => setState(false)}>
          <CloseIcon />
        </IconButton>
      </div>

      <Box component="form" onSubmit={formik.handleSubmit} className="dialogForm">
        <TextField
          id="title"
          name="title"
          type="text"
          label={"Title"}
          variant="outlined"
          required
          disabled={loading}
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />

        <FormControl variant="outlined" size="small" disabled={loading} required>
          <InputLabel htmlFor="musicGenreInput">{"Genre"}</InputLabel>
          <Select
            id="genre"
            name="genre"
            input={<OutlinedInput id="musicGenreInput" label={"Genre"} size="medium" />}
            value={formik.values.genre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.genre && Boolean(formik.errors.genre)}
          >
            {musicGenres.map((musicGenre, index) => (
              <MenuItem key={index} value={musicGenre}>
                {musicGenre}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error id="accountId-error">
            {formik.touched.genre && formik.errors.genre}
          </FormHelperText>
        </FormControl>

        <TextField
          id="duration"
          name="duration"
          type="number"
          label={"Duration (aprox. in minutes)"}
          variant="outlined"
          disabled={loading}
          value={formik.values.duration}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.duration && Boolean(formik.errors.duration)}
          helperText={formik.touched.duration && formik.errors.duration}
        />

        <Button disabled={loading} variant="contained" type="submit">
          SAVE
        </Button>
        <ResultMessage state={snackbarState} setState={setSnackbarState} />
      </Box>
    </Dialog>
  );
}
