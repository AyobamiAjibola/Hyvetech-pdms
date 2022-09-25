import * as Yup from "yup";

export interface IPaymentPlanModelDescription {
  value: string;
}

export interface IPaymentPlanModelCoverage {
  name: string;
  unit: string;
  value: string;
}

export interface IPricing {
  interval: string;
  amount: string;
}

export interface IPaymentPlanModel {
  name: string;
  discount: string;
  plan: string;
  coverage: string;
  description: IPaymentPlanModelDescription[];
  parameter: IPaymentPlanModelCoverage[];
  pricing: IPricing[];
}

const initialValues: IPaymentPlanModel = {
  name: "",
  discount: "",
  plan: "",
  coverage: "",
  description: [{ value: "" }],
  parameter: [{ name: "", unit: "", value: "" }],
  pricing: [{ interval: "", amount: "" }],
};

const schema = Yup.object().shape({
  name: Yup.string().required().label("Payment Plans Name"),
  discount: Yup.string().nullable().label("Discount"),
  plan: Yup.string().required().label("Plans Name"),
  coverage: Yup.string().required().label("Coverage"),
  description: Yup.array()
    .of(Yup.object())
    .nullable()
    .label("Payment Plans Description"),
  parameter: Yup.array()
    .of(Yup.object())
    .nullable()
    .label("Payment Plans Coverage"),
  pricing: Yup.array()
    .of(Yup.object())
    .required()
    .label("Payment Plans Pricing"),
});

const fields = {
  name: {
    name: "name",
    label: "Payment Plans Name*",
    error: {
      invalid: "Invalid Payment Plans.",
      required: "Payment Plans name is required",
    },
  },
  discount: {
    name: "discount",
    label: "Discount (%)",
    error: {
      invalid: `Discount is invalid`,
      required: "Phone is required",
    },
  },
  plan: {
    name: "plan",
    label: "Select Plans*",
    error: {
      invalid: `Plan is invalid`,
      required: "Plans is required",
    },
  },
  coverage: {
    name: "coverage",
    label: "Coverage",
    error: {
      invalid: "Coverage is invalid",
      required: "Coverage is required",
    },
  },
  description: {
    name: "description",
    label: "Description",
    error: {
      invalid: "Description is invalid",
      required: "Description is required.",
    },
  },
  parameter: {
    name: "parameter",
    label: "Parameters",
    error: {
      invalid: "Parameters is invalid",
      required: "Parameters is required",
    },
  },
  pricing: {
    name: "pricing",
    label: "Pricing*",
    error: {
      invalid: "Pricing is invalid",
      required: "Pricing is required",
    },
  },
};

const paymentPlanModel = {
  fields,
  initialValues,
  schema,
};

export default paymentPlanModel;
