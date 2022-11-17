import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import moment from "moment";
import { Form, Formik, FormikHelpers } from "formik";

import ServiceLocationAndCalendar from "../../../containers/booking/ServiceLocationAndCalendar";
import VehicleFaultAndTimeSlot from "../../../containers/booking/VehicleFaultAndTimeSlot";
import SkipAndSubmitButtons from "../../../containers/booking/SkipAndSubmitButtons";
import "./bookingForm.css";
import { Paper, Stack } from "@mui/material";
import bookingModel from "../../../components/forms/models/bookingModel";
import settings from "../../../config/settings";
import { DRIVE_IN_PLAN, HYBRID_PLAN, LOCAL_STORAGE, MAIN_OFFICE, MOBILE_PLAN } from "../../../config/constants";
import { AppContext } from "../../../context/AppContextProvider";
import { IAppointment } from "@app-models";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { AppContextProps } from "@app-interfaces";
import useUploadFile from "../../../hooks/useUploadFile";
import { createAppointmentAction } from "../../../store/actions/appointmentActions";

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
  vehicle: string;
}

const bookingFormValues: IBookingFormValues = {
  location: "",
  vehicleFault: "",
  vehicle: "",
};

export default function BookForCustomerForm(props: IBookingProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [slot, setSlot] = useState<string>("");
  const [planCategory, setPlanCategory] = useState<string>(DRIVE_IN_PLAN);
  const [_bookingFormValues, _setBookingFormValues] = useState<IBookingFormValues>(bookingFormValues);

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
    vehicles,
    customer,
  } = useContext(AppContext) as AppContextProps;

  const { image, height, width } = useUploadFile();

  const dispatch = useAppDispatch();
  //const timeSlotReducer = useAppSelector((state) => state.timeSlotReducer);

  useEffect(() => {
    if (props.planCategory) {
      if (props.planCategory === DRIVE_IN_PLAN) {
        _setBookingFormValues((prevState) => ({
          ...prevState,
          location: MAIN_OFFICE,
        }));
      }
      setPlanCategory(props.planCategory);
    }
  }, [props.planCategory]);

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
    [setCheckedSlot, setShowBookingBtn, showBookingBtn]
  );

  const handleBookAppointment = (values: IBookingFormValues, formikHelpers: FormikHelpers<IBookingFormValues>) => {
    //If location is empty for mobile plan, set error
    if (planCategory === MOBILE_PLAN && !values.location.length) {
      return formikHelpers.setFieldError(
        bookingModel.fields.location.name,
        bookingModel.fields.location.error.required
      );
    }

    //If location is empty for hybrid mobile plan, set error
    if (planCategory === HYBRID_PLAN && planTab === 0 && !values.location.length) {
      return formikHelpers.setFieldError(
        bookingModel.fields.location.name,
        bookingModel.fields.location.error.required
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
      timeSlot = moment(date.toISOString()).format("LT");
    }

    // If plan is drive-in or hybrid drive-in, set local storage data
    // to update time slots for each day
    if (planCategory === DRIVE_IN_PLAN || (planCategory === HYBRID_PLAN && planTab === 1)) {
      // const timeSlotDate = timeSlotReducer.timeSlot?.date;
      // const time = slot;

      if (showBooking) setShowBooking(!showBooking);
    }

    const vehicle = vehicles.find(
      (vehicle) => `(${vehicle.modelYear}) ${vehicle.make} ${vehicle.model}` === values.vehicle
    );

    if (vehicle && customer) {
      const data = {
        planCategory,
        appointmentDate: date.toISOString(),
        vehicleFault: values.vehicleFault,
        vehicleId: vehicle.id,
        customerId: customer.id,
        location: serviceLocation,
        reference: props.paymentReference,
        subscriptionName: props.subscriptionName,
        amount: props.amount,
        timeSlot,
      };

      dispatch(createAppointmentAction(data));
    }

    setShowBooking(false);
    setShowBookingBtn(false);
  };

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bookingFormContainer"
    >
      <Formik
        initialValues={_bookingFormValues}
        validationSchema={bookingModel.schema[1]}
        onSubmit={handleBookAppointment}
        enableReinitialize
      >
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
