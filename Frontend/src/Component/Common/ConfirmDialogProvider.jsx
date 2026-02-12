import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const ConfirmDialogContext = createContext(null);

export const ConfirmDialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: "Confirm Action",
    message: "",
    confirmText: "OK",
    cancelText: "Cancel",
    confirmColor: "primary",
    resolve: null,
  });

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setDialogState({
        open: true,
        title: options.title || "Confirm Action",
        message: options.message || "Are you sure?",
        confirmText: options.confirmText || "OK",
        cancelText: options.cancelText || "Cancel",
        confirmColor: options.confirmColor || "primary",
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(
    (result) => {
      dialogState.resolve?.(result);
      setDialogState((prev) => ({ ...prev, open: false, resolve: null }));
    },
    [dialogState]
  );

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}

      <Dialog
        open={dialogState.open}
        onClose={() => handleClose(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>{dialogState.title}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">{dialogState.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => handleClose(false)}>{dialogState.cancelText}</Button>
          <Button
            variant="contained"
            color={dialogState.confirmColor}
            onClick={() => handleClose(true)}
          >
            {dialogState.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirmDialog must be used within ConfirmDialogProvider");
  }
  return context;
};
