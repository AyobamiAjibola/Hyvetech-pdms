import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Form, Formik, FormikHelpers } from 'formik';

import ServiceLocationAndCalendar from '../../../containers/booking/ServiceLocationAndCalendar';
import VehicleFaultAndTimeSlot from '../../../containers/booking/VehicleFaultAndTimeSlot';
import SkipAndSubmitButtons from '../../../containers/booking/SkipAndSubmitButtons';
import './bookingForm.css';
import { Paper, Stack } from '@mui/material';
import bookingModel from '../../../components/forms/models/bookingModel';
import settings from '../../../config/settings';
import { DRIVE_IN_PLAN, HYBRID_PLAN, LOCAL_STORAGE, MAIN_OFFICE, MOBILE_PLAN } from '../../../config/constants';
import { AppContext } from '../../../context/AppContextProvider';
import { IAppointment } from '@app-models';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import { AppContextProps } from '@app-interfaces';
import useUploadFile from '../../../hooks/useUploadFile';
import { rescheduleInspectionAction } from '../../../store/actions/appointmentActions';

interface IBookingProps {
  appointment?: IAppointment | null;
  planCategory?: string;
  subscriptionName?: string;
  amount?: number;
  paymentReference?: string;
}

export interface IBookingFormValues {
  location: string;
  vehicleFault: string;
}

const bookingFormValues: IBookingFormValues = {
  location: '',
  vehicleFault: '',
};

export default function BookingForm(props: IBookingProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [slot, setSlot] = useState<string>('');
  const [planCategory, setPlanCategory] = useState<string>(DRIVE_IN_PLAN);
  const [bookingData, setBookingData] = useState<IAppointment>();
  const [_bookingFormValues, _setBookingFormValues] = useState<IBookingFormValues>(bookingFormValues);
  const [mobileLocation, setMobileLocation] = useState<string>('');

  const {
    setShowBookingBtn,
    showBookingBtn,
    setCheckedSlot,
    planTab,
    showBooking,
    setShowBooking,
    setMobileDate,
    setShowTime,
    setPlanTab,
  } = useContext(AppContext) as AppContextProps;

  const { image, height, width } = useUploadFile();

  const dispatch = useAppDispatch();
  const timeSlotReducer = useAppSelector(state => state.timeSlotReducer);

  useEffect(() => {
    if (props.appointment) {
      const appointment = props.appointment;

      let location = '';

      if (appointment.planCategory === HYBRID_PLAN) {
        //Mobile mode
        if (appointment.serviceLocation !== MAIN_OFFICE) {
          location = appointment.serviceLocation;
          setMobileLocation(location);
        } else {
          location = MAIN_OFFICE;
        }
      }

      //Set location to MAIN Garage if mode is drive-in
      if (appointment.planCategory === DRIVE_IN_PLAN) {
        location = MAIN_OFFICE;
      }

      //Set location to customer location if mode is drive-in
      if (appointment.planCategory === MOBILE_PLAN) {
        location = appointment.serviceLocation;
        setMobileLocation(location);
      }

      setPlanCategory(appointment.planCategory);
      setBookingData(appointment);

      _setBookingFormValues({
        location,
        vehicleFault: appointment.vehicleFault.description ? appointment.vehicleFault.description : '',
      });
    }
  }, [props.appointment]);

  useEffect(() => {
    if (planCategory === HYBRID_PLAN && planTab === 1) {
      _setBookingFormValues(prevState => ({
        ...prevState,
        location: MAIN_OFFICE,
      }));
    }
    if (planCategory === HYBRID_PLAN && planTab === 0) {
      _setBookingFormValues(prevState => ({
        ...prevState,
        location: mobileLocation,
      }));
    }
    setDate(new Date());
  }, [mobileLocation, planCategory, planTab]);

  useEffect(() => {
    return () => {
      setShowBookingBtn(false);
      setCheckedSlot(false);
      setShowTime(false);
      setMobileDate(false);
      setPlanTab(0);
      localStorage.removeItem(LOCAL_STORAGE.bookingData);
    };
  }, [setCheckedSlot, setMobileDate, setPlanTab, setShowBookingBtn, setShowTime]);

  const handleSelectSlot = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!showBookingBtn) setShowBookingBtn(true);
      setCheckedSlot(e.target.checked);
      setSlot(e.target.value);
    },
    [setCheckedSlot, setShowBookingBtn, showBookingBtn],
  );

  const handleBookAppointment = (values: IBookingFormValues, formikHelpers: FormikHelpers<IBookingFormValues>) => {
    //If location is empty for mobile plan, set error
    if (planCategory === MOBILE_PLAN && !values.location.length) {
      return formikHelpers.setFieldError(
        bookingModel.fields.location.name,
        bookingModel.fields.location.error.required,
      );
    }

    //If location is empty for hybrid mobile plan, set error
    if (planCategory === HYBRID_PLAN && planTab === 0 && !values.location.length) {
      return formikHelpers.setFieldError(
        bookingModel.fields.location.name,
        bookingModel.fields.location.error.required,
      );
    }

    let serviceLocation = values.location;
    let timeSlot = slot;

    // If plan is drive-in, set location to main office address
    if (planCategory === DRIVE_IN_PLAN) serviceLocation = settings.office.secondary;

    // If plan is hybrid and drive-in, set location to main office address
    if (planCategory === HYBRID_PLAN && planTab === 1) serviceLocation = settings.office.secondary;

    // If plan is mobile, or hybrid mobile set time slot to normal date time
    if (planCategory === MOBILE_PLAN || (planCategory === HYBRID_PLAN && planTab === 0)) {
      timeSlot = moment(date.toISOString()).format('LT');
    }

    // If plan is drive-in or hybrid drive-in, set local storage data
    // to update time slots for each day
    if (planCategory === DRIVE_IN_PLAN || (planCategory === HYBRID_PLAN && planTab === 1)) {
      const timeSlotDate = timeSlotReducer.timeSlot?.date;
      const time = slot;

      if (showBooking) setShowBooking(!showBooking);

      localStorage.setItem(LOCAL_STORAGE.timeSlot, JSON.stringify({ date: timeSlotDate, time }));
    }

    // const now = moment();
    // const inspectionTime = moment(date);
    //
    // if (inspectionTime.isBefore(now))
    //   return alert("You cannot choose a previous time.");

    const id = bookingData?.id;
    const data = {
      planCategory,
      customerId: bookingData?.customerId,
      time: date.toISOString(),
      vehicleFault: values.vehicleFault,
      location: serviceLocation,
      timeSlot,
    };

    dispatch(rescheduleInspectionAction({ id, data }));

    setShowBooking(false);
    setShowBookingBtn(false);
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className="bookingFormContainer">
      <Formik
        initialValues={_bookingFormValues}
        validationSchema={bookingModel.schema[0]}
        onSubmit={handleBookAppointment}
        enableReinitialize>
        <Form>
          <Stack sx={{ my: 2 }}>
            <h5 className="time-header-schedule">Schedule An Inspection</h5>
            <ServiceLocationAndCalendar
              date={date}
              setDate={setDate}
              planCategory={planCategory}
              height={height}
              width={width}
              image={image}
            />

            <VehicleFaultAndTimeSlot slot={slot} handleSelectSlot={handleSelectSlot} planCategory={planCategory} />

            <SkipAndSubmitButtons />
          </Stack>
          <div className="bottomDiv" />
        </Form>
      </Formik>
    </Paper>
  );
}
