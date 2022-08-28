import * as Yup from "yup";

const fields = {
  vehicleFault: {
    name: "vehicleFault",
    label: "Describe Vehicle Fault",
    error: {
      invalid: "Vehicle fault is invalid",
      required: "Please enter your vehicle fault",
    },
  },
  location: {
    name: "location",
    label: "Enter your location",
    error: {
      invalid: "Service location is invalid",
      required: "Please enter your service location.",
    },
  },
};

const initialValues = {
  [fields.vehicleFault.name]: "",
  [fields.location.name]: "",
};

const schema = Yup.object().shape({
  [fields.vehicleFault.name]: Yup.string()
    .required(fields.vehicleFault.error.required)
    .label(fields.vehicleFault.label),
  [fields.location.name]: Yup.string()
    .required(fields.location.error.required)
    .label(fields.location.label),
});

const bookingModel = {
  fields,
  initialValues,
  schema,
};

export default bookingModel;
