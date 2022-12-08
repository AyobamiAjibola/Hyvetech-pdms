import * as Yup from 'yup';

export interface IGarageSignupModel {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  dialCode: string;
  state: string;
  isRegistered: boolean;
}

const fields = {
  firstName: {
    name: 'firstName',
    label: 'First Name*',
    error: {
      invalid: 'Invalid First Name.',
      required: 'First Name is required.',
    },
  },
  lastName: {
    name: 'lastName',
    label: 'Last Name*',
    error: {
      invalid: `Invalid Last Name.`,
      required: 'Last Name is required.',
    },
  },
  name: {
    name: 'name',
    label: 'Your Workshop/Business Name*',
    error: {
      invalid: 'Invalid Workshop/Business Name.',
      required: 'Workshop/Business Name is required.',
    },
  },
  email: {
    name: 'email',
    label: 'Your Email address*',
    error: {
      invalid: 'Invalid email.',
      required: 'Email is required.',
    },
  },
  phone: {
    name: 'phone',
    label: 'Phone Number*',
    error: {
      invalid: `Invalid Phone Number.`,
      required: `Invalid Phone Number.`,
    },
  },
  dialCode: {
    name: 'dialCode',
    label: 'Dial Code*',
    error: {
      invalid: `Invalid Dial Code`,
      required: `Invalid Dial Code`,
    },
  },

  state: {
    name: 'state',
    label: 'What state is your workshop located*',
    error: {
      invalid: `Invalid State selected`,
      required: 'State is required',
    },
  },
  isRegistered: {
    name: 'isRegistered',
    label: 'My workshop is legally registered',
    error: {
      invalid: `Passwords do not match`,
      required: 'You must check this option',
    },
  },
};

const initialValues: IGarageSignupModel = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  dialCode: '',
  name: '',
  state: '',
  isRegistered: false,
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
  [fields.name.name]: Yup.string().required(fields.name.error.required).label(fields.name.label),
  [fields.email.name]: Yup.string()
    .email(fields.email.error.invalid)
    .label(fields.email.label)
    .required(fields.email.error.required),
  [fields.phone.name]: Yup.string()
    .length(11, fields.phone.error.invalid)
    .required(fields.phone.error.required)
    .label(fields.phone.label),
  [fields.dialCode.name]: Yup.string().required(fields.dialCode.error.required).label(fields.dialCode.label),
  [fields.state.name]: Yup.string().label(fields.state.label).required(fields.state.error.required),
  [fields.isRegistered.name]: Yup.boolean()
    .oneOf([true], fields.isRegistered.error.required)
    .label(fields.isRegistered.label)
    .required(fields.isRegistered.error.required),
});

const garageSignUpModel = {
  fields,
  initialValues,
  schema,
};

export default garageSignUpModel;
