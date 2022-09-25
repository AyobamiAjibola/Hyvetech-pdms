import * as Yup from "yup";

export interface IBrands {
  name: string;
  description: string;
  image: string;
}

export interface Images {
  value: string;
}

export interface IWorkingHours {
  from: Date;
  to: Date;
}

export interface IRideShareSettings {
  cac: string;
  phone: string;
  totalStaff: string;
  yearOfIncorporation: Date;
  brands: IBrands[];
  images: Images[];
  workingHours: IWorkingHours[];
}

const fields = {
  cac: {
    name: "cac",
    label: "CAC",
    error: {
      invalid: "CAC is invalid",
      required: "CAC is required",
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
  totalStaff: {
    name: "totalStaff",
    label: "Total Staff",
    error: {
      invalid: "Total Staff is invalid",
      required: "Total Staff is required",
    },
  },
  yearOfIncorporation: {
    name: "yearOfIncorporation",
    label: "Year of Incorporation",
    error: {
      invalid: "Year of Incorporation is invalid",
      required: "Year of Incorporation is required",
    },
  },
  brands: {
    name: "brands",
    label: "Brands",
    error: {
      invalid: "Brands is invalid",
      required: "Brands is required",
    },
  },
  images: {
    name: "images",
    label: "Images",
    error: {
      invalid: "Images is invalid",
      required: "Images is required",
    },
  },
  workingHours: {
    name: "workingHours",
    label: "Working Hours",
    error: {
      invalid: "Working Hours is invalid",
      required: "Working Hours is required",
    },
  },
};

const initialValues: IRideShareSettings = {
  cac: "",
  phone: "",
  totalStaff: "",
  yearOfIncorporation: new Date(),
  brands: [{ name: "", description: "", image: "" }],
  images: [{ value: "" }],
  workingHours: [{ from: new Date(), to: new Date() }],
};

const schema = Yup.object().shape({
  cac: Yup.string().nullable().label(fields.cac.label),
  phone: Yup.string().nullable().label(fields.phone.label),
  totalStaff: Yup.string().nullable().label(fields.totalStaff.label),
  yearOfIncorporation: Yup.string()
    .nullable()
    .label(fields.yearOfIncorporation.label),
  brands: Yup.array().of(Yup.object()).nullable().label(fields.brands.label),
  images: Yup.array().of(Yup.object()).nullable().label(fields.images.label),
  workingHours: Yup.array()
    .of(Yup.object())
    .nullable()
    .label(fields.workingHours.label),
});

const rideShareSettingsModel = {
  initialValues,
  schema,
  fields,
};

export default rideShareSettingsModel;
