import React from "react";
import { Button as MuiButton } from "@mui/material";

const btn = {
  margin: "4px",
  textTransform: "none",
};

export default function Button(props) {
  const { text, size, color, variant, onClick, ...other } = props;
  return (
    <MuiButton
      variant={variant || "contained"}
      size={size || "large"}
      color={color || "primary"}
      sx={btn}
      onClick={onClick}
      {...other}
    >
      {text}
    </MuiButton>
  );
}
