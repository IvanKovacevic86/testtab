import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";

import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import ActionButtons from "./ActionButtons";

export default function Popup(props) {
  const { title, children, openPopup, closeModal } = props;

  const dialogWrapper = {
    padding: "16px",
    position: "absolute",
    top: "40px",
  };

  return (
    <div>
      <Dialog open={openPopup} maxWidth="md" sx={dialogWrapper}>
        <DialogTitle>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            <ActionButtons>
              <CloseIcon color="error" onClick={closeModal} />
            </ActionButtons>
          </Box>
        </DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
      </Dialog>
    </div>
  );
}
