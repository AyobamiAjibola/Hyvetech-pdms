import React from "react";
import { Box, Skeleton } from "@mui/material";

interface IProps {
  loading: boolean;
  children: JSX.Element;
}

function AppSkeleton(props: IProps) {
  return (
    <Box>
      {props.loading ? <Skeleton>{props.children}</Skeleton> : props.children}
    </Box>
  );
}

export default AppSkeleton;
