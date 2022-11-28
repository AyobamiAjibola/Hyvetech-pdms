import * as Yup from 'yup';

export interface ICreatePartnerModel {
  name: string;
  phone: string;
  email: string;
  category: string;
  state: string;
  logo: Blob | string | File;
}

export interface IKycValues {
  name: string;
  workshopAddress: string;
  cac: string;
  vatNumber: string;
  nameOfDirector: string;
  nameOfManager: string;
}

export interface IBrands {
  name: string;
  description: string;
}

export interface Images {
  name: string;
  value: Blob | string;
}

export interface IWorkingHours {
  days: string[];
  from: Date;
  to: Date;
}

export interface IGarageSettings {
  logo: string | File;
  googleMap: string;
  phone: string;
  totalStaff: string;
  totalTechnicians: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  brands: IBrands[];
  workingHours: IWorkingHours[];
}

const fields = {
  name: {
    name: 'name',
    label: 'Company Full Name*',
    error: {
      invalid: 'Invalid Company Full Name.',
      required: 'Company Full Name is required',
    },
  },
  phone: {
    name: 'phone',
    label: 'Contact Number*',
    error: {
      invalid: `Phone number is invalid`,
      required: 'Phone is required',
    },
  },
  email: {
    name: 'email',
    label: 'Email*',
    error: {
      invalid: `Email is invalid`,
      required: 'Email is required',
    },
  },
  category: {
    name: 'category',
    label: 'Category*',
    error: {
      invalid: `Category is invalid`,
      required: 'Category is required',
    },
  },
  workshopAddress: {
    name: 'workshopAddress',
    label: 'Workshop Address*',
    error: {
      invalid: `Workshop Address is invalid`,
      required: 'Workshop Address is required',
    },
  },
  district: {
    name: 'district',
    label: 'District*',
    error: {
      invalid: 'District is invalid',
      required: 'Please choose district.',
    },
  },
  state: {
    name: 'state',
    label: 'State*',
    error: {
      invalid: 'State is invalid',
      required: 'Please choose state.',
    },
  },
  yearOfIncorporation: {
    name: 'yearOfIncorporation',
    label: 'Year Of Incorporation*',
    error: {
      invalid: 'Year Of Incorporation is invalid',
      required: 'Please provide Year Of Incorporation.',
    },
  },
  cac: {
    name: 'cac',
    label: 'CAC*',
    error: {
      invalid: 'CAC is invalid',
      required: 'Please provide cac.',
    },
  },
  vatNumber: {
    name: 'vatNumber',
    label: 'VAT Number',
    error: {
      invalid: 'VAT Number is invalid',
      required: 'Please provide VAT Number.',
    },
  },
  nameOfDirector: {
    name: 'nameOfDirector',
    label: 'Name of Director*',
    error: {
      invalid: 'Name of Director is invalid',
      required: 'Please provide Name of Director.',
    },
  },
  nameOfManager: {
    name: 'nameOfManager',
    label: 'Name of Manager*',
    error: {
      invalid: 'Name of Manager is invalid',
      required: 'Please provide Name of Manager.',
    },
  },

  totalStaff: {
    name: 'totalStaff',
    label: 'Total Staff*',
    error: {
      invalid: 'Total Staff is invalid',
      required: 'Total Staff is required',
    },
  },

  totalTechnicians: {
    name: 'totalTechnicians',
    label: 'Total Technicians*',
    error: {
      invalid: 'Total Technicians is invalid',
      required: 'Total Technicians is required',
    },
  },

  logo: {
    name: 'logo',
    label: 'Company Logo*',
    error: {
      invalid: 'Company Logo is invalid',
      required: 'Company Logo is required',
    },
  },
  googleMap: {
    name: 'googleMap',
    label: 'Google map link*',
    error: {
      invalid: 'Google map link is invalid',
      required: 'Google map link is required',
    },
  },

  brands: {
    name: 'brands',
    label: 'Brands*',
    error: {
      invalid: 'Brands is invalid',
      required: 'Brands is required',
    },
  },
  images: {
    name: 'images',
    label: 'Images',
    error: {
      invalid: 'Images is invalid',
      required: 'Images is required',
    },
  },
  workingHours: {
    name: 'workingHours',
    label: 'Working Hours*',
    error: {
      invalid: 'Working Hours is invalid',
      required: 'Working Hours is required',
    },
  },

  bankName: {
    name: 'bankName',
    label: 'Bank Name*',
    error: {
      invalid: 'Bank Name is invalid',
      required: 'Bank Name is required',
    },
  },

  accountName: {
    name: 'accountName',
    label: 'Account Name*',
    error: {
      invalid: 'Account Name is invalid',
      required: 'Account Name is required',
    },
  },

  accountNumber: {
    name: 'accountNumber',
    label: 'Account Number*',
    error: {
      invalid: 'Account Number is invalid',
      required: 'Account Number is required',
    },
  },
};

