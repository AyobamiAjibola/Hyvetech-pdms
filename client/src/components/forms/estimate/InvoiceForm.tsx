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
import { Checkbox, Divider, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Add, Remove, Save, Send } from '@mui/icons-material';
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

  const dispatch = useAppDispatch();

  const { values, handleChange, setFieldValue, resetForm } = useFormikContext<IEstimateValues>();

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
    setSave,
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
          <Grid item xs={3}>
            <TextInputField
              onChange={handleChange}
              disabled
              label={fields.firstName.label}
              value={values.firstName}
              name={fields.firstName.name}
            />
          </Grid>
          <Grid item xs={3}>
            <TextInputField
              onChange={handleChange}
              disabled
              label={fields.lastName.label}
              value={values.lastName}
              name={fields.lastName.name}
            />
          </Grid>
          <Grid item xs={2}>
            <TextInputField
              type="tel"
              onChange={handleChange}
              disabled
              label={fields.phone.label}
              value={values.phone}
              name={fields.phone.name}
            />
          </Grid>
          <Grid item container xs spacing={0.2}>
            <Grid item xs={3}>
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
            <Grid item xs={9}>
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
                          <Grid container item spacing={2} xs={13} key={index} columns={14} mb={2}>
                            {Object.keys(part).map(value => {
                              return (
                                <React.Fragment key={`${value}`}>
                                  {value === 'name' && (
                                    <Grid item xs={4}>
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        name={`parts.${index}.${value}`}
                                        label={value}
                                        value={part[value]}
                                        onChange={handleChange}
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
                                    <Grid item xs={2}>
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        name={`parts.${index}.${value}`}
                                        label={value}
                                        value={part[value]}
                                        onChange={e => handleChangeQtyAndPrice(e, index)}
                                        type="number"
                                        inputProps={{
                                          min: '0',
                                        }}
                                      />
                                    </Grid>
                                  )}

                                  {value === 'amount' && (
                                    <Grid item xs={2}>
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
                            <Grid item xs={1}>
                              <IconButton onClick={() => partsProps.remove(index)}>
                                <Remove />
                              </IconButton>
                            </Grid>
                          </Grid>
                        );
                      })}
                    <Grid item xs>
                      <IconButton
                        onClick={() =>
                          partsProps.push({
                            name: '',
                            warranty: { warranty: '', interval: '' },
                            quantity: { quantity: '0', unit: '' },
                            price: '0',
                            amount: '0',
                          })
                        }>
                        <Add />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12} container spacing={2} columns={13}>
                      <Grid item xs={6} />
                      <Grid item xs={4}>
                        <Typography style={{ marginBottom: 10 }}>
                          Part(s): ₦{formatNumberToIntl(Math.round(partTotal))}
                        </Typography>
                        {enableTaxPart && (
                          <TextField
                            name={fields.taxPart.name}
                            value={values.taxPart}
                            label={`${fields.taxPart.label} (VAT 7.5%)`}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                        )}
                      </Grid>

                      <Grid item style={{}}>
                        <div>
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
              {fields.labours.label}
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
                          <Grid container item spacing={2} xs={12} key={index} columns={13} mb={2}>
                            {Object.keys(labour).map(value => {
                              return (
                                <React.Fragment key={`${value}`}>
                                  {value === 'title' && (
                                    <Grid item xs={8}>
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        name={`labours.${index}.${value}`}
                                        label={value}
                                        value={labour[value]}
                                        onChange={handleChange}
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
                                        type="number"
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
                      <IconButton
                        onClick={() =>
                          laboursProps.push({
                            title: '',
                            cost: '0',
                          })
                        }>
                        <Add />
                      </IconButton>
                    </Grid>
                  </React.Fragment>
                );
              }}
            />
          </Grid>
          <Grid item xs={12} container spacing={2} columns={13}>
            <Grid item xs={6} />
            <Grid item xs={4}>
              <Typography style={{ marginBottom: 10 }}>
                {' '}
                Service Charge(s): ₦{formatNumberToIntl(Math.round(labourTotal))}
              </Typography>
              {enableTaxLabor && (
                <TextField
                  name={fields.tax.name}
                  value={values.tax}
                  label={`${fields.tax.label} (VAT 7.5%)`}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            </Grid>

            <Grid item style={{}}>
              <div>
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
                <Typography variant="h6">Sub-Total:</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">₦{formatNumberToIntl(subTotal)}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={0}>
            <Grid item xs={2}>
              <Typography variant="h6">Discount:</Typography>
            </Grid>
            <Grid container xs={10} spacing={2}>
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
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography variant="h6">VAT(7.5%):</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">₦{formatNumberToIntl(vatTotal)}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="h6">Grand Total: ₦{formatNumberToIntl(Math.round(grandTotal))}</Typography>
              </Grid>
              <Grid item justifyContent="space-around" alignItems="center">
                <Typography variant="h6">Amount Paid: ₦{formatNumberToIntl(+values.depositAmount)}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">Due Balance: ₦{formatNumberToIntl(Math.round(dueBalance))}</Typography>
              </Grid>
              <Grid item justifyContent="space-around" alignItems="center">
                <Typography variant="h6">Refundable: ₦{formatNumberToIntl(refundable)}</Typography>
              </Grid>
            </Grid>

            <Grid item md={6}>
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
          <Grid item xs={6}>
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
