import React, { useContext, useEffect } from "react";
import { Box, Grid, TextField } from "@mui/material";
import ServiceLocation from "../../components/forms/booking/ServiceLocation";
import DriveInPlanCalendar from "../../components/forms/booking/DriveInPlanCalendar";
import MobilePlanCalendar from "../../components/forms/booking/MobilePlanCalendar";
import { useFormikContext } from "formik";
import { HYBRID_PLAN, MOBILE_PLAN } from "../../config/constants";
import { AppContext } from "../../context/AppContextProvider";
import { IBookingFormValues } from "../../components/forms/booking/BookingForm";
import { FaCamera } from "react-icons/fa";
import "./uploadImage.css";
import { AppContextProps } from "@app-interfaces";
import bookingModel from "../../components/forms/models/bookingModel";
import Vehicle from "../../components/forms/booking/Vehicle";

interface Props {
  planCategory: string;
  date: any;
  setDate: any;
  height?: number;
  width?: number;
  image?: string;
}

interface IMediaProps {
  height?: number;
  width?: number;
  video?: string;
  image?: string;
}

function MediaComponent(props: IMediaProps) {
  return (
    <div>
      {props.video && (
        <video
          controls
          src={props.video}
          height={80}
          width={140}
          style={{
            borderRadius: "10px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          <track default kind="captions" srcLang="en" src="" />
          Sorry, your browser does not support embedded videos.
        </video>
      )}
      {props.image && (
        <img
          src={props.image}
          className="imageContainer"
          style={{ borderRadius: "10px", cursor: "pointer" }}
          alt="complaint"
        />
      )}
    </div>
  );
}

function ServiceLocationAndCalendar({
  planCategory,
  date,
  setDate,
  height,
  width,
  image,
}: Props) {
  const { planTab } = useContext(AppContext) as AppContextProps;
  const { handleBlur, handleChange, errors, touched, values, setErrors } =
    useFormikContext<IBookingFormValues>();

  useEffect(() => {
    setErrors({});
  }, [planTab, setErrors]);

  return (
    <Grid
      container
      rowSpacing={{ xs: 2, sm: 4, md: 6 }}
      columnSpacing={{ xs: 2, sm: 4, md: 6 }}
      sx={{ mb: 3 }}
    >
      <Grid item xs={12} md={6} className="topOne">
        <Vehicle />
        {planCategory === "Mobile" && <Box sx={{ mt: 3 }} />}
        <ServiceLocation planCategory={planCategory} />
        {planCategory === "Mobile" && <Box sx={{ mt: 3 }} />}
        {planCategory === "Drive-in" && <Box sx={{ mt: 3 }} />}
        <TextField
          label={bookingModel.fields.vehicleFault.label}
          value={values.vehicleFault}
          name={bookingModel.fields.vehicleFault.name}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          fullWidth
          className="vehicleFaultTextField"
          rows={1}
          error={
            errors.vehicleFault !== undefined &&
            touched.vehicleFault !== undefined
          }
          helperText={
            errors.vehicleFault && touched.vehicleFault && errors.vehicleFault
          }
        />

        <Box className="uploadGridImageVideoContainer">
          <Box>
            <div className="upload-image-wrapper">
              {image && (
                <MediaComponent height={height} width={width} image={image} />
              )}
            </div>

            <label
              htmlFor="actual-btn"
              className={image ? "hideContainer" : "upload-image-container"}
            >
              <FaCamera className="single-icon" />
            </label>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        {(planCategory === HYBRID_PLAN && planTab === 0) ||
        planCategory === MOBILE_PLAN ? (
          <MobilePlanCalendar date={date} setDate={setDate} />
        ) : (
          <DriveInPlanCalendar date={date} setDate={setDate} />
        )}
      </Grid>
    </Grid>
  );
}

export default ServiceLocationAndCalendar;
