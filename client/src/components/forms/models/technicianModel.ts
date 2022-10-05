import * as Yup from "yup";
import { PASSWORD_PATTERN } from "../../../config/constants";

export interface ITechnicianValues {
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  active: boolean;
}

const fields = {
  firstName: {
    name: "firstName",
    label: "First Name*",
    error: {
      invalid: "Invalid First Name.",
      required: "First Name is required",
    },
  },
  lastName: {
    name: "lastName",
    label: "Last Name*",
    error: {
      invalid: `Invalid Last Name`,
      required: "Last Name is required",
    },
  },
  email: {
    name: "email",
    label: "Email*",
    error: {
      invalid: "Invalid email.",
      required: "Email is required",
    },
  },
  phone: {
    name: "phone",
    label: "Phone",
    error: {
      invalid: `Invalid Phone Number`,
      required: "Phone Number is required",
    },
  },
  password: {
    name: "password",
    label: "Password*",
    error: {
      invalid: `Password must contain 8 to 20 characters,
         and at least One, uppercase letter, lowercase letter, 
         special case character e.g @!&, and number`,
      required: "Password is required",
    },
  },
  confirmPassword: {
    name: "confirmPassword",
    label: "Confirm Password*",
    error: {
      invalid: `Passwords do not match`,
      required: "Confirm Password is required",
    },
  },

  active: {
    name: "active",
    label: "Active*",
    error: {
      invalid: `Active is invalid`,
      required: "Active is required",
    },
  },
};

const initialValues: ITechnicianValues = {
  confirmPassword: "",
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  phone: "",
  active: false,
};

const schema = [
  Yup.object().shape({
    [fields.firstName.name]: Yup.string()
      .max(80, fields.firstName.error.invalid)
      .label(fields.firstName.label)
      .required(fields.firstName.error.required),
    [fields.lastName.name]: Yup.string()
      .max(80, fields.lastName.error.invalid)
      .label(fields.lastName.label)
      .required(fields.lastName.error.required),
    [fields.email.name]: Yup.string()
      .email(fields.email.error.invalid)
      .required(fields.email.error.required)
      .label(fields.email.label),
    [fields.phone.name]: Yup.string()
      .max(11, fields.phone.error.invalid)
      .required(fields.phone.error.required)
      .label(fields.phone.label),
    [fields.password.name]: Yup.string()
      .required(fields.password.error.required)
      .matches(new RegExp(PASSWORD_PATTERN), fields.password.error.invalid)
      .label(fields.password.label),
    [fields.confirmPassword.name]: Yup.string()
      .oneOf(
        [Yup.ref(fields.password.name), null],
        fields.confirmPassword.error.invalid
      )
      .label(fields.confirmPassword.label)
      .required(fields.confirmPassword.error.required),
    [fields.active.name]: Yup.boolean()
      .oneOf([true], fields.active.error.required)
      .required(fields.active.error.required),
  }),
  Yup.object().shape({
    [fields.firstName.name]: Yup.string()
      .max(80, fields.firstName.error.invalid)
      .label(fields.firstName.label)
      .required(fields.firstName.error.required),
    [fields.lastName.name]: Yup.string()
      .max(80, fields.lastName.error.invalid)
      .label(fields.lastName.label)
      .required(fields.lastName.error.required),
    [fields.email.name]: Yup.string()
      .email(fields.email.error.invalid)
      .required(fields.email.error.required)
      .label(fields.email.label),
    [fields.phone.name]: Yup.string()
      .max(11, fields.phone.error.invalid)
      .required(fields.phone.error.required)
      .label(fields.phone.label),
    [fields.active.name]: Yup.boolean()
      .oneOf([true], fields.active.error.required)
      .required(fields.active.error.required),
  }),
];

const technicianModel = {
  fields,
  initialValues,
  schema,
};

export default technicianModel;
