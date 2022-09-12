import * as Yup from "yup";

export interface ICreatePartnerModel {
  name: string;
  phone: string;
  email: string;
  category: string;
  state: string;
}

const fields = {
  name: {
    name: "name",
    label: "Partner Name*",
    error: {
      invalid: "Invalid name.",
      required: "Partner name is required",
    },
  },
  phone: {
    name: "phone",
    label: "Phone*",
    error: {
      invalid: `Phone number is invalid`,
      required: "Phone is required",
    },
  },
  email: {
    name: "email",
    label: "Email*",
    error: {
      invalid: `Email is invalid`,
      required: "Email is required",
    },
  },
  category: {
    name: "category",
    label: "Category*",
    error: {
      invalid: `Category is invalid`,
      required: "Category is required",
    },
  },
  district: {
    name: "district",
    label: "District*",
    error: {
      invalid: "District is invalid",
      required: "Please choose district.",
    },
  },
  state: {
    name: "state",
    label: "State*",
    error: {
      invalid: "State is invalid",
      required: "Please choose state.",
    },
  },
  yearOfIncorporation: {
    name: "yearOfIncorporation",
    label: "Year Of Incorporation*",
    error: {
      invalid: "Year Of Incorporation is invalid",
      required: "Please provide Year Of Incorporation.",
    },
  },
  cac: {
    name: "cac",
    label: "CAC*",
    error: {
      invalid: "CAC is invalid",
      required: "Please provide cac.",
    },
  },
};

const initialValues = {
  name: "",
  phone: "",
  email: "",
  category: "",
  state: "",
};

const schema = Yup.object().shape({
  name: Yup.string()
      .required(fields.name.error.required)
      .label(fields.name.label),
  phone: Yup.string()
      .max(11)
      .required(fields.phone.error.required)
      .label(fields.phone.label),
  email: Yup.string()
      .email()
      .required(fields.email.error.required)
      .label(fields.email.label),
  category: Yup.string()
      .required(fields.category.error.required)
      .label(fields.category.label),
  state: Yup.string()
      .required(fields.state.error.required)
      .label(fields.state.label),
});

const partnerModel = {
  fields,
  initialValues,
  schema,
};

export default partnerModel;
