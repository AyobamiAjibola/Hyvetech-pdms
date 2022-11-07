import { useEffect } from "react";
import { useFormikContext } from "formik";
import { getVehicleVINAction } from "../store/actions/vehicleActions";
import useAppSelector from "./useAppSelector";
import useAppDispatch from "./useAppDispatch";
import { clearGetVehicleVINStatus } from "../store/reducers/vehicleReducer";
import { IVehicle } from "@app-models";
import { IVINDecoderSchema } from "@app-interfaces";

export default function useVINDecoder() {
  const {
    setFieldValue,
    setFieldTouched,
    setFieldError,
    resetForm,
    values,
    errors,
    handleChange,
    handleBlur,
    touched,
  } = useFormikContext<IVehicle>();

  const vehicleReducer = useAppSelector((state) => state.vehicleReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        values.vin.length &&
        (values.vin.length < 17 || values.vin.length > 17)
      ) {
        setFieldError("vin", "VIN is invalid");
        setFieldTouched("vin", true);
      }

      if (values.vin.length === 17) {
        dispatch(getVehicleVINAction(values.vin));
      }
    }, 1000);

    setFieldTouched("vin", false);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [values.vin]);

  useEffect(() => {
    if (vehicleReducer.getVehicleVINStatus === "completed") {
      const tempVehicleDetails = JSON.parse(
        JSON.stringify([...vehicleReducer.vehicleVINDetails])
      );

      tempVehicleDetails.forEach((detail: IVINDecoderSchema) => {
        if (detail.label === "engineCylinders") {
          detail.value = `${detail.value} cylinders`;
        }

        setFieldValue(detail.label, detail.value);
      });
    }
  }, [
    vehicleReducer.getVehicleVINStatus,
    vehicleReducer.vehicleVINDetails,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  ]);

  useEffect(() => {
    if (vehicleReducer.getVehicleVINStatus === "failed") {
      if (
        vehicleReducer.getVehicleVINError ===
        "Cannot read properties of undefined (reading 'map')"
      ) {
        setFieldError("vin", "VIN is invalid");
      } else {
        setFieldError("vin", vehicleReducer.getVehicleVINError);
      }
      setFieldTouched("vin", true);
    }
  }, [
    setFieldError,
    setFieldTouched,
    vehicleReducer.getVehicleVINError,
    vehicleReducer.getVehicleVINStatus,
  ]);

  useEffect(() => {
    return () => {
      dispatch(clearGetVehicleVINStatus());
      resetForm();
    };
  }, [dispatch, resetForm]);

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    touched,
  };
}
