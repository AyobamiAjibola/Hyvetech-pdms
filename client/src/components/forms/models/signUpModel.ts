import * as Yup from "yup";
import { PASSWORD_PATTERN } from "../../../config/constants";

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
  username: {
    name: "username",
    label: "Username*",
    error: {
      invalid: "Invalid username.",
      required: "Username is required",
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
    },
  },

  role: {
    name: "role",
    label: "User Role*",
    error: {
      invalid: `Invalid Role selected`,
      required: "User Role is required",
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
};

const initialValues = {
  [fields.confirmPassword.name]: "",
  [fields.email.name]: "",
  [fields.firstName.name]: "",
  [fields.lastName.name]: "",
  [fields.password.name]: "",
  [fields.phone.name]: "",
  [fields.role.name]: "",
  [fields.username.name]: "",
};

const schema = Yup.object().shape({
  [fields.firstName.name]: Yup.string()
    .max(80, fields.firstName.error.invalid)
    .label(fields.firstName.label)
    .required(fields.firstName.error.required),
  [fields.lastName.name]: Yup.string()
    .max(80, fields.lastName.error.invalid)
    .label(fields.lastName.label)
    .required(fields.lastName.error.required),
  [fields.username.name]: Yup.string()
    .required(fields.username.error.required)
    .label(fields.username.label),
  [fields.email.name]: Yup.string()
    .email(fields.email.error.invalid)
    .label(fields.email.label)
    .required(fields.email.error.required),
  [fields.phone.name]: Yup.string()
    .max(11, fields.phone.error.invalid)
    .label(fields.phone.label),
  [fields.role.name]: Yup.string()
    .label(fields.role.label)
    .required(fields.role.error.required),
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
});

const signUpModel = {
  fields,
  initialValues,
  schema,
};

export default signUpModel;
