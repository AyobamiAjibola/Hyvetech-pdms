import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Box from '@mui/material/Box';
import moment from 'moment';
import { initCurrentTimeSlotsAction } from '../../../store/actions/timeSlotActions';
import settings from '../../../config/settings';
import { Typography } from '@mui/material';
import { AppContext } from '../../../context/AppContextProvider';

import './bookingForm.css';
import useAppSelector from '../../../hooks/useAppSelector';
import { AppContextProps } from '@app-interfaces';
import useAppDispatch from '../../../hooks/useAppDispatch';

interface IDriveInPlanCalendarProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
  maxDate?: Date | null;
  minDate?: Date | null;
}

const DATE_SIZE = 30;
const date = new Date();
const year = date.getUTCFullYear();
const month = date.getUTCMonth();
const _date = date.getUTCDate();

function DriveInPlanCalendar({
  setDate,
  date,
  maxDate = new Date(year + 1, 11, 31),
  minDate = new Date(year, month, _date),
}: IDriveInPlanCalendarProps) {
  const [_maxDate, _setMaxDate] = useState<Date | null>();
  const [_minDate, _setMinDate] = useState<Date | null>();

  useEffect(() => {
    _setMinDate(minDate);
    _setMaxDate(maxDate);
    // eslint-disable-next-line
  }, []);

  const timeSlotReducer = useAppSelector(state => state.timeSlotReducer);

  const { setShowBookingBtn, showBookingBtn, checkedSlot, setCheckedSlot } = useContext(AppContext) as AppContextProps;

  const dispatch = useAppDispatch();

  const handleChange = (date: any) => {
    if (showBookingBtn) setShowBookingBtn(!showBookingBtn);
    if (checkedSlot) setCheckedSlot(!checkedSlot);

    date = moment(date);
    const _fullDate = moment(timeSlotReducer.fullDate);

    if (date.format('LL') === _fullDate.format('LL')) {
      const shortDate = date.format('YYYY-MM-DD');

      dispatch(
        //@ts-ignore
        initCurrentTimeSlotsAction({
          date: shortDate,
          slots: settings.slots,
          now: true,
        }),
      );
    } else {
      const shortDate = date.format('YYYY-MM-DD');

      dispatch(
        //@ts-ignore
        initCurrentTimeSlotsAction({ date: shortDate, slots: settings.slots }),
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          '& .PrivatePickersSlideTransition-root': {
            minHeight: DATE_SIZE * 6,
            maxHeight: DATE_SIZE * 6,
            height: '100%',
          },

          '& .MuiYearPicker-root': {
            minHeight: DATE_SIZE * 6,
            maxHeight: DATE_SIZE * 6,
            height: '100%',
          },

          '& .PrivatePickersSlideTransition-root [role="row"]': {
            margin: 0,
          },
        }}>
        <Typography
          textAlign="center"
          // className="time-header"
          variant="subtitle2"
          display="block"
          gutterBottom
          sx={{
            mb: 1,
            fontSize: theme => theme.spacing(1.5),
            color: theme => (theme.palette.mode === 'dark' ? '#FFFFFF' : '#383838'),
          }}>
          Select Date
        </Typography>

        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          openTo="day"
          value={date}
          onChange={newValue => {
            if (showBookingBtn) setShowBookingBtn(!showBookingBtn);
            if (checkedSlot) setCheckedSlot(!checkedSlot);
            setDate(newValue);
          }}
          onYearChange={handleChange}
          onMonthChange={handleChange}
          onAccept={handleChange}
          renderInput={params => <TextField {...params} />}
          disablePast
          minDate={_minDate}
          maxDate={_maxDate}
          //@ts-ignore
          date={date}
          openPicker={false}
          rawValue={date}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default DriveInPlanCalendar;
