import * as Yup from 'yup';

export type IPartWarranty = { warranty: string; interval: string };
export type IPartQuantity = { quantity: string; unit: string };

export interface IPart {
  name: string;
  warranty: IPartWarranty;
  quantity: IPartQuantity;
  price: string;
  amount: string;
}

export interface ILabour {
  title: string;
  cost: string;
}

export interface IEstimateValues {
  invoice?: any;
  id?: number;
  parts: IPart[];
  labours: ILabour[];
  tax: string;
  taxPart: string;
  vin: string;
  make: string;
  model: string;
  modelYear: string;
  plateNumber: string;
  mileage: { count: string; unit: string };
  addressType: string;
  address: string;
  firstName: string;
  lastName: string;
  email?: string;
  state?: string;
  phone: string;
  depositAmount: string;
  jobDuration: { count: string; interval: string };
  status?: string;
  additionalDeposit: string;
  paidAmount: string;
  estimate?: any;
  note?: string;
}

const fields = {
  firstName: {
    name: 'firstName',
    label: 'First Name',
    error: {
      invalid: 'First Name is invalid',
      required: 'First Name is required',
    },
  },
  lastName: {
    name: 'lastName',
    label: 'Last Name',
    error: {
      invalid: 'Last Name is invalid',
      required: 'Last Name is required',
    },
  },
  phone: {
    name: 'phone',
    label: 'Phone Number',
    error: {
      invalid: 'Phone Number is invalid',
      required: 'Phone Number is required',
    },
  },
  email: {
    name: 'email',
    label: 'Email Address',
    error: {
      invalid: 'Email Address is invalid',
      required: 'Email Address is required',
    },
  },
  state: {
    name: 'state',
    label: 'State',
    error: {
      invalid: 'State is invalid',
      required: 'State is required',
    },
  },
  parts: {
    name: 'parts',
    label: 'Parts',
    error: {
      invalid: 'Part is invalid',
      required: 'Part is required',
    },
  },
  labours: {
    name: 'labours',
    label: 'Labour',
    error: {
      invalid: 'Labour is invalid',
      required: 'Labour is required',
    },
  },
  tax: {
    name: 'tax',
    label: 'Tax',
    error: {
      invalid: 'Tax is invalid',
      required: 'Tax is required',
    },
  },
  taxPart: {
    name: 'tax',
    label: 'Tax',
    error: {
      invalid: 'Tax is invalid',
      required: 'Tax is required',
    },
  },
  discount: {
    name: 'discount',
    label: 'Discount',
    error: {
      invalid: 'Discount is invalid',
      required: 'Discount is required',
    },
  },
  address: {
    name: 'address',
    label: 'Address',
    error: {
      invalid: 'Address is invalid',
      required: 'Address is required',
    },
  },
  addressType: {
    name: 'addressType',
    label: 'Type',
    error: {
      invalid: 'Address Type is invalid',
      required: 'Address Type is required',
    },
  },
  vin: {
    name: 'vin',
    label: 'VIN',
    error: {
      invalid: 'VIN is invalid',
      required: 'VIN is required',
    },
  },
  make: {
    name: 'make',
    label: 'Make',
    error: {
      invalid: 'Make is invalid',
      required: 'Make is required',
    },
  },
  model: {
    name: 'model',
    label: 'Model',
    error: {
      invalid: 'Model is invalid',
      required: 'Model is required',
    },
  },
  modelYear: {
    name: 'modelYear',
    label: 'Model Year',
    error: {
      invalid: 'Model Year is invalid',
      required: 'Model Year is required',
    },
  },
  mileageValue: {
    name: 'mileage',
    label: 'Mileage Value',
    error: {
      invalid: 'Mileage Value is invalid',
      required: 'Mileage Value is required',
    },
  },
  mileageUnit: {
    name: 'mileage',
    label: 'Mileage Unit',
    error: {
      invalid: 'Mileage Unit is invalid',
      required: 'Mileage Unit is required',
    },
  },
  partsTotal: {
    name: 'mileage',
    label: 'Parts Total',
    error: {
      invalid: 'Parts Total is invalid',
      required: 'Parts Total is required',
    },
  },
  laboursTotal: {
    name: 'mileage',
    label: 'Labours Total',
    error: {
      invalid: 'Labours Total is invalid',
      required: 'Labours Total is required',
    },
  },
  grandTotal: {
    name: 'mileage',
    label: 'Grand Total',
    error: {
      invalid: 'Grand Total is invalid',
      required: 'Grand Total is required',
    },
  },
  plateNumber: {
    name: 'plateNumber',
    label: 'Plate Number',
    error: {
      invalid: 'Plate Number is invalid',
      required: 'Plate Number is required',
    },
  },
  depositAmount: {
    name: 'depositAmount',
    label: 'Deposit Amount',
    error: {
      invalid: 'Deposit Amount is invalid',
      required: 'Deposit Amount is required',
    },
  },
  paidAmount: {
    name: 'paidAmount',
    label: 'Paid Amount',
    error: {
      invalid: 'Paid Amount is invalid',
      required: 'Paid Amount is required',
    },
  },
  additionalDeposit: {
    name: 'additionalDeposit',
    label: 'Additional Amount',
    error: {
      invalid: 'Additional Amount is invalid',
      required: 'Additional Amount is required',
    },
  },
  jobDuration: {
    name: 'jobDuration',
    label: 'Job Duration',
    error: {
      invalid: 'Job Duration is invalid',
      required: 'Job Duration is required',
    },
  },
  jobDurationValue: {
    name: 'mileage',
    label: 'Job Duration Value',
    error: {
      invalid: 'Job Duration Value is invalid',
      required: 'Job Duration Value is required',
    },
  },
  jobDurationUnit: {
    name: 'mileage',
    label: 'Job Duration Unit',
    error: {
      invalid: 'Job Duration Unit is invalid',
      required: 'Job Duration Unit is required',
    },
  },
  note: {
    name: 'note',
    label: 'Note/Remarks',
    error: {
      invalid: 'Note is invalid',
      required: 'Note is required',
    },
  },
};

