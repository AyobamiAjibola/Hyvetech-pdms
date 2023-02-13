import React, { ChangeEvent, Dispatch, memo, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldArray, Form, useFormikContext } from 'formik';
import {
  Autocomplete,
  Checkbox,
  CircularProgress, createFilterOptions, Divider, Grid, Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Add, Remove, Save, Send, SendAndArchive } from '@mui/icons-material';
import estimateModel, { IEstimateValues, IPart } from '../models/estimateModel';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import TextInputField from '../fields/TextInputField';
import { filterPhoneNumber, formatNumberToIntl, reload } from '../../../utils/generic';
import SelectField, { ISelectData } from '../fields/SelectField';
import WarrantyFields from './WarrantyFields';
import QuantityFields from './QuantityFields';
import VehicleInformationFields from './VehicleInformationFields';
import useAppDispatch from '../../../hooks/useAppDispatch';
import { getVehicleVINAction } from '../../../store/actions/vehicleActions';
import useAppSelector from '../../../hooks/useAppSelector';
import { IDriversFilterData, IVINDecoderSchema } from '@app-interfaces';
import { CustomHookMessage } from '@app-types';
import AppAlert from '../../alerts/AppAlert';
import { clearGetVehicleVINStatus } from '../../../store/reducers/vehicleReducer';
import { ESTIMATE_STATUS, STATES } from '../../../config/constants';
// import useEstimate from '../../../hooks/useEstimate';
import useAdmin from '../../../hooks/useAdmin';
import { getCustomerAction } from '../../../store/actions/customerActions';
import { useParams } from 'react-router-dom';
import { getOwnersFilterDataAction, getPartnerAction } from '../../../store/actions/partnerActions';

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
  isPopUp?: boolean;
  setSave: Dispatch<SetStateAction<boolean>>;
}

const { fields } = estimateModel;

export type PartArgs = IPart & {
  handleChange: (e: any) => void;
  index: number;
  values: IEstimateValues;
};

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  stringify: (option: IDriversFilterData) => `${option.query}`,
});

