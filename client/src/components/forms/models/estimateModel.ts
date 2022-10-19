import * as Yup from "yup";

export interface IPart {
  name: string;
  quality: string;
  quantity: string;
  cost: string;
}

export interface ILabour {
  title: string;
  cost: string;
}

export interface IEstimateValues {
  parts: IPart[];
  labours: ILabour[];
  tax: string;
  discount: string;
  vin: string;
  make: string;
  model: string;
  modelYear: string;
  plateNumber: string;
  mileage: { count: string; unit: string };
  address: string;
  firstName: string;
  lastName: string;
  phone: string;
  depositAmount: string;
  jobDuration: { count: string; interval: string };
}

const fields = {
  firstName: {
    name: "firstName",
    label: "First Name",
    error: {
      invalid: "First Name is invalid",
      required: "First Name is required",
    },
  },
  lastName: {
    name: "lastName",
    label: "Last Name",
    error: {
      invalid: "Last Name is invalid",
      required: "Last Name is required",
    },
  },
  phone: {
    name: "phone",
    label: "Phone Number",
    error: {
      invalid: "Phone Number is invalid",
      required: "Phone Number is required",
    },
  },
  parts: {
    name: "parts",
    label: "Parts",
    error: {
      invalid: "Part is invalid",
      required: "Part is required",
    },
  },
  labours: {
    name: "labours",
    label: "Labour",
    error: {
      invalid: "Labour is invalid",
      required: "Labour is required",
    },
  },
  tax: {
    name: "tax",
    label: "Tax",
    error: {
      invalid: "Tax is invalid",
      required: "Tax is required",
    },
  },
  discount: {
    name: "discount",
    label: "Discount (%)",
    error: {
      invalid: "Discount is invalid",
      required: "Discount is required",
    },
  },
  address: {
    name: "address",
    label: "Address",
    error: {
      invalid: "Address is invalid",
      required: "Address is required",
    },
  },
  vin: {
    name: "vin",
    label: "VIN",
    error: {
      invalid: "VIN is invalid",
      required: "VIN is required",
    },
  },
  make: {
    name: "make",
    label: "Make",
    error: {
      invalid: "Make is invalid",
      required: "Make is required",
    },
  },
  model: {
    name: "model",
    label: "Model",
    error: {
      invalid: "Model is invalid",
      required: "Model is required",
    },
  },
  modelYear: {
    name: "modelYear",
    label: "Model Year",
    error: {
      invalid: "Model Year is invalid",
      required: "Model Year is required",
    },
  },
  mileage: {
    name: "mileage",
    label: "Mileage",
    error: {
      invalid: "Mileage is invalid",
      required: "Mileage is required",
    },
  },
  plateNumber: {
    name: "plateNumber",
    label: "Plate Number",
    error: {
      invalid: "Plate Number is invalid",
      required: "Plate Number is required",
    },
  },
  depositAmount: {
    name: "depositAmount",
    label: "Deposit Amount",
    error: {
      invalid: "Deposit Amount is invalid",
      required: "Deposit Amount is required",
    },
  },
};

const initialValues: IEstimateValues = {
  mileage: { count: "", unit: "" },
  plateNumber: "",
  depositAmount: "",
  jobDuration: { count: "", interval: "" },
  firstName: "",
  lastName: "",
  make: "",
  model: "",
  modelYear: "",
  phone: "",
  vin: "",
  address: "",
  parts: [{ name: "", quality: "", quantity: "", cost: "" }],
  labours: [{ title: "", cost: "" }],
  discount: "",
  tax: "",
};

const jobIntervalSchema = Yup.object().shape({
  count: Yup.string().required().label("Duration"),
  interval: Yup.string().required().label("Interval"),
});

const schema = Yup.object().shape({
  firstName: Yup.string()
    .required(fields.firstName.error.required)
    .label(fields.firstName.label),
  lastName: Yup.string()
    .required(fields.lastName.error.required)
    .label(fields.lastName.label),
  address: Yup.string()
    .required(fields.address.error.required)
    .label(fields.address.label),
  phone: Yup.string()
    .required(fields.phone.error.required)
    .label(fields.phone.label),
  vin: Yup.string().required(fields.vin.error.required).label(fields.vin.label),
  make: Yup.string()
    .required(fields.make.error.required)
    .label(fields.make.label),
  model: Yup.string()
    .required(fields.model.error.required)
    .label(fields.model.label),
  modelYear: Yup.string()
    .required(fields.modelYear.error.required)
    .label(fields.modelYear.label),
  tax: Yup.string().nullable().label(fields.tax.label),
  discount: Yup.string().nullable().label(fields.discount.label),
  depositAmount: Yup.string().nullable().label(fields.depositAmount.label),
});

const estimateModel = {
  fields,
  initialValues,
  schema,
};

export default estimateModel;
