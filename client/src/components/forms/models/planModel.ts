import * as Yup from 'yup';

export interface IPlanModel {
  programme: string;
  serviceMode: string;
  label: string;
  minVehicles: string;
  maxVehicles: string;
  validity: string;
  mobile: string;
  driveIn: string;

  [p: string]: any;
}

const schema = Yup.object().shape({
  programme: Yup.string().required().label('Programme'),
  serviceMode: Yup.string().required().label('Service Mode'),
  label: Yup.string().required().label('Plans Name'),
  minVehicles: Yup.string().required().label('Minimum Vehicle'),
  maxVehicles: Yup.string().required().label('Maximum  Vehicle'),
  validity: Yup.string().required().label('Plans Validity'),
  mobile: Yup.string().required().label('No of Mobile Service'),
  driveIn: Yup.string().required().label('No of Drive-in Service'),
});

const initialValues: IPlanModel = {
  programme: 'Inspection',
  serviceMode: 'Mobile',
  label: '',
  minVehicles: '0',
  maxVehicles: '0',
  validity: '',
  mobile: '0',
  driveIn: '0',
};

const fields = {
  programme: {
    name: 'programme',
    label: 'Choose Programme*',
    error: {
      invalid: `Programme is invalid`,
      required: 'Programme is required',
    },
  },
  serviceMode: {
    name: 'serviceMode',
    label: 'Choose Service Mode*',
    error: {
      invalid: `Service Mode is invalid`,
      required: 'Service Mode is required',
    },
  },
  label: {
    name: 'label',
    label: 'Plans Name*',
    error: {
      invalid: 'Invalid name.',
      required: 'Partner name is required',
    },
  },
  minVehicles: {
    name: 'minVehicles',
    label: 'Min Vehicle(s)*',
    error: {
      invalid: `Min Vehicle(s) is invalid`,
      required: 'Min Vehicle(s) is required',
    },
  },
  maxVehicles: {
    name: 'maxVehicles',
    label: 'Max Vehicle(s)*',
    error: {
      invalid: `Max Vehicle(s) is invalid`,
      required: 'Max Vehicle(s) is required',
    },
  },
  validity: {
    name: 'validity',
    label: 'Interval*',
    error: {
      invalid: `Payment Interval is invalid`,
      required: 'Payment Interval is required',
    },
  },
  mobile: {
    name: 'mobile',
    label: 'No of Mobile Service*',
    error: {
      invalid: 'Mobile Service is invalid.',
      required: 'Mobile Service is required.',
    },
  },
  driveIn: {
    name: 'driveIn',
    label: 'No of Drive-in Service*',
    error: {
      invalid: 'Drive-in Service is invalid',
      required: 'Drive-in Service is required.',
    },
  },
};

const planModel = {
  fields,
  initialValues,
  schema,
};

export default planModel;