function EstimateForm(props: IProps) {

  const [vat, setVat] = useState<number>(0);
  const [vatPart, setVatPart] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [error, setError] = useState<CustomHookMessage>();

  const [value, setValue] = React.useState<IDriversFilterData | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  // @ts-ignore
  const [options, setOptions] = useState<IDriversFilterData[]>([]);
  const [showDrop, setShowDrop] = useState<boolean>(false);
  const [vinOptions, setvinOptions] = useState<any>([]);

  // @ts-ignore
  const [states, setStates] = useState<ISelectData[]>([]);

  const vehicleReducer = useAppSelector(state => state.vehicleReducer);
  const estimateReducer = useAppSelector(state => state.estimateReducer);
  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const customerReducer = useAppSelector(state => state.customerReducer);

  const dispatch = useAppDispatch();

  const { values, handleChange, setFieldValue, setFieldTouched, resetForm } = useFormikContext<IEstimateValues>();
  // @ts-ignore
  const [enableTaxLabor, setEnableTaxLabor] = useState<boolean>((values?.estimate?.tax !== undefined) ? (parseInt(values.estimate.tax) !== 0 ? true : false) : true)
  // @ts-ignore
  const [enableTaxPart, setEnableTaxPart] = useState<boolean>((values?.estimate?.taxPart !== undefined) ? (parseInt(values.estimate.taxPart) !== 0 ? false : false) : false)

  useEffect(() => {
    setTimeout(() => {

      // @ts-ignore
      if (values.estimate != undefined) {
        // @ts-ignore
        const _lab = (values?.estimate?.tax !== undefined) ? (parseInt(values.estimate.tax) !== 0 ? true : false) : true;
        setEnableTaxLabor(_lab)
        // @ts-ignore
        const _part = (values?.estimate?.taxPart !== undefined) ? (parseInt(values.estimate.taxPart) !== 0 ? false : false) : false;
        setEnableTaxPart(_part)

        console.log(_lab, _part, "_lab, _part")
      } else {
        console.log("did not reach", "_lab, _part")
      }
    }, 3000)
  }, [props?.isPopUp, props, customerReducer.getCustomerStatus])

  const { setGrandTotal, setPartTotal, setLabourTotal, showCreate, showEdit, grandTotal, labourTotal, partTotal } =
    props;

  // const estimate = useEstimate();
  const { isTechAdmin } = useAdmin();
  const params = useParams();
  const admin = useAdmin();

  const partnerId = useMemo(() => {
    if (admin.isTechAdmin && admin.user) {
      return admin.user.partner.id;
    }

    if (params.id) {
      return +(params.id as unknown as string);
    }
  }, [admin.isTechAdmin, admin.user, params.id]);

  useEffect(() => {
    if (partnerId) {
      dispatch(getOwnersFilterDataAction(+partnerId));
      dispatch(getPartnerAction(partnerId));
    }
  }, [dispatch, partnerId]);

  useEffect(() => {
    if (partnerReducer.getOwnersFilterDataStatus === 'completed') {
      setOptions(partnerReducer.ownersFilterData);
    }
  }, [partnerReducer.ownersFilterData, partnerReducer.getOwnersFilterDataStatus]);

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
    if (!enableTaxLabor) {
      setVat(0);
      return
    }
    const vat = 7.5 * 0.01;
    const tax = labourTotal * vat;

    setFieldValue('tax', formatNumberToIntl(tax));
    setVat(tax);
  }, [labourTotal, setFieldValue, enableTaxLabor]);

  useEffect(() => {

    let gT = 0;
    if (!enableTaxLabor) {
      gT = (vatPart + partTotal + labourTotal);
      console.log(vatPart + partTotal + labourTotal)

    }

    if (!enableTaxPart) {
      gT = (vat + partTotal + labourTotal);
      console.log(vat + partTotal + labourTotal)

    }

    if (enableTaxPart && enableTaxLabor) {
      gT = (vat + vatPart + partTotal + labourTotal);
      console.log(vat + vatPart + partTotal + labourTotal)
    } else if (!enableTaxPart && !enableTaxLabor) {
      gT = (partTotal + labourTotal);
      console.log(partTotal + labourTotal)
    }

    setGrandTotal(gT)
    console.log(gT)

  }, [vat, partTotal, vatPart, labourTotal, setGrandTotal, enableTaxLabor, enableTaxPart]);

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

  const sendStatus = useMemo(() => {
    return estimateReducer.sendDraftEstimateStatus === 'loading' || estimateReducer.createEstimateStatus === 'loading';
  }, [estimateReducer.createEstimateStatus, estimateReducer.sendDraftEstimateStatus]);

  const saveStatus = useMemo(() => {
    return estimateReducer.updateEstimateStatus === 'loading' || estimateReducer.saveEstimateStatus === 'loading';
  }, [estimateReducer.saveEstimateStatus, estimateReducer.updateEstimateStatus]);

  useEffect(() => {
    if (

      (estimateReducer.saveEstimateStatus == 'completed') ||
      (estimateReducer.updateEstimateStatus == 'completed') ||
      (estimateReducer.createEstimateStatus == 'completed') ||
      (estimateReducer.sendDraftEstimateStatus == 'completed')) {
      reload()
    }
  }, [estimateReducer.saveEstimateStatus, estimateReducer.updateEstimateStatus, estimateReducer.createEstimateStatus, estimateReducer.sendDraftEstimateStatus])

  useEffect(() => {
    return () => {
      clearTimeout(timer);
      dispatch(clearGetVehicleVINStatus());
    };
  }, [timer, dispatch]);

  const handleGetDriverInfo = (id?: number) => {
    if (id) {
      dispatch(getCustomerAction(id));
    }
  };

  useEffect(() => {
    // if (value?.id !== (null || undefined)) {
    // @ts-ignore
    // if (true) {
    // console.log(value)
    if (customerReducer.getCustomerStatus === "completed") {
      const _customer: any = customerReducer.customer;
      console.log(_customer, "_customer")

      // upto-populate info
      setFieldValue(fields.firstName.name, _customer.firstName);
      setFieldValue(fields.lastName.name, _customer.lastName);
      setFieldValue(fields.phone.name, _customer.phone);
      setFieldValue(fields.email.name, _customer.email);
      setFieldValue(fields.state.name, _customer.contacts[0]?.state || '');

      // handleChange({
      //   target: {
      //     name: fields.state.name,
      //     value: _customer.contacts[0]?.state || ''
      //   }
      // })
      // alert(_customer.contacts[0]?.state || '..')

      const vinList = (_customer.vehicles).map((_data: any) => (_data?.vin || ""));
      setvinOptions(vinList)
      // alert(_customer.lastName)
    }
    // }
  }, [value, customerReducer.getCustomerStatus])

  // listen for tax changes and adjust
  useEffect(() => {
    // check for labor
    if (!enableTaxLabor) {
      setFieldValue(fields.tax.name, 0)
      // setVat(0)
      console.log('making labor 0', "mainLog1")
    }

    // check for part
    if (!enableTaxPart) {
      setFieldValue(fields.taxPart.name, 0)
      // setVatPart(0)
      console.log('making part 0', "mainLog1")
    }
  }, [enableTaxLabor, enableTaxPart])

  useEffect(() => {
    const newStates = STATES.map(state => ({
      label: state.name,
      value: state.name,
    }));

    setStates(newStates);
  }, []);

  // console.log(values, "fieldsfields")

  return (
    <React.Fragment>
      <Form autoComplete="off" autoCorrect="off">
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ p: 1 }}>

          {
            ((isTechAdmin) && (props?.isPopUp || false) && (
              <Grid style={{ width: '100%' }}>
                <div style={{ marginTop: 10, paddingTop: 15, paddingBottom: 15, width: '100%' }}></div>

                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      filterOptions={filterOptions}
                      inputValue={inputValue}
                      value={value}
                      openOnFocus={false}
                      loading={partnerReducer.getDriversFilterDataStatus === 'loading'}
                      getOptionLabel={option => option.fullName}
                      isOptionEqualToValue={(option, value) => option.fullName === value.fullName}
                      onChange={(_: any, newValue: IDriversFilterData | null) => {
                        // console.log(newValue);
                        setValue(newValue);
                        handleGetDriverInfo(newValue?.id);
                      }}
                      onInputChange={(_, newInputValue, reason) => {
                        setInputValue(newInputValue);
                        if (reason === 'clear') {
                          // setCustomer(undefined);
                          reload();
                        }
                      }}
                      noOptionsText="Click Enter to Initialize Search"
                      renderInput={props => (
                        <TextField
                          {...props}
                          label="Search customer by First name, last name, car plate number."
                          onKeyDown={e => {
                            if(e.key === 'Enter'){
                              setShowDrop(true)
                            }
                          }}
                          onBlur={()=>{
                            setShowDrop(false)
                          }}
                          InputProps={{
                            ...props.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {partnerReducer.getDriversFilterDataStatus === 'loading' ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {props.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                      options={showDrop ? options : []}
                      // options={[]}
                    />
                  </Grid>
                </Grid>

                <Divider orientation="horizontal" />
              </Grid>
            ))
          }

          <Grid item xs={12}>
            <Typography gutterBottom variant="subtitle1" component="h1">
              Customer Information
            </Typography>
            <Divider orientation="horizontal" />
          </Grid>

          <Grid item xs={4}>
            <TextInputField
              onChange={handleChange}
              label={fields.email.label}
              // @ts-ignore
              value={values.email}
              name={fields.email.name}
            />
          </Grid>
          <Grid item xs={3}>
            {
              (customerReducer.getCustomerStatus === "completed") ?
                <TextInputField
                  onChange={handleChange}
                  label={fields.state.label}
                  // @ts-ignore
                  value={values.state}
                  name={fields.state.name}
                />
                :
                <SelectField
                  onChange={e => {
                    console.log(e)
                  }}
                  value={values.state}
                  name={fields.state.name}
                  label={fields.state.label}
                  data={states}
                  fullWidth
                />

            }


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
            {/* @ts-ignore */}
            <TextInputField
              type="tel"
              onChange={(e) => {
                console.log(e, "logger")
                const _val = filterPhoneNumber(e.target.value);

                if (_val.error) {
                  setError({ message: _val?.message || "" })
                }

                handleChange({
                  target: {
                    name: e.target.name,
                    value: _val.phone,
                  }
                })

              }}
              label={fields.phone.label}
              value={values.phone}
              name={fields.phone.name}
              placeholder='Phone e.g 080...'
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
          <VehicleInformationFields vinOptions={vinOptions} values={values} handleChange={handleChange} handleChangeVIN={_handleChangeVIN} />
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
                        {(enableTaxPart && (<TextField
                          name={fields.taxPart.name}
                          value={values.taxPart}
                          label={`${fields.taxPart.label} (VAT 7.5%)`}
                          variant="outlined"
                          fullWidth
                          sx={{ mb: 2 }}
                        />))}
                        Sub Total: ₦{formatNumberToIntl(Math.round(partTotal))}
                      </Grid>

                      {/* <Grid item style={{}}>
                        <div>
                          <span>Apply Tax</span>
                          <Checkbox checked={enableTaxPart} onClick={() => setEnableTaxPart(!enableTaxPart)} />
                        </div>
                      </Grid> */}

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
              {(enableTaxLabor && (<TextField
                name={fields.tax.name}
                value={values.tax}
                label={`${fields.tax.label} (VAT 7.5%)`}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              />))}
              <Typography> Sub Total: ₦{formatNumberToIntl(Math.round(labourTotal))}</Typography>
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
          <Grid item xs={4} alignSelf="center">
            <Typography variant="h6">Grand Total: ₦{formatNumberToIntl(Math.round(grandTotal))}</Typography>
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
          {
            ((parseInt(values.depositAmount) > 0) && (parseInt(values.depositAmount) <= grandTotal) &&
              (<Grid item xs={12}>
                <Divider sx={{ mb: 3 }} flexItem orientation="horizontal" />
                <LoadingButton
                  type="submit"
                  loading={saveStatus}
                  disabled={
                    saveStatus || values.status === ESTIMATE_STATUS.sent || values.status === ESTIMATE_STATUS.invoiced
                  }
                  variant="contained"
                  color="secondary"
                  endIcon={<Save />}
                  onClick={() => {
                    props.setSave(true)
                  }}>
                  {'Save'}
                </LoadingButton>
                <LoadingButton
                  sx={{ ml: 2 }}
                  type="submit"
                  loading={sendStatus}
                  disabled={values.status === ESTIMATE_STATUS.invoiced}
                  onClick={() => {
                    props.setSave(false)
                  }}
                  variant="contained"
                  color="success"
                  endIcon={values.status === ESTIMATE_STATUS.sent ? <SendAndArchive /> : <Send />}>
                  {values.status === ESTIMATE_STATUS.sent ? 'Save & Send' : 'Send'}
                </LoadingButton>
              </Grid>))
          }
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

export default memo(EstimateForm);
