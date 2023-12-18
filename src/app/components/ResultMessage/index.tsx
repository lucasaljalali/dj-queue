import { Alert, AlertColor, Snackbar } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface IState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface ResultMessageProps {
  state: IState;
  setState: Dispatch<SetStateAction<IState>>;
}

export default function ResultMessage({ state, setState }: ResultMessageProps) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={state.open}
      onClose={() => setState((prev) => ({ ...prev, open: false }))}
      autoHideDuration={6000}
    >
      <Alert onClose={() => setState((prev) => ({ ...prev, open: false }))} severity={state.severity} sx={{ width: "100%" }}>
        {state.message}
      </Alert>
    </Snackbar>
  );
}
