import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { FieldArray, Form, useFormikContext } from 'formik';
import { Divider, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Add, Remove, Save } from '@mui/icons-material';
import estimateModel, { IEstimateValues, IPart } from '../models/estimateModel';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import TextInputField from '../fields/TextInputField';
import { formatNumberToIntl } from '../../../utils/generic';
import SelectField from '../fields/SelectField';
import WarrantyFields from './WarrantyFields';
import QuantityFields from './QuantityFields';
import VehicleInformationFields from './VehicleInformationFields';
import useAppDispatch from '../../../hooks/useAppDispatch';
import { getVehicleVINAction } from '../../../store/actions/vehicleActions';
import useAppSelector from '../../../hooks/useAppSelector';
import { IVINDecoderSchema } from '@app-interfaces';
import { CustomHookMessage } from '@app-types';
import AppAlert from '../../alerts/AppAlert';
import { clearGetVehicleVINStatus } from '../../../store/reducers/vehicleReducer';

interface IProps {
  isSubmitting?: boolean;
  setLabourTotal: (total: number) => void;
  setPartTotal: (total: number) => void;
  setGrandTotal: (total: number) => void;
  labourTotal: number;
  partTotal: number;
  grandTotal: number;
  showCreate?: boolean;
  showEdit?: boolean;
}

const { fields } = estimateModel;

export type PartArgs = IPart & {
  handleChange: (e: any) => void;
  index: number;
  values: IEstimateValues;
};

function EstimateForm(props: IProps) {
  const [vat, setVat] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [error, setError] = useState<CustomHookMessage>();

  const vehicleReducer = useAppSelector(state => state.vehicleReducer);
  const dispatch = useAppDispatch();

  const { values, handleChange, setFieldValue, setFieldTouched, resetForm } = useFormikContext<IEstimateValues>();

  const {
    setGrandTotal,
    setPartTotal,
    setLabourTotal,
    showCreate,
    showEdit,
    isSubmitting,
    grandTotal,
    labourTotal,
    partTotal,
  } = props;

  useEffect(() => {
    if (!showCreate || !showEdit) {
      resetForm();
    }
  }, [resetForm, showCreate, showEdit]);

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
    setGrandTotal(vat + partTotal + labourTotal);
  }, [vat, partTotal, labourTotal, setGrandTotal]);

  useEffect(() => {
    if (vehicleReducer.getVehicleVINStatus === 'completed') {
      const tempVehicleDetails = vehicleReducer.vehicleVINDetails;

      tempVehicleDetails.forEach((detail: IVINDecoderSchema) => {
        const newDetail: IVINDecoderSchema = { ...detail };

        if (detail.label === 'engineCylinders') newDetail.value = `${detail.value} cylinders`;

        setFieldValue(newDetail.label, newDetail.value);
        setFieldTouched(newDetail.label, false);
      });
    }
  }, [vehicleReducer.getVehicleVINStatus, vehicleReducer.vehicleVINDetails, setFieldValue, setFieldTouched]);

  useEffect(() => {
    if (vehicleReducer.getVehicleVINStatus === 'failed') {
      if (vehicleReducer.getVehicleVINError) setError({ message: vehicleReducer.getVehicleVINError });
    }
  }, [vehicleReducer.getVehicleVINError, vehicleReducer.getVehicleVINStatus]);

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

  const handleChangeQtyAndPrice = useCallback(
    (e: ChangeEvent<any>, index: number) => {
      const quantityName = `parts.${index}.quantity.quantity`;
      const priceName = `parts.${index}.price`;
      const amountName = `parts.${index}.amount`;

      const isQuantity = quantityName === e.target.name;
      const isPrice = priceName === e.target.name;

      if (isQuantity) {
        const part = values.parts[index];

        const amount = +part.price * +e.target.value;

        setFieldValue(quantityName, e.target.value);
        setFieldValue(amountName, `${amount}`);
      }

      if (isPrice) {
        const part = values.parts[index];
        const amount = +part.quantity.quantity * +e.target.value;

        setFieldValue(priceName, e.target.value);
        setFieldValue(amountName, `${amount}`);
      }
    },
    [setFieldValue, values.parts],
  );

  useEffect(() => {
    return () => {
      clearTimeout(timer);
      dispatch(clearGetVehicleVINStatus());
    };
  }, [timer, dispatch]);

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
              label={fields.firstName.label}
              value={values.firstName}
              name={fields.firstName.name}
            />
          </Grid>
          <Grid item xs={3}>
            <TextInputField
              onChange={handleChange}
              label={fields.lastName.label}
              value={values.lastName}
              name={fields.lastName.name}
            />
          </Grid>
          <Grid item xs={2}>
            <TextInputField
              type="tel"
              onChange={handleChange}
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
                value={values.addressType}
                name={fields.addressType.name}
                label={fields.addressType.label}
                fullWidth
              />
            </Grid>
            <Grid item xs={9}>
              <TextInputField
                onChange={handleChange}
                value={values.address}
                name={fields.address.name}
                label={fields.address.label}
              />
            </Grid>
          </Grid>
          <VehicleInformationFields values={values} handleChange={handleChange} handleChangeVIN={_handleChangeVIN} />
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
                      <Grid item xs={8} />
                      <Grid item xs={4}>
                        Sub Total: ₦{formatNumberToIntl(partTotal)}
                      </Grid>
                      <Grid item />
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
            <Grid item xs={8} />
            <Grid item xs={4}>
              <TextField
                name={fields.tax.name}
                value={values.tax}
                label={`${fields.tax.label} (VAT 7.5%)`}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              />
              <Typography> Sub Total: ₦{formatNumberToIntl(labourTotal)}</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom variant="subtitle1" component="h1">
              Job Information
            </Typography>
            <Divider flexItem orientation="horizontal" />
          </Grid>
          <Grid item xs={4} alignSelf="center">
            <Typography variant="h6">Grand Total: ₦{formatNumberToIntl(grandTotal)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <TextInputField
              onChange={handleChange}
              value={values.depositAmount}
              name={fields.depositAmount.name}
              label={fields.depositAmount.label}
              type="number"
              inputProps={{
                min: '0',
              }}
            />
          </Grid>
          <Grid item xs={4} container spacing={0.5}>
            <Grid item xs={8}>
              <TextInputField
                onChange={handleChange}
                value={values.jobDuration.count}
                name="jobDuration.count"
                label={fields.jobDuration.label}
                type="number"
                inputProps={{
                  min: '0',
                }}
              />
            </Grid>
            <Grid item xs>
              <SelectField
                data={[
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
          <Grid item xs={12}>
            <Divider sx={{ mb: 1 }} flexItem orientation="horizontal" />
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              variant="contained"
              color="secondary"
              endIcon={<Save />}
              size="large">
              Save
            </LoadingButton>
          </Grid>
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

export default EstimateForm;