const initialValues: IEstimateValues = {
  mileage: { count: '', unit: '' },
  plateNumber: '',
  depositAmount: '1',
  additionalDeposit: '0',
  paidAmount: '0',
  jobDuration: { count: '0', interval: '' },
  firstName: '',
  lastName: '',
  make: '',
  model: '',
  modelYear: '',
  phone: '',
  vin: '',
  address: '',
  addressType: '',
  parts: [
    {
      name: '',
      warranty: { warranty: '', interval: '' },
      quantity: { quantity: '0', unit: '' },
      price: '0',
      amount: '0',
    },
  ],
  labours: [{ title: '', cost: '0' }],
  tax: '0',
  taxPart: '0',
  note: ''
};

const schema = Yup.object().shape({
  firstName: Yup.string().nullable().label(fields.firstName.label),
  lastName: Yup.string().nullable().label(fields.lastName.label),
  address: Yup.string().nullable().label(fields.address.label),
  addressType: Yup.string().nullable().label(fields.addressType.label),
  phone: Yup.string().nullable().label(fields.phone.label),
  vin: Yup.string().nullable().label(fields.vin.label),
  make: Yup.string().nullable().label(fields.make.label),
  model: Yup.string().nullable().label(fields.model.label),
  modelYear: Yup.string().nullable().label(fields.modelYear.label),
  plateNumber: Yup.string().nullable().label(fields.plateNumber.label),
  tax: Yup.string().optional().nullable().label(fields.tax.label),
  taxPart: Yup.string().optional().nullable().label(fields.taxPart.label),
  depositAmount: Yup.string().nullable().label(fields.depositAmount.label),
  additionalDeposit: Yup.string().nullable().label(fields.additionalDeposit.label),
});

const estimateModel = {
  fields,
  initialValues,
  schema,
};

export default estimateModel;
