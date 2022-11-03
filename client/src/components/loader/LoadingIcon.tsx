import React from "react";
import { CircularProgress, InputAdornment } from "@mui/material";
import { MdOutlineDangerous } from "react-icons/md";

interface IProps {
  loading: boolean;
  hasError: boolean;
}

function LoadingIcon({ loading, hasError }: IProps) {
  return (
    <InputAdornment sx={{ color: hasError ? "red" : "" }} position="start">
      {loading && <CircularProgress size={25} />}
      {hasError && <MdOutlineDangerous size={25} />}
    </InputAdornment>
  );
}

export default LoadingIcon;
