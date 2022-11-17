import React, { useContext } from "react";
import { Button, Grid } from "@mui/material";
import { MdEditCalendar } from "react-icons/md";
import { AppContext } from "../../context/AppContextProvider";
import { AppContextProps } from "@app-interfaces";

function SkipAndSubmitButtons() {
  const { showBookingBtn, mobileDate } = useContext(AppContext) as AppContextProps;

  return (
    <Grid container rowSpacing={{ xs: 2, sm: 4, md: 6 }} columnSpacing={{ xs: 2, sm: 4, md: 6 }}>
      <Grid item xs={12} md={6} alignSelf="center">
        <React.Fragment />
      </Grid>
      {(showBookingBtn || mobileDate) && (
        <Grid item xs={12} md={6}>
          <Button
            startIcon={<MdEditCalendar />}
            className="submit-book-btn"
            fullWidth
            variant="contained"
            type="submit"
          >
            Book appointment
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

export default SkipAndSubmitButtons;
