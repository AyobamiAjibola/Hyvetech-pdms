import * as Yup from "yup";

export interface IPlanModel {
  label: string;
  minVehicles: string;
  maxVehicles: string;
  validity: string;
  mobile: string;
  driveIn: string;

  [p: string]: any;
}

const schema = Yup.object().shape({
  label: Yup.string().required().label("Plan Name"),
  minVehicles: Yup.string().required().label("Minimum Vehicle"),
  maxVehicles: Yup.string().required().label("Maximum  Vehicle"),
  validity: Yup.string().required().label("Plan Validity"),
  mobile: Yup.string().required().label("No of Mobile Service"),
  driveIn: Yup.string().required().label("No of Drive-in Service"),
});

const initialValues: IPlanModel = {
  label: "",
  minVehicles: "0",
  maxVehicles: "0",
  validity: "1",
  mobile: "0",
  driveIn: "0",
};

const fields = {
  name: {
    name: "label",
    label: "Plan Name*",
    error: {
      invalid: "Invalid name.",
      required: "Partner name is required",
    },
  },
  minVehicles: {
    name: "minVehicles",
    label: "Phone*",
    error: {
      invalid: `Phone number is invalid`,
      required: "Phone is required",
    },
  },
  maxVehicles: {
    name: "maxVehicles",
    label: "Email*",
    error: {
      invalid: `Email is invalid`,
      required: "Email is required",
    },
  },
  validity: {
    name: "validity",
    label: "Category*",
    error: {
      invalid: `Category is invalid`,
      required: "Category is required",
    },
  },
  mobile: {
    name: "mobile",
    label: "District*",
    error: {
      invalid: "District is invalid",
      required: "Please choose district.",
    },
  },
  driveIn: {
    name: "driveIn",
    label: "State*",
    error: {
      invalid: "State is invalid",
      required: "Please choose state.",
    },
  },
};

const planModel = {
  fields,
  initialValues,
  schema,
};

export default planModel;
