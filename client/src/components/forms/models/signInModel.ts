import * as Yup from "yup";
import { PASSWORD_PATTERN } from "../../../config/constants";

const fields = {
  username: {
    name: "username",
    label: "Username*",
    error: {
      invalid: "Invalid username.",
      required: "Username is required",
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
};

const initialValues = {
  username: "",
  password: "",
};

const schema = Yup.object().shape({
  username: Yup.string().required(fields.username.error.required).label(fields.username.label),
  password: Yup.string()
    .required(fields.password.error.required)
    .matches(new RegExp(PASSWORD_PATTERN), fields.password.error.invalid)
    .label(fields.password.label),
});

const signInModel = {
  fields,
  initialValues,
  schema,
};

export default signInModel;
