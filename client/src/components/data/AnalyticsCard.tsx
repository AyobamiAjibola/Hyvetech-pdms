import React from "react";
import { Box } from "@mui/material";
import { Timelapse } from "@mui/icons-material";
import moment from "moment";
import { GenericObjectType } from "@app-types";

interface IProps {
  bgColor?: any;
  title?: string;
  data?: GenericObjectType;
  timestamp?: string;
}

function AnalyticsCard(props: IProps) {
  const timestamp = moment(props.data?.timestamp).fromNow(false);
  return (
    <Box
      sx={{
        bgcolor: props.bgColor,
        boxShadow: 5,
        borderRadius: 3,
        p: 2,
        minWidth: 300,
      }}
    >
      <Box
        sx={{
          color: (theme) => (theme.palette.mode === "dark" ? "#ffffff" : "#000000"),
        }}
      >{`${props.data?.name}${props.data?.y && props.data?.y > 1 ? "(s)" : ""}`}</Box>
      <Box sx={{ color: "text.primary", fontSize: 34, fontWeight: "medium" }}>{props.data?.y}</Box>
      {props.data?.y ? (
        <Box
          component={Timelapse}
          sx={{
            color: (theme) => (theme.palette.mode === "dark" ? "#ffffff" : "#000000"),
            fontSize: 16,
            verticalAlign: "sub",
          }}
        />
      ) : null}
      <Box
        sx={{
          color: (theme) => (theme.palette.mode === "dark" ? "#ffffff" : "#000000"),
          display: "inline",
          fontWeight: "medium",
          mx: 0.5,
        }}
      >
        {props.data?.y ? `today, ${timestamp}` : null}
      </Box>
      <Box
        sx={{
          color: (theme) => (theme.palette.mode === "dark" ? "#ffffff" : "#000000"),
          display: "inline",
          fontSize: 12,
        }}
      />
    </Box>
  );
}

export default AnalyticsCard;
