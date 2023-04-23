import * as Yup from 'yup';

export interface IItemValues {
    id?: number;
    name?: string;
    description?: string;
    unit?: string;
    buyingPrice?: number;
    sellingPrice?: number;
    quantity?: number;
    type?: string;
}

const fields = {
    name: {
      name: 'name',
      label: 'Name',
      error: {
        invalid: 'Name is invalid',
        required: 'Name is required',
      },
    },
    description: {
      name: 'description',
      label: 'Description',
      error: {
        invalid: 'Description is invalid',
        required: 'Description is required',
      },
    },
    type: {
        name: 'type',
        label: 'Type',
        error: {
          invalid: 'Type is invalid',
          required: 'Type is required',
        },
    },
    sellingPrice: {
        name: 'sellingPrice',
        label: 'Selling Rate/Price',
        error: {
          invalid: 'Selling Rate/Price is invalid',
          required: 'Selling Rate/Price is required',
        },
    },
    buyingPrice: {
        name: 'buyingPrice',
        label: 'Buying Rate/Price',
        error: {
          invalid: 'Buying Rate/Price is invalid',
          required: 'Buying Rate/Price is required',
        },
    },
    quantity: {
        name: 'quantity',
        label: 'Qty in Stock',
        error: {
          invalid: 'Quantity is invalid',
          required: 'Quantity is required',
        },
    },
    unit: {
        name: 'unit',
        label: 'Item Unit',
        error: {
          invalid: 'Item Unit is invalid',
          required: 'Item Unit is required',
        },
    },
}

const initialValues: IItemValues = {
    name: '',
    description: '',
    unit: '',
    buyingPrice: 0,
    sellingPrice: 0,
    quantity: 1,
    type: ''
}

const schema = Yup.object().shape({
    name: Yup.string().nullable().label(fields.name.label),
    description: Yup.string().nullable().label(fields.description.label),
    unit: Yup.string().nullable().label(fields.unit.label),
    buyingPrice: Yup.number().nullable().label(fields.buyingPrice.label),
    sellingPrice: Yup.number().nullable().label(fields.sellingPrice.label),
    quantity: Yup.number().nullable().label(fields.quantity.label),
    type: Yup.string().nullable().label(fields.type.label)
})

const itemModel = {
    fields,
    initialValues,
    schema,
  };

export default itemModel;