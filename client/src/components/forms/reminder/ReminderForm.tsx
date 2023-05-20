import {
    Autocomplete,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    createFilterOptions
} from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { nextServiceDate, reload, reminderStatus } from "../../../utils/generic";
import { Edit, Save, Search } from "@mui/icons-material";
import { IDriversFilterData, IVINDecoderSchema } from '@app-interfaces';
import useAppSelector from "../../../hooks/useAppSelector";
import { getCustomerAction } from "../../../store/actions/customerActions";
import reminderModel, {IReminderValues} from "../models/reminderModel";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { getVehicleVINAction } from "../../../store/actions/vehicleActions";
import { clearGetVehicleVINStatus } from "../../../store/reducers/vehicleReducer";
import { getPartnerAction, getPartnerFilterDataAction } from "../../../store/actions/partnerActions";
import { useNavigate, useParams } from "react-router-dom";
import useAdmin from "../../../hooks/useAdmin";
import { CustomHookMessage } from "@app-types";
import AppAlert from "../../alerts/AppAlert";
import useReminder from "../../../hooks/useReminder";
import capitalize from "capitalize";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SelectField from "../fields/SelectField";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { FaPlus } from "react-icons/fa";
import AppModal from "../../modal/AppModal";
import { getSingleInvoice } from "../../../store/actions/invoiceActions";

const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: IDriversFilterData) => `${option.query}`,
});

const { fields } = reminderModel;

interface IProps {
    isSubmitting?: boolean;
    showCreate?: boolean;
    showEdit?: boolean;
    setSave: Dispatch<SetStateAction<boolean>>;
}

