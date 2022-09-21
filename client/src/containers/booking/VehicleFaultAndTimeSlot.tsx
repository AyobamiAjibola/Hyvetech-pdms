import React, { useContext } from "react";
import { Grid, Typography } from "@mui/material";

import TimeSlot from "../../components/forms/booking/TimeSlot";
import { AppContext } from "../../context/AppContextProvider";
import { DRIVE_IN_PLAN } from "../../config/constants";
import { AppContextProps } from "@app-interfaces";

interface Props {
  slot: string;
  handleSelectSlot: any;
  planCategory: string;
}

function VehicleFaultAndTimeSlot({
  slot,
  handleSelectSlot,
  planCategory,
}: Props) {
  const { planTab } = useContext(AppContext) as AppContextProps;

  return (
    <Grid
      container
      rowSpacing={{ xs: 2, sm: 4, md: 6 }}
      columnSpacing={{ xs: 2, sm: 4, md: 6 }}
      sx={{ mb: 3 }}
    >
      {(planTab !== 0 || planCategory === DRIVE_IN_PLAN) && (
        <Grid item xs>
          <Typography
            variant="subtitle2"
            textAlign="center"
            // className="time-header"
            gutterBottom
            sx={{
              fontSize: (theme) => theme.spacing(1.5),
              color: (theme) =>
                theme.palette.mode === "dark" ? "#FFFFFF" : "#383838",
            }}
          >
            Select available slot
          </Typography>
          <TimeSlot slot={slot} handleChange={handleSelectSlot} />
        </Grid>
      )}
    </Grid>
  );
}

export default VehicleFaultAndTimeSlot;
