import { Dispatch, SetStateAction } from "react";
import {
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
import { MusicGenre } from "@/app/global";
import { useFormik } from "formik";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/services/firebase";
import CloseIcon from "@mui/icons-material/Close";

interface AddMusicFormProps {
  setState: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

export default function AddMusicForm({ setState, open }: AddMusicFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const loading = false;
  const musicGenres: MusicGenre[] = ["Rock", "Jazz", "Electronic", "Techno", "Country", "Pop", "Funk"];

  const addMusicSchema = object({
    title: string().required(),
    genre: string().required().oneOf(musicGenres),
    duration: number(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      genre: "",
      duration: 0,
    },
    validationSchema: addMusicSchema,
    onSubmit: async (values) => {
      try {
        await addDoc(collection(db, "musics"), {
          ...values,
          user: "1",
          votes: 0,
        });

        setState(false);
      } catch (err) {
        console.error(err);
      }
    },
    enableReinitialize: true,
  });

  return (
    <Dialog onClose={() => setState(false)} open={open} fullScreen={fullScreen}>
      <div className="dialogHeader">
        <Typography variant="h5">Add Music</Typography>

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
          ADD
        </Button>
        {/* {errorsAlerts?.map(
          (errorMessage, index) =>
            errorMessage && (
              <div key={index} className="alertContainer">
                <Alert severity="error" onClose={(e) => e.currentTarget.parentElement?.parentElement?.remove()}>
                  {errorMessage}
                </Alert>
              </div>
            )
        )}
        {successAlerts?.map(
          (successMessage, index) =>
            successMessage && (
              <div key={index} className="alertContainer">
                <Alert severity="success" onClose={(e) => e.currentTarget.parentElement?.parentElement?.remove()}>
                  {successMessage}
                </Alert>
              </div>
            )
        )} */}
      </Box>
    </Dialog>
  );
}