function ReminderForm(props: IProps) {
    const {
      values,
      handleChange,
      setFieldValue,
      setFieldTouched,
      resetForm
    } = useFormikContext<IReminderValues>();
    const [value, setValue] = useState<IDriversFilterData | null>(null);
    const [inputValue, setInputValue] = useState('');
     // @ts-ignore
    const [options, setOptions] = useState<IDriversFilterData[]>([]);
    const [showDrop, setShowDrop] = useState<boolean>(false);
    const [vinOptions, setVinOptions] = useState<any>([]);
    const [rawOption, setRawOption] = useState<any>([]);
    const [noOptionsText, setNoOptionsText] = useState<any>('Click Enter to Initialize Search');
    const [timer, setTimer] = useState<NodeJS.Timer>();
    const [error, setError] = useState<CustomHookMessage>();
    const [_nextServiceDate, _setNextServiceDate] = useState<string>('');
    const [_reminderStatus, _setReminderStatus] = useState<string>('');
    const [reminderType, setReminderType] = useState<boolean>(false);
    const [_reminderType, _setReminderType] = useState<string>('');
    const [successAlert, setSuccessAlert] = useState<CustomHookMessage>();
    const [removeSessionStorage, setRemoveSessionStorage] = useState<boolean>(false);

    const vehicleReducer = useAppSelector(state => state.vehicleReducer);
    const reminderReducer = useAppSelector(state => state.serviceReminderReducer);
    const invoiceReducer = useAppSelector(state => state.invoiceReducer);

    const [userInfo, setUserInfo] = useState({
      accountType: 'individual',
      firstName: '',
      email: '',
      lastName: '',
      companyName: '',
      phone: ''
    });

    const params = useParams();
    const admin = useAdmin();
    const reminder = useReminder();
    const type = reminder.reminderTypes;
    const navigate = useNavigate()

    const dispatch = useAppDispatch();

    const partnerReducer = useAppSelector(state => state.partnerReducer);
    const customerReducer = useAppSelector(state => state.customerReducer);

    const partnerId = useMemo(() => {
        return +(params.id as unknown as string) || admin.user?.partner?.id;
      }, [admin.user, params.id]);

    const saveReminder = useMemo(() => {
      return reminderReducer.createReminderStatus === 'loading';
    }, [reminderReducer.createReminderStatus]);

    const updateReminder = useMemo(() => {
      return reminderReducer.updateReminderStatus === 'loading';
    }, [reminderReducer.updateReminderStatus]);

    const _editTypeLoader = useMemo(() => {
      return reminderReducer.createReminderTypeStatus === 'loading';
    }, [reminderReducer.createReminderTypeStatus])

      useEffect(() => {
        if (partnerId) {
          dispatch(getPartnerFilterDataAction(+partnerId));
          dispatch(getPartnerAction(partnerId));
        }
      }, [dispatch, partnerId]);

    const handleGetDriverInfo = (id?: number) => {
        if (id) {
          dispatch(getCustomerAction(id));
        }
    };

    const filterData = (_text: string) => {
        const text = _text.toLowerCase();
        console.log(text, 'checks text')
        setNoOptionsText('Click Enter to Initialize Search');
        const _temp: any = [];
        rawOption.map((_item: any) => {
          // filter logic
          if ((_item?.raw?.email || '').toLowerCase() == text) {
            // check if it's an exact match to email
            _temp.push(_item);
          } else if ((_item?.raw?.phone || '').toLowerCase() == text) {
            // check if it's an exact match to phone
            _temp.push(_item);
          } else if ((_item?.raw?.companyName || '').toLowerCase() == text) {
            // check if it's an exact match to phone
            _temp.push(_item);
          } else if ((_item?.raw?.firstName || '').toLowerCase() == text) {
            // check if it's an exact match to phone
            _temp.push(_item);
          } else if ((_item?.raw?.lastName || '').toLowerCase() == text) {
            // check if it's an exact match to phone
            _temp.push(_item);
          }
        });

        setOptions(_temp);
    };

    const { showCreate, showEdit } = props;

    function handleSearch() {
        if ((inputValue || '').length == 0) {
          setShowDrop(false);
        } else {
          setNoOptionsText('No result Found');
          setShowDrop(true);
        }
    }

    useEffect(() => {
        // @ts-ignore
        if (customerReducer.getCustomerStatus === 'completed' || invoiceReducer.sendInvoiceStatus === 'completed') {
          const _customer: any = invoiceReducer.invoice?.estimate
                                  ? invoiceReducer.invoice?.estimate.customer
                                  : customerReducer.customer;

          const inv_vehicle = invoiceReducer.invoice?.estimate.vehicle

          if (_customer != undefined) {
            // upto-populate info
            setFieldValue(fields.phone.name, _customer.phone);
            setFieldValue(fields.email.name, _customer.email);
            setFieldValue(fields.firstName.name, _customer.firstName);
            setFieldValue(fields.lastName.name, _customer.lastName);

            const vinList = invoiceReducer.invoice
                              ? [inv_vehicle?.vin.toString()]
                              : _customer.vehicles.map((_data: any) => _data?.vin || '');
            setVinOptions(vinList);

            setUserInfo({
              accountType: (_customer?.companyName || '').length === 0 ? 'individual' : 'corporate',
              email: _customer.email,
              firstName: _customer.firstName,
              lastName: _customer.lastName,
              companyName: _customer.companyName,
              phone: _customer.phone
            });
          }

          if(invoiceReducer.invoice != undefined){
            setFieldValue('vin', inv_vehicle?.vin);
            setFieldValue('make', inv_vehicle?.make);
            setFieldValue('model', inv_vehicle?.model);
            setFieldValue('modelYear', inv_vehicle?.modelYear);
          }
        }
      }, [value, customerReducer.getCustomerStatus, invoiceReducer.sendInvoiceStatus]);

    useEffect(() => {
        if (!showCreate || !showEdit) {
            resetForm();
        }
    }, [resetForm, showCreate, showEdit]);

    useEffect(() => {
        if (partnerReducer.getPartnerFilterDataStatus === 'completed') {
          setRawOption(partnerReducer.partnerFilterData);
        }
    }, [partnerReducer.getPartnerFilterDataStatus]);

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

    const handleChangeVIN: any = useCallback(
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
      return () => {
        clearTimeout(timer);
        dispatch(clearGetVehicleVINStatus());
      };
    }, [timer, dispatch]);

    useEffect(() => {
      if(values.serviceIntervalUnit && values.serviceInterval){
        const next = nextServiceDate(values.lastServiceDate, values.serviceIntervalUnit, values.serviceInterval)

        _setNextServiceDate(next)
        setFieldValue('nextServiceDate', next)
      }
    }, [values.serviceIntervalUnit, values.serviceInterval])

    useEffect(() => {
      if(_nextServiceDate && values.lastServiceDate && values.serviceIntervalUnit){
        const status: any = reminderStatus(values.lastServiceDate, _nextServiceDate, values.serviceIntervalUnit, values.serviceInterval);
        _setReminderStatus(status);
        setFieldValue('reminderStatus', status);
      }
    }, [_nextServiceDate, values.lastServiceDate, values.serviceIntervalUnit, values.lastServiceDate])

    useEffect(() => {
      if(values.serviceStatus === 'done'){
        setFieldValue('lastServiceDate', new Date())
      }
    }, [values.serviceStatus]);

    useEffect(() => {
      setFieldValue('lastServiceDate', new Date(values.lastServiceDate));
      values.recurring === ''
        ? setFieldValue('recurring', 'yes')
        : setFieldValue('recurring', values.recurring)
    },[]);

    useEffect(() => {
      if(reminderReducer.createReminderTypeStatus === 'completed') {
        setSuccessAlert({message: reminderReducer.createReminderTypeSuccess});
        setReminderType(false)
      }
    }, [reminderReducer.createReminderTypeStatus]);

    useEffect(() => {
        if(reminderReducer.createReminderTypeStatus === 'failed') {
          setError({message: reminderReducer.createReminderTypeError})
        }
      }, [reminderReducer.createReminderTypeStatus]);

    useEffect(() => {
      if(reminderReducer.createReminderStatus === 'completed' ||
        reminderReducer.updateReminderStatus === 'completed') {
        reload()
      }
    }, [reminderReducer.createReminderStatus, reminderReducer.updateReminderStatus]);

    const data: any = {
      open_modal: undefined,
      id: undefined
    }

    useEffect(() => {
      if(removeSessionStorage){
        Object.keys(data).forEach(key => {
          sessionStorage.removeItem(key);
        });
      }
    }, [removeSessionStorage]);

    useEffect(() => {
      const _invoiceId = sessionStorage.getItem('id');
      const invoiceId = _invoiceId && parseInt(_invoiceId) || -1
      dispatch(getSingleInvoice(invoiceId))
    }, [dispatch, sessionStorage]);

    return (
      <React.Fragment>
        <Form autoComplete="off" autoCorrect="off">
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{xs: 4, sm: 8, md: 12}} sx={{p: 1}}>
            <Grid item xs={12}>
               <Typography gutterBottom component="h6" ml={4}>
                  New Service Reminder
               </Typography>
               <Divider orientation="horizontal" />
            </Grid>

            <Grid sx={{ width: '100%' }} justifyContent="center" alignItems="center" mt={8}>
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
                        setValue(newValue);
                        handleGetDriverInfo(newValue?.id);
                    }}
                    onInputChange={(_, newInputValue, reason) => {
                        setInputValue(newInputValue);
                        if (reason === 'clear') {
                        reload();
                        }
                    }}
                    noOptionsText={noOptionsText}
                    disabled={showEdit}
                    renderInput={props => (
                      <TextField
                        {...props}
                        label="Search customer by First name, last name, car plate number."
                        onChange={e => {
                          filterData(e.target.value);
                        }}
                        onClick={() => {
                          handleSearch()
                        }}
                        onKeyDown={(e: any) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleSearch()
                            } else {
                              setShowDrop(false);
                            }
                        }}
                        onBlur={() => {
                            setShowDrop(false);
                        }}
                        InputProps={{
                            ...props.InputProps,
                            endAdornment: (
                            <React.Fragment>
                                {partnerReducer.getPartnerFilterDataStatus === 'loading'
                                ? ( <CircularProgress color="inherit" size={20} /> )
                                : <Button
                                    sx={{
                                        zIndex: 1,
                                        cursor: 'pointer',
                                        backgroundColor: '#181818', color: 'white',
                                        '&:hover': {color: '#181818', backgroundColor: 'white', boxShadow: 2}
                                    }}
                                  >
                                    <Search fontSize='medium'/>
                                  </Button>
                                }
                                {props.InputProps.endAdornment}
                            </React.Fragment>
                            ),
                        }}
                        />
                    )}
                    options={showDrop ? options : []}
                    forcePopupIcon={false}
                  />
                </Grid>

                {/* <Grid /> */}
              </Grid>
            </Grid>

            <Typography>
              {'\n'}
              <br />
            </Typography>

            {userInfo.firstName.length != 0 && (
              <Grid style={{ padding: 20 }} xs={12} container mt={4}>
                <Grid item xs={11}>
                  <Grid item xs={12} container>
                    <Typography sx={{fontSize: 18}} gutterBottom>
                      {values?.firstName || 'First Name & '} {values?.lastName || 'Last Name'}
                    </Typography>{' '}
                    <br />
                  </Grid>

                  {(userInfo?.companyName || '').length != 0 && (
                    <Grid xs={12} container>
                      <Typography sx={{fontSize: 18}} gutterBottom>{userInfo?.companyName || 'First Name & '}</Typography> <br />
                    </Grid>
                  )}

                  <Grid item xs={12} container>
                    <Typography sx={{fontSize: 18}} gutterBottom>{values?.email || 'Email'}</Typography> <br />
                  </Grid>

                  <Grid item xs={12} container>
                    <Typography sx={{fontSize: 18}} gutterBottom>{values?.phone || 'Phone'}</Typography> <br />
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Typography>
              {'\n'}
              <br />
            </Typography>

            <Grid item xs={12} mt={4}
              sx={{
                gap: 2, display: 'flex',
                flexDirection: {md: 'row', xs: 'column'}
              }}
            >
              <Grid item md={3} xs={6}>
                <Autocomplete
                  options={vinOptions || []}
                  // @ts-ignore
                  onChange={(_, newValue) => {
                      handleChangeVIN({ target: { value: newValue } })
                  }}
                  value={values.vin}
                  fullWidth
                  // disabled={props.disabled}
                  renderInput={params =>
                    <TextField
                      {...params}
                      label={fields.vin.label}
                      name={fields.vin.name}
                      onChange={(e) => {
                          handleChangeVIN(e)
                      }}
                      InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                          <InputAdornment position="end" sx={{ position: 'absolute', left: '70%' }}>
                              {vehicleReducer.getVehicleVINStatus === 'loading' && <CircularProgress size={25} />}
                          </InputAdornment>
                          )
                      }}
                    />}
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  name={fields.make.name}
                  label={fields.make.label}
                  value={values.make}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  name={fields.model.name}
                  label={fields.model.label}
                  value={values.model}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  name={fields.modelYear.name}
                  label={fields.modelYear.label}
                  value={values.modelYear}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider orientation="horizontal" />
            </Grid>

            <Grid item xs={12}
              sx={{
                  display: 'flex', gap: 2,
                  flexDirection: 'row'
              }}
              mt={4}
            >
              <Grid item xs={values.recurring === 'no' ? 6 : 4}>
                <SelectField
                  data={[
                    { label: 'YES', value: 'yes' },
                    { label: 'NO', value: 'no' }
                  ]}
                  fullWidth
                  label={fields.recurring.label}
                  name={fields.recurring.name}
                  value={values.recurring}
                  type='string'
                  onChange={handleChange}
                />
              </Grid>
              {/* {values.recurring === 'yes' && <Grid item xs={8}/>} */}
              {values.recurring === 'no' && <Grid item xs={8} md={6}>
                <FormControl fullWidth>
                  <InputLabel>{fields.reminderType.label}</InputLabel>
                  <Select
                    value={values.reminderType}
                    onChange={(e) => setFieldValue('reminderType', e.target.value) }
                    label={fields.reminderType.label}
                  >
                    {reminderReducer.getReminderTypesStatus === 'loading' ? (
                      <MenuItem disabled>
                        <CircularProgress size={25} />
                      </MenuItem>
                    ) : (
                      type.map((option) => (
                        <MenuItem key={option.id} value={option.name}>
                          {capitalize.words(option.name)}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                <Typography
                  onClick={() => setReminderType(true)}
                  color={'skyblue'}
                  sx={{
                      display: 'flex', mb: {md: -3, xs: 1},
                      alignItems: 'center',
                      cursor: 'pointer', fontSize: 14, mt: 1
                  }}>
                  <FaPlus style={{ marginRight: 8 }} />
                  Reminder Type
                </Typography>
              </Grid>}
            </Grid>

            <Grid item xs={12}
              sx={{
                  gap: 2, display: 'flex',
                  flexDirection: {md: 'row', xs: 'column'}
              }}
              mt={4}
            >
              {values.recurring === 'yes' && <Grid item md={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{fields.reminderType.label}</InputLabel>
                  <Select
                    value={values.reminderType}
                    onChange={(e) => setFieldValue('reminderType', e.target.value) }
                    label={fields.reminderType.label}
                  >
                    {reminderReducer.getReminderTypesStatus === 'loading' ? (
                      <MenuItem disabled>
                        <CircularProgress size={25} />
                      </MenuItem>
                    ) : (
                      type.map((option) => (
                        <MenuItem key={option.id} value={option.name}>
                          {capitalize.words(option.name)}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                <Typography
                  onClick={() => setReminderType(true)}
                  color={'skyblue'}
                  sx={{
                      display: 'flex', mb: {md: -3, xs: 1},
                      alignItems: 'center',
                      cursor: 'pointer', fontSize: 14, mt: 1
                  }}>
                  <FaPlus style={{ marginRight: 8 }} />
                  Reminder Type
                </Typography>
              </Grid>}
              {values.recurring === 'no' && <Grid item md={6} xs={12}
                sx={{
                  display: 'flex', flexDirection: {md: 'row', xs: 'column'},
                  gap: 2
                }}
              >
                <Grid item md={6} xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disableFuture
                      minDate={new Date('2023/01/01')}
                      openTo="year"
                      views={['year', 'month', 'day']}
                      value={new Date(values.lastServiceDate)}
                      onChange={(date) => setFieldValue('lastServiceDate', date) }
                      renderInput={(params: any) =>
                        <TextField
                          {...params}
                          fullWidth
                          label={fields.lastServiceDate.label}
                          name={fields.lastServiceDate.name}
                          variant="outlined"
                          onChange={ handleChange }
                        />
                      }
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    name={fields.serviceInterval.name}
                    label={fields.serviceInterval.label}
                    value={values.serviceInterval}
                    onChange={ handleChange }
                  />
                </Grid>
              </Grid>}
              {values.recurring === 'no' && <Grid item md={6} xs={12}
                sx={{
                  display: 'flex', flexDirection: {md: 'row', xs: 'column'},
                  gap: 2
                }}
              >
                <Grid item md={6} xs={12}>
                  <SelectField
                    data={[
                    { label: 'Day(s)', value: 'day' },
                    { label: 'Week(s)', value: 'week' },
                    { label: 'Month(s)', value: 'month' }
                    ]}
                    fullWidth
                    name={fields.serviceIntervalUnit.name}
                    label={fields.serviceIntervalUnit.label}
                    value={values.serviceIntervalUnit}
                    type='string'
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name={fields.nextServiceDate.name}
                    label={fields.nextServiceDate.label}
                    value={_nextServiceDate && moment(_nextServiceDate).format('ddd - Do - MMM - YYYY')}
                  />
                </Grid>
              </Grid>}
              {values.recurring === 'yes' && <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  name={fields.serviceInterval.name}
                  label={fields.serviceInterval.label}
                  value={values.serviceInterval}
                  onChange={ handleChange }
                />
              </Grid>}
              {values.recurring === 'yes' && <Grid item md={4} xs={12}>
                <SelectField
                  data={[
                  { label: 'Day(s)', value: 'day' },
                  { label: 'Week(s)', value: 'week' },
                  { label: 'Month(s)', value: 'month' }
                  ]}
                  fullWidth
                  name={fields.serviceIntervalUnit.name}
                  label={fields.serviceIntervalUnit.label}
                  value={values.serviceIntervalUnit}
                  type='string'
                  onChange={handleChange}
                />
              </Grid>}
            </Grid>

            {values.recurring === 'yes' && <Grid item xs={12}
              sx={{
                  gap: 2, display: 'flex',
                  flexDirection: {md: 'row', xs: 'column'}
              }}
              mt={4}
            >
              <Grid item md={4} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableFuture
                    minDate={new Date('2023/01/01')}
                    openTo="year"
                    views={['year', 'month', 'day']}
                    value={new Date(values.lastServiceDate)}
                    onChange={(date) => setFieldValue('lastServiceDate', date) }
                    renderInput={(params: any) =>
                      <TextField
                        {...params}
                        fullWidth
                        label={fields.lastServiceDate.label}
                        name={fields.lastServiceDate.name}
                        variant="outlined"
                        onChange={ handleChange }
                      />
                    }
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  name={fields.nextServiceDate.name}
                  label={fields.nextServiceDate.label}
                  value={_nextServiceDate && moment(_nextServiceDate).format('ddd - Do - MMM - YYYY')}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  name={fields.reminderStatus.name}
                  label={fields.reminderStatus.label}
                  value={values.reminderStatus}
                />
              </Grid>
            </Grid>}

            <Grid item xs={12}
              sx={{
                  gap: 2, display: 'flex',
                  flexDirection: {md: 'row', xs: 'column'}
              }}
              mt={4}
            >
              <Grid item md={4} xs={12}
                sx={{
                  gap: 1, display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    name={fields.lastServiceMileage.name}
                    label={fields.lastServiceMileage.label}
                    value={values.lastServiceMileage}
                    onChange={ handleChange }
                  />
                </Grid>
                <Grid item xs={6}>
                  <SelectField
                    data={[
                      { label: 'miles', value: 'miles' },
                      { label: 'km', value: 'km' }
                    ]}
                    fullWidth
                    name={fields.lastServiceMileageUnit.name}
                    label={fields.lastServiceMileageUnit.label}
                    value={values.lastServiceMileageUnit}
                    type='string'
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid item md={4} xs={12}
                sx={{
                  gap: 1, display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    name={fields.nextServiceMileage.name}
                    label={fields.nextServiceMileage.label}
                    value={values.nextServiceMileage}
                    onChange={ handleChange }
                  />
                </Grid>
                <Grid item xs={6}>
                  <SelectField
                    data={[
                      { label: 'miles', value: 'miles' },
                      { label: 'km', value: 'km' }
                    ]}
                    fullWidth
                    name={fields.nextServiceMileageUnit.name}
                    label={fields.nextServiceMileageUnit.label}
                    value={values.nextServiceMileageUnit}
                    type='string'
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid item md={4} xs={12} />
            </Grid>

            <Grid item xs={12}
              sx={{
                  gap: 2, display: 'flex',
                  flexDirection: {md: 'row', xs: 'column'}
              }}
              mt={4}
            >
              <Grid item md={8} xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  name={fields.note.name}
                  label={fields.note.label}
                  value={values.note}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={4} xs={12} />
            </Grid>

            <Grid item xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Divider sx={{ mb: 3 }} flexItem orientation="horizontal" />
              {showCreate && <LoadingButton
                type="submit"
                size={document.documentElement.clientWidth <= 375 ? 'small' : 'large'}
                loading={saveReminder}
                variant="contained"
                color="success"
                endIcon={<Save />}
                onClick={() => {
                  props.setSave(true);
                  setRemoveSessionStorage(true);
                }}
              >
                {'Submit'}
              </LoadingButton>}
              {showEdit && <LoadingButton
                type="submit"
                size={document.documentElement.clientWidth <= 375 ? 'small' : 'large'}
                loading={updateReminder}
                variant="contained"
                color="success"
                endIcon={<Edit />}
                onClick={() => {
                  props.setSave(false);
                  setRemoveSessionStorage(true);
                }}
              >
                {'Save'}
              </LoadingButton>}
            </Grid>

          </Grid>
        </Form>

        {reminderType && (
          <AppModal
            fullWidth
            size="sm"
            show={reminderType}
            Content={
              <Formik
                initialValues={{}}
                onSubmit={(values, formikHelpers) => {
                  console.log(values, formikHelpers);
                }}
                enableReinitialize
                validateOnChange
              >
                <div style={{ marginTop: 20, marginBottom: 20 }}>
                  <Typography
                    style={{
                      marginBottom: 20,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                  <FaPlus style={{ marginRight: 8 }} />
                    Add Reminder Type
                  </Typography>
                  <Grid spacing={document.documentElement.clientWidth <= 375 ? 4 : 10}
                  container
                  >
                  <Grid item md={12} xs={12}>
                    <TextField
                      value={_reminderType}
                      onChange={e => _setReminderType(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`name`}
                      label="Type"
                    />
                  </Grid>
                  </Grid>
                  <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                  <LoadingButton
                    type="submit"
                    loading={_editTypeLoader}
                    onClick={() => {
                      //@ts-ignore
                      reminder.handleCreateReminderType({name: _reminderType, id: admin.user?.partner?.id})
                      navigate('/reminders')
                    }}
                    variant="contained"
                    color="secondary"
                    endIcon={<Save />}
                  >
                    {'Save'}
                  </LoadingButton>
                </div>
              </Formik>
            }
            onClose={() => setReminderType(false)}
          />
        )}
        <AppAlert
          alertType="success"
          show={undefined !== successAlert}
          message={successAlert?.message}
          onClose={() => setSuccessAlert(undefined)}
        />
        <AppAlert
            alertType="error"
            show={undefined !== error}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
      </React.Fragment>
    )
}

export default ReminderForm;