const initialValues: ICreatePartnerModel = {
  name: '',
  phone: '',
  email: '',
  category: '',
  state: '',
  logo: '',
};

const schema = [
  Yup.object().shape({
    name: Yup.string().required(fields.name.error.required).label(fields.name.label),
    phone: Yup.string().max(11).required(fields.phone.error.required).label(fields.phone.label),
    email: Yup.string().email().required(fields.email.error.required).label(fields.email.label),
    category: Yup.string().required(fields.category.error.required).label(fields.category.label),
    state: Yup.string().required(fields.state.error.required).label(fields.state.label),
    logo: Yup.mixed().nullable().label(fields.logo.label),
  }),
  Yup.object().shape({
    [fields.name.name]: Yup.string().required(fields.name.error.required).label(fields.name.label),
    [fields.nameOfDirector.name]: Yup.string()
      .required(fields.nameOfDirector.error.required)
      .label(fields.nameOfDirector.label),
    [fields.nameOfManager.name]: Yup.string()
      .required(fields.nameOfManager.error.required)
      .label(fields.nameOfManager.label),
    [fields.cac.name]: Yup.string().required(fields.cac.error.required).label(fields.cac.label),
    [fields.vatNumber.name]: Yup.string().nullable().label(fields.vatNumber.label),
    [fields.workshopAddress.name]: Yup.string().required().label(fields.workshopAddress.label),
  }),
  Yup.object().shape({
    [fields.accountName.name]: Yup.string().required(fields.accountName.error.required).label(fields.accountName.label),
    [fields.accountNumber.name]: Yup.string()
      .length(10, fields.accountNumber.error.invalid)
      .required(fields.accountNumber.error.required)
      .label(fields.accountNumber.label),
    [fields.bankName.name]: Yup.string().required(fields.bankName.error.required).label(fields.bankName.label),
    [fields.googleMap.name]: Yup.string().required(fields.googleMap.error.required).label(fields.googleMap.label),
    [fields.logo.name]: Yup.string().required(fields.logo.error.required).label(fields.logo.label),
    [fields.phone.name]: Yup.string().required(fields.phone.error.required).label(fields.phone.label),
    [fields.totalStaff.name]: Yup.string().required(fields.totalStaff.error.required).label(fields.totalStaff.label),
    [fields.totalTechnicians.name]: Yup.string()
      .required(fields.totalTechnicians.error.required)
      .label(fields.totalTechnicians.label),
    brands: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().nullable(),
          description: Yup.string().nullable(),
        }),
      )
      .nullable(),
    workingHours: Yup.array().of(
      Yup.object()
        .shape({
          days: Yup.array().of(Yup.string()),
          from: Yup.date().nullable(),
          to: Yup.date().nullable(),
        })
        .nullable(),
    ),
  }),
];

const partnerModel = {
  fields,
  initialValues,
  schema,
};

export default partnerModel;
