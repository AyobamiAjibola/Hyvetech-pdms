import * as Yup from 'yup';

export interface IReminderValues {
    id?: number;
    reminderType?: string;
    email?: string;
    vin?: string;
    lastServiceDate: any;
    serviceInterval: number;
    serviceIntervalUnit: string;
    note: string;
    recurring: string;
    phone: string;
    make: string;
    model: string;
    modelYear: string;
    firstName: string;
    lastName: string;
    nextServiceDate?: any
    reminderStatus: string | null;
    serviceStatus: string | null
    lastServiceMileage: number;
    lastServiceMileageUnit: string;
    nextServiceMileage: number;
    nextServiceMileageUnit: string;
}

export interface IReminderTypeValues {
    id?: number;
    name: string;
}

const fields = {
    reminderType: {
        name: 'reminderType',
        label: 'Reminder Type',
        error: {
            invalid: 'Reminder Type is invalid',
            required: 'Reminder Type is required',
        },
    },
    email: {
        name: 'email',
        label: 'Email',
        error: {
            invalid: 'Email is invalid',
            required: 'Email is required',
        },
    },
    phone: {
        name: 'phone',
        label: 'Phone',
        error: {
            invalid: 'Phone is invalid',
            required: 'Phone is required',
        },
    },
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
    vin: {
        name: 'vin',
        label: 'VIN',
        error: {
            invalid: 'VIN is invalid',
            required: 'VIN is required',
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
    make: {
        name: 'make',
        label: 'Make',
        error: {
            invalid: 'Make is invalid',
            required: 'Make is required',
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
    lastServiceDate: {
        name: 'lastServiceDate',
        label: 'Last Service Date',
        error: {
            invalid: 'Last Service Date is invalid',
            required: 'Last Service Date is required',
        },
    },
    nextServiceDate: {
        name: 'nextServiceDate',
        label: 'Next Service Date',
        error: {
            invalid: 'Next Service Date is invalid',
            required: 'Next Service Date is required',
        },
    },
    serviceInterval: {
        name: 'serviceInterval',
        label: 'Service Interval',
        error: {
            invalid: 'Service Interval is invalid',
            required: 'Service Interval is required',
        },
    },
    serviceIntervalUnit: {
        name: 'serviceIntervalUnit',
        label: 'Service Interval Unit',
        error: {
            invalid: 'Service Interval Unit is invalid',
            required: 'Service Interval Unit is required',
        },
    },
    note: {
        name: 'note',
        label: 'Note/Comment',
        error: {
            invalid: 'Note/Comment is invalid',
            required: 'Note/Comment is required',
        },
    },
    recurring: {
        name: 'recurring',
        label: 'Recurring',
        error: {
            invalid: 'Recurring is invalid',
            required: 'Recurring is required',
        },
    },
    reminderStatus: {
        name: 'reminderStatus',
        label: 'Reminder Status',
        error: {
            invalid: 'Reminder Status is invalid',
            required: 'Reminder Status is required',
        },
    },
    serviceStatus: {
        name: 'serviceStatus',
        label: 'Service Status',
        error: {
            invalid: 'Service Status is invalid',
            required: 'Service Status is required',
        },
    },
    lastServiceMileage: {
        name: 'lastServiceMileage',
        label: 'Last Service Mileage',
        error: {
            invalid: 'Last Service Mileage is invalid',
            required: 'Last Service Mileage is required',
        },
    },
    lastServiceMileageUnit: {
        name: 'lastServiceMileageUnit',
        label: 'Last Service Mileage Unit',
        error: {
            invalid: 'Last Service Mileage Unit is invalid',
            required: 'Last Service Mileage Unit is required',
        },
    },
    nextServiceMileage: {
        name: 'nextServiceMileage',
        label: 'Next Service Mileage',
        error: {
            invalid: 'Next Service Mileage is invalid',
            required: 'Next Service Mileage is required',
        },
    },
    nextServiceMileageUnit: {
        name: 'nextServiceMileageUnit',
        label: 'Next Service Mileage Unit',
        error: {
            invalid: 'Next Service Mileage Unit is invalid',
            required: 'Next Service Mileage Unit is required',
        },
    },
}

const fieldReminderType = {
    name: {
        name: 'name',
        label: 'Type',
        error: {
            invalid: 'Type is invalid',
            required: 'Type is required',
        },
    }
}

const initialValues: IReminderValues = {
    reminderType: '',
    email: '',
    vin: '',
    lastServiceDate: new Date(),
    serviceInterval: 0,
    serviceIntervalUnit: '',
    note: '',
    recurring: '',
    phone: '',
    model: '',
    modelYear: '',
    make: '',
    firstName: '',
    lastName: '',
    nextServiceDate: '',
    reminderStatus: '',
    serviceStatus: 'done',
    lastServiceMileage: 0,
    lastServiceMileageUnit: '',
    nextServiceMileage: 0,
    nextServiceMileageUnit: ''
}

const initialValuesReminderType: IReminderTypeValues = {
    name: ''
}

const schema = Yup.object().shape({
    reminderType: Yup.string().nullable().label(fields.reminderType.label),
    email: Yup.string().nullable().label(fields.email.label),
    vin: Yup.string().nullable().label(fields.vin.label),
    lastServiceDate: Yup.date().label(fields.lastServiceDate.label),
    serviceInterval: Yup.number().nullable().label(fields.serviceInterval.label),
    serviceIntervalUnit: Yup.string().nullable().label(fields.serviceIntervalUnit.label),
    note: Yup.string().nullable().label(fields.note.label),
    recurring: Yup.string().label(fields.recurring.label),
    lastServiceMileage: Yup.number().label(fields.lastServiceMileage.label),
    lastServiceMileageUnit: Yup.string().label(fields.lastServiceMileageUnit.label),
    nextServiceMileage: Yup.number().label(fields.nextServiceMileage.label),
    nextServiceMileageUnit: Yup.string().label(fields.nextServiceMileageUnit.label),
});

const schemaReminderType = Yup.object().shape({
    name: Yup.string().label(fieldReminderType.name.label)
});

const reminderModel = {
    fields,
    initialValues,
    schema,
    fieldReminderType,
    initialValuesReminderType,
    schemaReminderType
};

export default reminderModel;