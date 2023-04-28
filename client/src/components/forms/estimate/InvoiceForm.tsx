import React, {
  ChangeEvent,
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { FieldArray, Form, useFormikContext } from 'formik';
import { Autocomplete, Button, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, InputAdornment, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Remove, Save, Send } from '@mui/icons-material';
import estimateModel, { IEstimateValues } from '../models/estimateModel';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import TextInputField from '../fields/TextInputField';
import { formatNumberToIntl, reload } from '../../../utils/generic';
import SelectField from '../fields/SelectField';
import WarrantyFields from './WarrantyFields';
import QuantityFields from './QuantityFields';
import VehicleInformationFields from './VehicleInformationFields';
import useAppDispatch from '../../../hooks/useAppDispatch';
import { getVehicleVINAction } from '../../../store/actions/vehicleActions';
import useAppSelector from '../../../hooks/useAppSelector';
import { CustomHookMessage } from '@app-types';
import AppAlert from '../../alerts/AppAlert';
import { clearGetVehicleVINStatus } from '../../../store/reducers/vehicleReducer';
import { IInvoice } from '@app-models';
import { FaPlus } from 'react-icons/fa';
import capitalize from 'capitalize';
import useItemStock from '../../../hooks/useItemStock';

interface IProps {
  isSubmitting?: boolean;
  setLabourTotal: (total: number) => void;
  setPartTotal: (total: number) => void;
  setGrandTotal: (total: number) => void;
  setDueBalance: (balance: number) => void;
  refundable: number;
  setRefundable: (refund: number) => void;
  labourTotal: number;
  partTotal: number;
  grandTotal: number;
  dueBalance: number;
  showCreate?: boolean;
  showEdit?: boolean;
  showRefund?: boolean;
  setShowRefund?: (refund: boolean) => void;
  setSave?: Dispatch<SetStateAction<boolean>>;
  onInitiateRefund: () => void;
  invoice?: IInvoice;
  setDiscount?: Dispatch<SetStateAction<number>>;
  setDiscountType?: Dispatch<SetStateAction<string>>;
}

const { fields } = estimateModel;

function InvoiceForm(props: IProps) {
  const [vat, setVat] = useState<number>(0);
  const [vatPart, setVatPart] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [error, setError] = useState<CustomHookMessage>();

  const [enableTaxLabor, setEnableTaxLabor] = useState<boolean>(false);
  const [enableTaxPart, setEnableTaxPart] = useState<boolean>(false);

  const [subTotal, setSubTotal] = useState(0);
  const [vatTotal, setVatTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('exact');

  const invoiceReducer = useAppSelector(state => state.invoiceReducer);
  const itemReducer = useAppSelector(state => state.itemStockReducer);
  const { items } = useItemStock();
  const partsOnly = items.filter((partsItem: any) => {return partsItem.type === 'part'});
  const serviceOnly = items.filter((serviceItem: any) => {return serviceItem.type === 'service'});


  const dispatch = useAppDispatch();

  const { values, handleChange, setFieldValue, resetForm } = useFormikContext<IEstimateValues>();
  // console.log(values, "checking values for edit form")
  const {
    setGrandTotal,
    setPartTotal,
    setLabourTotal,
    showCreate,
    showEdit,
    grandTotal,
    labourTotal,
    partTotal,
    dueBalance,
    setDueBalance,
    setRefundable,
    refundable,
    setSave
  } = props;

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log(Object.keys(values), '_lab, _part');
  //     // @ts-ignore
  //     if (values.invoice != undefined) {
  //       // @ts-ignore
  //       const _lab = values?.invoice?.tax !== undefined ? (parseInt(values.invoice.tax) !== 0 ? true : false) : true;
  //       setEnableTaxLabor(_lab);
  //       // @ts-ignore
  //       const _part =
  //         values?.invoice?.taxPart !== undefined ? (parseInt(values.invoice.taxPart) !== 0 ? false : false) : false;
  //       setEnableTaxPart(_part);

  //       console.log(_lab, _part, '_lab, _part');
  //     } else {
  //       console.log('did not reach', '_lab, _part');
  //     }
  //   }, 3000);
  // }, [props, values.email]);

  useEffect(() => {
    if (values?.invoice?.tax !== undefined && values?.invoice?.tax !== null && parseInt(values?.invoice?.tax) !== 0) {
      setEnableTaxLabor(true);
    } else {
      setEnableTaxLabor(false);
    }
  }, [values.invoice?.tax]);

  // useEffect(() => {
  //   setDiscount(values.invoice?.discount || 0);
  //   setDiscountType(values.invoice?.discountType || 'exact');
  // }, [values.invoice?.discount, values.invoice?.discountType]);

  useEffect(() => {
    if (
      values?.invoice?.taxPart !== undefined &&
      values?.invoice?.taxPart !== null &&
      parseInt(values?.invoice?.taxPart) !== 0
    ) {
      setEnableTaxPart(true);
    } else {
      setEnableTaxPart(false);
    }
  }, [values.invoice?.taxPart]);

  useEffect(() => {
    setSubTotal(partTotal + labourTotal);
  }, [partTotal, labourTotal]);

  useEffect(() => {
    setGrandTotal(subTotal - calculateDiscount(subTotal));
  }, [subTotal]);

  useEffect(() => {
    const totalVat = vat + vatPart;

    setVatTotal(totalVat);
  }, [vat, vatPart]);

  useEffect(() => {
    setGrandTotal(subTotal + vatTotal - calculateDiscount(subTotal));
  }, [vatTotal]);

  // useEffect(() => {
  //   let gT = 0;
  //   const totalSub = partTotal + labourTotal;
  //   setSubTotal(totalSub);
  //   setGrandTotal(totalSub);

  //   if (!enableTaxLabor) {
  //     gT = vatPart + subTotal - discount;
  //     setVatTotal(vatPart);
  //   }

  //   if (!enableTaxPart) {
  //     gT = vat + totalSub - discount;
  //     setVatTotal(vat);
  //   }

  //   if (enableTaxPart && enableTaxLabor) {
  //     gT = vat + vatPart + totalSub - discount;
  //     setVatTotal(vatPart + vat);
  //   } else if (!enableTaxPart && !enableTaxLabor) {
  //     gT = totalSub - discount;

  //     setVatTotal(0);
  //   }

  //   setTimeout(() => {
  //     setGrandTotal(gT);
  //   }, 1500);
  // }, [vat, partTotal, vatPart, labourTotal, setGrandTotal, enableTaxLabor, enableTaxPart]);

  useEffect(() => {
    if (!showCreate || !showEdit) {
      resetForm();
      setRefundable(0);
    }
  }, [resetForm, setRefundable, showCreate, showEdit, values.status]);

  useEffect(() => {
    let total = 0;

    for (let i = 0; i < values.parts.length; i++) {
      if (values.parts[i].amount) {
        total += parseInt(values.parts[i].amount);
      }
    }
    setPartTotal(total);
  }, [setPartTotal, values.parts]);

  useEffect(() => {
    let total = 0;

    for (let i = 0; i < values.labours.length; i++) {
      if (values.labours[i].cost) {
        total += parseInt(values.labours[i].cost);
      }
    }
    setLabourTotal(total);
  }, [setLabourTotal, values.labours]);

  useEffect(() => {
    const vat = 7.5 * 0.01;
    const tax = labourTotal * vat;

    setFieldValue('tax', formatNumberToIntl(tax));
    setVat(tax);
  }, [labourTotal, setFieldValue]);

  useEffect(() => {
    if (!enableTaxPart) {
      setVatPart(0);
      return;
    }
    const vat = 7.5 * 0.01;
    const tax = partTotal * vat;

    setFieldValue('taxPart', formatNumberToIntl(tax));

    setVatPart(tax);
  }, [partTotal, setFieldValue, enableTaxPart]);

  useEffect(() => {
    // const _grandTotal = vat + vatPart + partTotal + labourTotal;

    const _depositAmount = parseInt(values.depositAmount);
    const _dueBalance = grandTotal - _depositAmount;

    console.log(grandTotal, '_grandTotal_grandTotal');

    setDueBalance(_dueBalance);

    if (_depositAmount > grandTotal) {
      setRefundable(_depositAmount - grandTotal);
      setDueBalance(0);
    } else {
      setRefundable(0);
    }
  }, [grandTotal]);

  const _handleChangeVIN = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const vin = e.target.value;

      setTimer(
        setTimeout(() => {
          dispatch(getVehicleVINAction(vin));
        }, 2000),
      );

      setFieldValue('vin', vin);
    },
    [dispatch, setFieldValue],
  );

  useEffect(() => {
    setGrandTotal(subTotal + vatTotal - calculateDiscount(subTotal));
  }, [discount, discountType]);

  const calculateDiscount = useCallback(
    (total: number) => {
      if (discountType === 'exact') {
        return discount;
      } else {
        return Math.ceil(total * (discount / 100));
      }
    },
    [discount, discountType],
  );

  useEffect(() => {
    setDiscount(values?.invoice?.discount || 0);
    setDiscountType(values?.invoice?.discountType || 'exact');
  }, []);

  const handleChangeQtyAndPrice = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number) => {
      const quantityValue = `parts.${index}.quantity.quantity`;
      const quantityUnit = `parts.${index}.quantity.unit`;
      const priceName = `parts.${index}.price`;
      const amountName = `parts.${index}.amount`;

      const isQuantityValue = quantityValue === e.target.name;
      const isPrice = priceName === e.target.name;
      const isQuantityUnit = quantityUnit === e.target.name;

      if (isQuantityValue) {
        const part = values.parts[index];

        const amount = +part.price * +e.target.value;

        setFieldValue(quantityValue, e.target.value);
        setFieldValue(amountName, `${amount}`);
      }

      if (isPrice) {
        const part = values.parts[index];
        const amount = +part.quantity.quantity * +e.target.value;

        setFieldValue(priceName, e.target.value);
        setFieldValue(amountName, `${amount}`);
      }

      if (isQuantityUnit) setFieldValue(quantityUnit, e.target.value);
    },
    [setFieldValue, values.parts],
  );


  useEffect(() => {
    return () => {
      clearTimeout(timer);
      dispatch(clearGetVehicleVINStatus());
    };
  }, [timer, dispatch]);

  const onSave = useCallback(() => {
    if (setSave) setSave(true);
  }, [setSave]);

  const onSend = useCallback(() => {
    if (setSave) setSave(false);
  }, [setSave]);

  // listen for tax changes and adjust
  useEffect(() => {
    // check for labor
    if (!enableTaxLabor) {
      // setFieldValue(fields.tax.name, 0);
      setVat(0);
      values.tax = '0';
    }

    // check for part
    if (!enableTaxPart) {
      //setFieldValue(fields.taxPart.name, 0);
      setVatPart(0);

      values.taxPart = '0';
    }
  }, [enableTaxLabor, enableTaxPart]);

  const calculateTaxLabour = useCallback(() => {
    if (!enableTaxLabor) {
      setVat(0);
      return;
    }
    const vat = 7.5 * 0.01;
    const tax = labourTotal * vat;

    setFieldValue('tax', formatNumberToIntl(tax));
    setVat(tax);
  }, [enableTaxLabor, labourTotal, setFieldValue]);

  useLayoutEffect(() => {
    calculateTaxLabour();
  }, [calculateTaxLabour]);

  // listen for reload
  useEffect(() => {
    if (invoiceReducer.saveInvoiceStatus == 'completed' || invoiceReducer.sendInvoiceStatus == 'completed') {
      reload();
    }
  }, [invoiceReducer.saveInvoiceStatus, invoiceReducer.sendInvoiceSuccess]);

    // validate available stock
    useEffect(() => {
      const valueItems = values.parts;

      valueItems.forEach(({ quantity: { quantity }, partNumber }) => {
        if(partNumber) {
          //@ts-ignore
          const foundItem = items.find((item) => item.slug === partNumber);

          if (foundItem?.quantity && +foundItem.quantity < +quantity) {
            setError({ message: 'Low on stock, please add stock' });
          }
        }
      });
    }, [values.parts])

  const _handleChangePart = useCallback(
    (e: any, index: number) => {
      const partName = e.target.value;

      const tempItem = itemReducer.items;
      const newDetail = tempItem.find((item: any) => item.name === partName?.name)
      setFieldValue(`parts.${index}.quantity.unit`, newDetail?.unit || '');
      setFieldValue(`parts.${index}.price`, newDetail?.sellingPrice || 0);
      setFieldValue(`parts.${index}.quantity.quantity`, 1);
      setFieldValue(`parts.${index}.amount`, newDetail?.sellingPrice || 0);
      //@ts-ignore
      setFieldValue(`parts.${index}.partNumber`, newDetail?.slug || '');
      //@ts-ignore
      setFieldValue(`parts.${index}.name`, `${capitalize.words(partName?.name)} [${newDetail?.slug}]` || '');

    },
    [ setFieldValue, itemReducer.items],
  );

  const _handleChangeService = useCallback(
    (e: any, index: number) => {
      const partName = e.target.value;

      setFieldValue(`labours.${index}.title`, partName?.name || '');
      // setFieldTouched(`labours.${index}.title`, false);
      const tempItem = itemReducer.items;
      const newDetail = tempItem.find((item: any) => item.name === partName?.name)
      setFieldValue(`labours.${index}.cost`, newDetail?.sellingPrice || 0);

      // setFieldTouched(`labours.${index}.cost`, false);
    },
    [ setFieldValue, itemReducer.items],
  );

  const getOptionLabel = (option: any) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option && option.name) {
      return `${capitalize.words(option.name)} | ${option.slug} (Stock: ${option.quantity ? option.quantity : 0})`
    }
    return '';
  };

  const renderOption = (props: any, option: any) => {
    const label = getOptionLabel(option);
    const labelParts = label.split('(');
    return (
      <li {...props} style={{ display: 'block' }}>
        <span style={{ fontSize: "16px", textAlign: 'left', fontWeight: 400, display: 'block' }}>
          {labelParts[0]}
        </span>
        {labelParts[1] && (
          <>
            <span style={{ fontSize: "12px", textAlign: 'right', marginBottom: '1px', display: 'block' }}>
              {'('}
              {labelParts[1]}
            </span>
            <Divider orientation="horizontal" />
          </>
        )}
      </li>
    );
  };

  const getOptionLabelLabour = (option: any) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option && option.title) {
      return option.title;
    }
    return '';
  };

  const isOptionEqualToValue = (option: any, value: any) => {
    return option === value || option.name === value
  }

  const filterOptionsParts = (partsOnly: any, state: any) => {
    if (state.inputValue === "") {
      return [];
    } else {
      return partsOnly.filter((option: any) =>
        option.name.toLowerCase().includes(state.inputValue.toLowerCase())
      );
    }
  };

  const filterOptionsLabour = (labourOnly: any, state: any) => {
    if (state.inputValue === "") {
      return [];
    } else {
      return labourOnly.filter((option: any) =>
        option.title.toLowerCase().includes(state.inputValue.toLowerCase())
      );
    }
  };

  return (
    <React.Fragment>
      <Form autoComplete="off" autoCorrect="off">
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ p: 1 }}>
          <Grid item xs={12}>
            <Typography gutterBottom variant="subtitle1" component="h1">
              Customer Information
            </Typography>
            <Divider orientation="horizontal" />
          </Grid>
          <Grid item sm={3} xs={12}>
            <TextInputField
              onChange={handleChange}
              disabled
              fullWidth
              label={fields.firstName.label}
              value={values.firstName}
              name={fields.firstName.name}
            />
          </Grid>
          <Grid item sm={3} xs={12}>
            <TextInputField
              onChange={handleChange}
              disabled
              label={fields.lastName.label}
              value={values.lastName}
              name={fields.lastName.name}
            />
          </Grid>
          <Grid item sm={2} xs={12}>
            <TextInputField
              type="tel"
              onChange={handleChange}
              disabled
              label={fields.phone.label}
              value={values.phone}
              name={fields.phone.name}
            />
          </Grid>
          <Grid item container sm={4} xs={12} spacing={0.2}>
            <Grid item sm={3} xs={4}>
              <SelectField
                data={[
                  { label: 'Home', value: 'Home' },
                  { label: 'Office', value: 'Office' },
                ]}
                onChange={handleChange}
                disabled
                value={values.addressType}
                name={fields.addressType.name}
                label={fields.addressType.label}
                fullWidth
              />
            </Grid>
            <Grid item sm={9} xs={8}>
              <TextInputField
                onChange={handleChange}
                disabled
                value={values.address}
                name={fields.address.name}
                label={fields.address.label}
              />
            </Grid>
          </Grid>
          <VehicleInformationFields
            disabled
            values={values}
            handleChange={handleChange}
            handleChangeVIN={_handleChangeVIN}
          />
          <Grid item xs={12}>
            <Typography gutterBottom variant="subtitle1" component="h1">
              {fields.parts.label}
            </Typography>
            <Divider orientation="horizontal" />
          </Grid>
          <Grid item xs={12} container>
            <FieldArray
              name={fields.parts.name}
              render={partsProps => {
                return (
                  <React.Fragment>
                    {values.parts.length > 0 &&
                      values.parts.map((part, index) => {
                        return (
                          <Grid container item spacing={2} xs={14} key={index} columns={14} mb={2}>
                            {Object.keys(part).map(value => {
                              return (
                                <React.Fragment key={`${value}`}>
                                  {value === 'name' && (
                                    <Grid item sm={4.5} xs={14}>
                                      {/* <TextField
                                        fullWidth
                                        variant="outlined"
                                        name={`parts.${index}.${value}`}
                                        label={value}
                                        value={part[value]}
                                        onChange={handleChange}
                                      /> */}
                                      <Autocomplete
                                        filterOptions={filterOptionsParts}
                                        options={partsOnly}
                                        openOnFocus
                                        getOptionLabel={getOptionLabel}
                                        renderOption={renderOption}
                                        noOptionsText=""
                                        isOptionEqualToValue={isOptionEqualToValue}
                                        // @ts-ignore
                                        onChange={(_, newValue) => {
                                          _handleChangePart({ target: { value: newValue } }, index)
                                        }}
                                        //@ts-ignore
                                        value={part[value]}
                                        renderInput={params =>
                                          <TextField
                                            {...params}
                                            label={value}
                                            onChange={handleChange}
                                            name={`parts.${index}.${value}`}
                                            InputProps={{
                                              ...params.InputProps,
                                              endAdornment: (
                                                <InputAdornment position="end" sx={{ position: 'absolute', left: '85%' }}>
                                                  {itemReducer.getItemsStatus === 'loading' && <CircularProgress size={25} />}
                                                </InputAdornment>
                                              ),
                                            }}
                                          />}
                                      />
                                    </Grid>
                                  )}
                                  {value === 'warranty' && (
                                    <WarrantyFields
                                      {...part}
                                      handleChange={handleChange}
                                      index={index}
                                      values={values}
                                    />
                                  )}
                                  {value === 'quantity' && (
                                    <QuantityFields
                                      {...part}
                                      handleChange={e => handleChangeQtyAndPrice(e, index)}
                                      index={index}
                                      values={values}
                                    />
                                  )}
                                  {value === 'price' && (
                                    <Grid item sm={2} xs={14}>
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        name={`parts.${index}.${value}`}
                                        label={value}
                                        value={part[value]}
                                        onChange={e => handleChangeQtyAndPrice(e, index)}
                                        type="string"
                                        inputProps={{
                                          min: '0',
                                        }}
                                      />
                                    </Grid>
                                  )}

                                  {value === 'amount' && (
                                    <Grid item sm={2} xs={10}>
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        name={`parts.${index}.${value}`}
                                        label={value}
                                        value={part[value]}
                                        onChange={handleChange}
                                        type="number"
                                        disabled
                                      />
                                    </Grid>
                                  )}
                                </React.Fragment>
                              );
                            })}
                            <Grid item xs>
                              <IconButton onClick={() => partsProps.remove(index)}>
                                <Remove />
                              </IconButton>
                            </Grid>
                          </Grid>
                        );
                      })}
                    <Grid item xs>
                      {document.documentElement.clientWidth <= 375
                        ? <Button
                            onClick={() =>
                              partsProps.push({
                                name: '',
                                warranty: { warranty: '', interval: '' },
                                quantity: { quantity: '0', unit: '' },
                                price: '0',
                                amount: '0',
                              })
                            }>
                            {'Add Part'}
                          </Button>
                        : <IconButton
                            onClick={() =>
                              partsProps.push({
                                name: '',
                                warranty: { warranty: '', interval: '' },
                                quantity: { quantity: '0', unit: '' },
                                price: '0',
                                amount: '0',
                              })}
                          >
                            <Typography
                              color={'skyblue'}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                              }}
                            >
                            <FaPlus style={{ marginRight: 8 }} />
                            Add Part
                          </Typography>
                        </IconButton>
                      }
                    </Grid>
                    <Grid item xs={12} container spacing={2} columns={13}
                      sx={{
                        display: 'flex', flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      <Grid sm={2} xs={0} />
                      <Grid item sm={5} xs={6} mb={2} mt={2}>
                        <Typography
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'left'
                          }}
                        >
                          Part(s): ₦{formatNumberToIntl(+partTotal?.toFixed(2))}
                        </Typography>
                        {enableTaxPart && (
                          <TextField
                            name={fields.taxPart.name}
                            value={values.taxPart}
                            label={`${fields.taxPart.label} (VAT 7.5%)`}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2, mt: 2 }}
                          />
                        )}
                      </Grid>

                      <Grid item sm={4} xs={6} mb={2} mt={2}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'right'
                          }}
                        >
                          <span>Apply Tax</span>
                          <Checkbox checked={enableTaxPart} onClick={() => setEnableTaxPart(!enableTaxPart)} />
                        </div>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                );
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom variant="subtitle1" component="h1">
              {/* {fields.labours.label} */}
              Service items
            </Typography>
            <Divider orientation="horizontal" />
          </Grid>
          <Grid item xs={12} container>
            <FieldArray
              name={fields.labours.name}
              render={laboursProps => {
                return (
                  <React.Fragment>
                    {values.labours.length > 0 &&
                      values.labours.map((labour, index) => {
                        return (
                          <Grid container item spacing={2} xs={14} key={index} columns={13} mb={2}>
                            {Object.keys(labour).map(value => {
                              return (
                                <React.Fragment key={`${value}`}>
                                  {value === 'title' && (
                                    <Grid item xs={8}>
                                      {/* <TextField
                                        fullWidth
                                        variant="outlined"
                                        name={`labours.${index}.${value}`}
                                        label={value}
                                        value={labour[value]}
                                        onChange={handleChange}
                                      /> */}
                                      <Autocomplete
                                        options={serviceOnly}
                                        filterOptions={filterOptionsLabour}
                                        openOnFocus
                                        noOptionsText=""
                                        getOptionLabel={getOptionLabelLabour}
                                        isOptionEqualToValue={isOptionEqualToValue}
                                        // @ts-ignore
                                        onChange={(_, newValue) => {
                                          _handleChangeService({ target: { value: newValue } }, index)
                                        }}
                                        //@ts-ignore
                                        value={labour[value]}
                                        renderInput={params =>
                                          <TextField
                                            {...params}
                                            label={value}
                                            onChange={handleChange}
                                            name={`labours.${index}.${value}`}
                                            InputProps={{
                                              ...params.InputProps,
                                              endAdornment: (
                                                <InputAdornment position="end" sx={{ position: 'absolute', left: '90%' }}>
                                                  {itemReducer.getItemsStatus === 'loading' && <CircularProgress size={25} />}
                                                </InputAdornment>
                                              ),
                                            }}
                                          />}
                                      />
                                    </Grid>
                                  )}
                                  {value === 'cost' && (
                                    <Grid item xs={4}>
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        name={`labours.${index}.${value}`}
                                        label={value}
                                        value={labour[value]}
                                        onChange={handleChange}
                                        type="string"
                                        inputProps={{
                                          min: '0',
                                        }}
                                      />
                                    </Grid>
                                  )}
                                </React.Fragment>
                              );
                            })}
                            <Grid item xs={1}>
                              <IconButton onClick={() => laboursProps.remove(index)}>
                                <Remove />
                              </IconButton>
                            </Grid>
                          </Grid>
                        );
                      })}
                    <Grid item xs>
                      {document.documentElement.clientWidth <= 375
                        ? <Button
                            onClick={() =>
                              laboursProps.push({
                                title: '',
                                cost: '0',
                              })
                            }
                          >
                            {'Add Part'}
                          </Button>
                        : <IconButton
                            onClick={() =>
                              laboursProps.push({
                                title: '',
                                cost: '0',
                              })
                            }
                          >
                            <Typography
                              color={'skyblue'}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                              }}
                            >
                            <FaPlus style={{ marginRight: 8 }} />
                              Add Service
                          </Typography>
                        </IconButton>
                      }
                    </Grid>
                  </React.Fragment>
                );
              }}
            />
          </Grid>
          <Grid item xs={12} container spacing={2} columns={13}>
            <Grid item sm={4} xs={0} />
            <Grid item sm={4} xs={6} mb={2} mt={2}>
              <Typography
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left'
                }}
              >
                {' '}
                Service Charge(s): ₦{formatNumberToIntl(+labourTotal?.toFixed(2))}
              </Typography>
              {enableTaxLabor && (
                <TextField
                  name={fields.tax.name}
                  value={values.tax}
                  label={`${fields.tax.label} (VAT 7.5%)`}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2, mt: 2}}
                />
              )}
            </Grid>

            <Grid item sm={4} xs={6} mb={2} mt={2}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center', justifyContent: 'right'
                }}
              >
                <span>Apply Tax</span>
                <Checkbox checked={enableTaxLabor} onClick={() => setEnableTaxLabor(!enableTaxLabor)} />
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom variant="subtitle1" component="h1">
              Job Information
            </Typography>
            <Divider flexItem orientation="horizontal" />
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>Sub-Total:</Typography>
              </Grid>
              <Grid item>
                <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>₦{formatNumberToIntl(subTotal)}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <br />
          <Grid item mt={2} container spacing={0}>
            <Grid item xs={2} mr={5}>
              <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>Discount:</Typography>
            </Grid>
            <Grid container xs={8} spacing={2}>
              <Grid item>
                <TextInputField
                  onChange={e => setDiscount(parseInt(e.target.value))}
                  value={discount}
                  name="discount.value"
                  label={fields.discount.label}
                  type="number"
                  inputProps={
                    discountType === 'exact'
                      ? {
                          min: '0',
                        }
                      : {
                          min: '0',
                          max: '99',
                        }
                  }
                />
              </Grid>
              <Grid item>
                <RadioGroup row value={discountType} onChange={e => setDiscountType(e.target.value)}>
                  <FormControlLabel value="exact" control={<Radio />} label="₦" />
                  <FormControlLabel value="percent" control={<Radio />} label="%" />
                </RadioGroup>
              </Grid>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid style={{ marginTop: 20 }} container spacing={2}>
            <Grid item md={6}>
              <Grid item>
                <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>VAT(7.5%): ₦{formatNumberToIntl(+vatTotal?.toFixed(2))}</Typography>
              </Grid>
              <Grid item>
                <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>Grand Total: ₦{formatNumberToIntl(+grandTotal?.toFixed(2))}</Typography>
              </Grid>
              <Grid item justifyContent="space-around" alignItems="center">
                <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>Amount Paid: ₦{formatNumberToIntl(+values.depositAmount)}</Typography>
              </Grid>
              <Grid item>
                <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>Due Balance: ₦{formatNumberToIntl(+dueBalance?.toFixed(2))}</Typography>
              </Grid>
              <Grid item justifyContent="space-around" alignItems="center">
                <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>Refundable: ₦{formatNumberToIntl(+refundable?.toFixed(2))}</Typography>
              </Grid>
            </Grid>

            <Grid item md={6} mt={2}>
              <Grid item xs={12}>
                <TextField
                  value={values.note}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  name={fields.note.name}
                  label={fields.note.label}
                />
              </Grid>
              <br />
              <Grid container spacing={0.5}>
                <Grid item xs={6}>
                  <TextInputField
                    onChange={handleChange}
                    value={values.jobDuration.count}
                    name="jobDuration.count"
                    label={fields.jobDuration.label}
                    type="number"
                    inputProps={{
                      min: '1',
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <SelectField
                    data={[
                      { label: 'day', value: 'day' },
                      { label: 'week', value: 'week' },
                      { label: 'month', value: 'month' },
                      { label: 'year', value: 'year' },
                    ]}
                    onChange={handleChange}
                    value={values.jobDuration.interval}
                    name="jobDuration.interval"
                    label="Interval"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mb: 3 }} flexItem orientation="horizontal" />
          </Grid>
          <Grid item xs={6}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Stack direction="row" spacing={2}>
              <LoadingButton
                // disabled={values.status === ESTIMATE_STATUS.invoiced}
                onClick={() => {
                  props.setDiscountType && props.setDiscountType(discountType);
                  props.setDiscount && props.setDiscount(discount);
                  onSave();
                }}
                sx={{ ml: 2 }}
                type="submit"
                variant="contained"
                color="info"
                loading={invoiceReducer.saveInvoiceStatus === 'loading'}
                endIcon={<Save />}>
                Save
              </LoadingButton>
              <LoadingButton
                // disabled={values.status === ESTIMATE_STATUS.invoiced}
                onClick={() => {
                  props.setDiscountType && props.setDiscountType(discountType);
                  props.setDiscount && props.setDiscount(discount);
                  onSend();
                }}
                sx={{ ml: 2 }}
                type="submit"
                variant="contained"
                color="success"
                loading={invoiceReducer.sendInvoiceStatus === 'loading'}
                endIcon={<Send />}>
                Send
              </LoadingButton>
            </Stack>
          </Grid>
          <Grid item xs />
        </Grid>
      </Form>
      <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
    </React.Fragment>
  );
}

export default memo(InvoiceForm);
