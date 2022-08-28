import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField, Typography } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import "./bookingForm.css";
import { AppContext } from "../../../context/AppContextProvider";
import { AppContextProperties } from "@app-interfaces";

interface IMobilePlanCalendarProps {
  date: any;
  setDate: any;
  maxDate?: any;
  minDate?: any;
}

const DATE_SIZE = 30;
const now = new Date();
const year = now.getUTCFullYear();
const month = now.getUTCMonth();
const $date = now.getUTCDate();

function MobilePlanCalendar({
  date,
  setDate,
  minDate = new Date(year, month, $date),
  maxDate = new Date(year + 1, 11, 31),
}: IMobilePlanCalendarProps) {
  const [_maxDate, _setMaxDate] = useState<any>();
  const [_minDate, _setMinDate] = useState<any>();
  const [_date, _setDate] = useState(new Date());

  const { setMobileDate, showTime, setShowTime } = useContext(
    AppContext
  ) as AppContextProperties;

  useEffect(() => {
    _setMinDate(minDate);
    _setMaxDate(maxDate);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const newDate = moment(_date);
    const newTime = moment(date);

    const $date = moment({
      year: newDate.year(),
      month: newDate.month(),
      date: newDate.date(),
      hours: newTime.hours(),
      minutes: newTime.minutes(),
      seconds: newTime.seconds(),
    });

    setDate($date.toDate());
    // eslint-disable-next-line
  }, [_date, setDate]);

  const handleChangeDate = (date: any) => {
    _setDate(date);
    setShowTime(true);
  };

  const handleChangeTime = (time: any) => {
    const newDate = moment(_date);
    const newTime = moment(time);

    const $date = moment({
      year: newDate.year(),
      month: newDate.month(),
      date: newDate.date(),
      hours: newTime.hours(),
      minutes: newTime.minutes(),
      seconds: newTime.seconds(),
    });

    setDate($date.toDate());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          mb: 2,
          "& .PrivatePickersSlideTransition-root": {
            minHeight: DATE_SIZE * 6,
            maxHeight: DATE_SIZE * 6,
            height: "100%",
          },

          "& .MuiYearPicker-root": {
            minHeight: DATE_SIZE * 6,
            maxHeight: DATE_SIZE * 6,
            height: "100%",
          },

          '& .PrivatePickersSlideTransition-root [role="row"]': {
            margin: 0,
          },
        }}
      >
        <Typography
          textAlign="center"
          // className="time-header"
          variant="subtitle2"
          display="block"
          gutterBottom
          sx={{
            mb: 1,
            fontSize: (theme) => theme.spacing(1),
            color: (theme) =>
              theme.palette.mode === "dark" ? "#FFFFFF" : "#383838",
          }}
        >
          Select Preferred Date
        </Typography>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          openTo="day"
          renderInput={(props) => (
            <TextField {...props} fullWidth sx={{ alignSelf: "center" }} />
          )}
          value={_date}
          showToolbar={false}
          maxDate={_maxDate}
          minDate={_minDate}
          onChange={handleChangeDate}
          onAccept={handleChangeDate}
          disablePast
          //@ts-ignore
          rawValue={date}
          date={date}
          openPicker={false}
          disableHighlightToday
          componentsProps={{
            actionBar: {
              actions: [],
            },
          }}
        />
        {showTime && (
          <React.Fragment>
            <Typography
              sx={{
                mt: 2,
                mb: 1,
                fontSize: (theme) => theme.spacing(1),
                color: (theme) =>
                  theme.palette.mode === "dark" ? "#FFFFFF" : "#383838",
              }}
              textAlign="center"
              // className="time-header"
              variant="subtitle2"
              display="block"
            >
              Select Preferred Time
            </Typography>
            <MobileTimePicker
              renderInput={(props) => <TextField {...props} fullWidth />}
              value={date}
              onChange={handleChangeTime}
              ampm
              onClose={() => setMobileDate(true)}
              //@ts-ignore
              date={date}
              rawValue={date}
            />
          </React.Fragment>
        )}
      </Box>
    </LocalizationProvider>
  );
}

export default MobilePlanCalendar;
