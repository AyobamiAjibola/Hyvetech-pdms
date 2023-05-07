import React, {
  ChangeEvent,
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { FieldArray, Form, useFormikContext } from 'formik';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  createFilterOptions,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  // InputAdornment,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Remove, Save, Search, Send, SendAndArchive, ToggleOff, ToggleOn } from '@mui/icons-material';
import estimateModel, { IEstimateValues, IPart } from '../models/estimateModel';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import TextInputField from '../fields/TextInputField';
// @ts-ignore
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
import { getOwnersFilterDataAction, getPartnerAction, getPartnerFilterDataAction } from '../../../store/actions/partnerActions';
import { FaPlus } from 'react-icons/fa';
import CreateCustomerModal from '../../modal/CreateCustomer';
import useItemStock from '../../../hooks/useItemStock';
import capitalize from 'capitalize';

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
  setDiscount?: Dispatch<SetStateAction<number>>;
  setDiscountType?: Dispatch<SetStateAction<string>>;
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
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [vatTotal, setVatTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('exact');
  // @ts-ignore
  // const [inputStack, setInputStack] = useState<any>("")
  // @ts-ignore
  const [rawOption, setRawOption] = useState<any>([]);

  const [userInfo, setUserInfo] = useState({
    accountType: 'individual',
    firstName: '',
    email: '',
    lastName: '',
    companyName: '',
    phone: '',
    creditRating: 'N/A',
    state: 'Abuja (FCT)',
    district: '',
    address: '',
  });

  const [activeId, setactiveId] = useState<number>(0);
  const [vatPart, setVatPart] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [error, setError] = useState<CustomHookMessage>();
  const [noOptionsText, setNoOptionsText] = useState<any>('Click Enter to Initialize Search');

  const [value, setValue] = React.useState<IDriversFilterData | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  // @ts-ignore
  const [options, setOptions] = useState<IDriversFilterData[]>([]);
  const [showDrop, setShowDrop] = useState<boolean>(false);
  const [vinOptions, setvinOptions] = useState<any>([]);
  const [fetch, setFetch] = useState<boolean>(false);

  // const [showDropParts, setShowDropParts] = useState<boolean>(false);
  // const [inputValuePart, setInputValuePart] = React.useState('');

  // @ts-ignore
  const [states, setStates] = useState<ISelectData[]>([]);
  const vehicleReducer = useAppSelector(state => state.vehicleReducer);
  const estimateReducer = useAppSelector(state => state.estimateReducer);
  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const customerReducer = useAppSelector(state => state.customerReducer);
  const itemReducer = useAppSelector(state => state.itemStockReducer);

  const dispatch = useAppDispatch();

  const { values, handleChange, setFieldValue, setFieldTouched, resetForm } = useFormikContext<IEstimateValues>();

  // @ts-ignore
  const [enableTaxLabor, setEnableTaxLabor] = useState<boolean>(false);

  useEffect(() => {
    if (values?.estimate?.tax !== undefined && parseInt(values?.estimate?.tax) !== 0) {
      setEnableTaxLabor(true);
    } else {
      setEnableTaxLabor(false);
    }
  }, [values.estimate?.tax]);

  // @ts-ignore
  const [enableTaxPart, setEnableTaxPart] = useState<boolean>(false);

  useEffect(() => {
    if (values?.estimate?.taxPart !== undefined && parseInt(values?.estimate?.taxPart) !== 0) {
      setEnableTaxPart(true);
    } else {
      setEnableTaxPart(false);
    }
  }, [values.estimate]);

  const { setGrandTotal, setPartTotal, setLabourTotal, showCreate, showEdit, grandTotal, labourTotal, partTotal } =
    props;

  const params = useParams();
  const admin = useAdmin();
  const { items } = useItemStock();
  const partsOnly = items.filter(partsItem => {return partsItem.type === 'part' && partsItem.active === true});
  const serviceOnly = items.filter(serviceItem => {return serviceItem.type === 'service' && serviceItem.active === true});

  const partnerId = useMemo(() => {
    return +(params.id as unknown as string) || admin.user?.partner?.id;
  }, [admin.user, params.id]);

  useEffect(() => {
    if (partnerId) {
      dispatch(getOwnersFilterDataAction(+partnerId));
      dispatch(getPartnerFilterDataAction(+partnerId));
      dispatch(getPartnerAction(partnerId));
    }
  }, [dispatch, partnerId]);

  const [subTotal, setSubTotal] = useState(0);

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
    console.log('vat total> ', subTotal + vatTotal - calculateDiscount(subTotal));
    setGrandTotal(subTotal + vatTotal - calculateDiscount(subTotal));
  }, [vatTotal]);

  useEffect(() => {
    if (partnerReducer.getOwnersFilterDataStatus === 'completed' || partnerReducer.getPartnerFilterDataStatus === 'completed') {
      // setOptions(partnerReducer.ownersFilterData);
      setRawOption(!fetch ? partnerReducer.partnerFilterData : partnerReducer.ownersFilterData);
    }
  }, [partnerReducer.ownersFilterData, partnerReducer.getOwnersFilterDataStatus, fetch]);

  useEffect(() => {
    if (!showCreate || !showEdit) {
      resetForm();
    }
  }, [resetForm, showCreate, showEdit]);

  useEffect(() => {
    let total = 0;

    for (let i = 0; i < values.parts.length; i++) {
      if (values.parts[i].amount) {
        // total += parseInt(values.parts[i].amount);
        total += +values.parts[i].amount
      }
    }
    setPartTotal(total);
  }, [setPartTotal, values.parts]);

  useEffect(() => {
    let total = 0;

    for (let i = 0; i < values.labours.length; i++) {
      if (values.labours[i].cost) {
        // total += parseInt(values.labours[i].cost);
        total += +values.labours[i].cost;
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

  // useEffect(() => {
  //   let gT = 0;
  //   console.log('discount> ', discount);
  //   const totalSub = partTotal + labourTotal;
  //   setSubTotal(totalSub);
  //   setGrandTotal(totalSub);

  //   if (!enableTaxLabor) {
  //     gT = vatPart + subTotal;
  //     setVatTotal(vatPart);
  //   }

  //   if (!enableTaxPart) {
  //     gT = vat + totalSub;
  //     setVatTotal(vat);
  //   }

  //   if (enableTaxPart && enableTaxLabor) {
  //     gT = vat + vatPart + totalSub;
  //     setVatTotal(vatPart + vat);
  //   } else if (!enableTaxPart && !enableTaxLabor) {
  //     gT = totalSub;

  //     setVatTotal(0);
  //   }

  //  setGrandTotal(gT - discount);
  // }, [vat, partTotal, vatPart, labourTotal, setGrandTotal, enableTaxLabor, enableTaxPart]);

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
      setFieldValue(`parts.${index}.name`, `${partName?.name && capitalize.words(partName?.name)} [${newDetail?.slug}]` || '');
      setFieldTouched(`parts.${index}.name`, false);

      setFieldTouched(`parts.${index}.quantity.quantity`, false);
    },
    [ setFieldValue, setFieldTouched, itemReducer.items],
  );

  const _handleChangeService = useCallback(
    (e: any, index: number) => {
      const partName = e.target.value;

      setFieldValue(`labours.${index}.title`, `${partName?.name && capitalize.words(partName?.name)}` || '');
      const tempItem = itemReducer.items;
      const newDetail = tempItem.find((item: any) => item.name === partName?.name)
      setFieldValue(`labours.${index}.cost`, newDetail?.sellingPrice || 0);

      setFieldTouched(`labours.${index}.cost`, false);
    },
    [ setFieldValue, setFieldTouched, itemReducer.items],
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
      estimateReducer.saveEstimateStatus == 'completed' ||
      estimateReducer.updateEstimateStatus == 'completed' ||
      estimateReducer.createEstimateStatus == 'completed' ||
      estimateReducer.sendDraftEstimateStatus == 'completed'
    ) {
      reload();
    }
  }, [
    estimateReducer.saveEstimateStatus,
    estimateReducer.updateEstimateStatus,
    estimateReducer.createEstimateStatus,
    estimateReducer.sendDraftEstimateStatus,
  ]);

  useEffect(() => {
    return () => {
      clearTimeout(timer);
      dispatch(clearGetVehicleVINStatus());
    };
  }, [timer, dispatch]);

  const handleGetDriverInfo = (id?: number) => {
    if (id) {
      dispatch(getCustomerAction(id));
      // dispatch(getNewCustomerAction(id))
    }
  };

  useEffect(() => {
    // if (value?.id !== (null || undefined)) {
    // @ts-ignore
    // if (true) {
    // console.log(value)
    if (customerReducer.getCustomerStatus === 'completed') {
      const _customer: any = customerReducer.customer;

      if (_customer != undefined) {
        // upto-populate info
        setFieldValue(fields.firstName.name, _customer.firstName);
        setFieldValue(fields.lastName.name, _customer.lastName);
        setFieldValue(fields.phone.name, _customer.phone);
        setFieldValue(fields.email.name, _customer.email);
        setFieldValue(fields.state.name, _customer.contacts[0]?.state || 'Abuja (FCT)');
        setFieldValue(fields.address.name, _customer.contacts[0]?.address || ' .');
        setFieldValue(fields.addressType.name, 'Home');
        setactiveId(_customer.id);
        const vinList = _customer.vehicles.map((_data: any) => _data?.vin || '');
        setvinOptions(vinList);

        setUserInfo({
          accountType: (_customer?.companyName || '').length === 0 ? 'individual' : 'corporate',
          email: _customer.email,
          firstName: _customer.firstName,
          lastName: _customer.lastName,
          companyName: _customer.companyName,
          phone: _customer.phone,
          creditRating: _customer.creditRating,
          state: _customer.contacts[0]?.state || 'Abuja (FCT)',
          district: _customer.contacts[0]?.district || 'Abuja (FCT)',
          address: _customer.contacts[0]?.address || 'Abuja (FCT)',
        });
      }
    }
    // }
  }, [value, customerReducer.getCustomerStatus]);

  //listen for tax changes and adjust
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

  useEffect(() => {
    const newStates = STATES.map(state => ({
      label: state.name,
      value: state.name,
    }));

    setStates(newStates);
  }, []);

  const filterData = (_text: string) => {
    const text = _text.toLowerCase();
    //
    // console.log(text)
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

  useEffect(() => {
    // if (isNaN(discount)) return setGrandTotal(subTotal + vatTotal);
    // if (discount < 0 || discount > grandTotal) return setGrandTotal(subTotal + vatTotal);

    setGrandTotal(subTotal + vatTotal - calculateDiscount(subTotal));
  }, [discount, discountType]);

  useEffect(() => {
    setDiscount(values?.estimate?.discount || 0);
    setDiscountType(values?.estimate?.discountType || 'exact');
  }, []);

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

  const getOptionLabel = (option: any) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option && option.name) {
      return `${capitalize.words(option.name)} | ${option.slug} $^%&*(Stock: ${option.quantity ? option.quantity : 0})`
    }
    return '';
  };

  const renderOption = (props: any, option: any) => {
    const label = getOptionLabel(option);
    const labelParts = label.split('$^%&*');
    return (
      <li {...props} style={{ display: 'block' }}>
        <span style={{ fontSize: "16px", textAlign: 'left', fontWeight: 400, display: 'block' }}>
          {labelParts[0]}
        </span>
        {labelParts[1] && (
          <>
            <span style={{ fontSize: "12px", textAlign: 'right', marginBottom: '1px', display: 'block' }}>
              {/* {'(Stock'} */}
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
    if (option && option.name) {
      return capitalize.words(option.name);
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
        option.name.toLowerCase().includes(state.inputValue?.toLowerCase())
      );
    }
  };

  const filterOptionsLabour = (serviceOnly: any, state: any) => {
    if (state.inputValue === "") {
      return [];
    } else {
      return serviceOnly.filter((option: any) =>
        option.name.toLowerCase().includes(state.inputValue?.toLowerCase())
      );
    }
  };

  function handleSearch() {
    if ((inputValue || '').length == 0) {
      setShowDrop(false);
    } else {
      setNoOptionsText('No result Found');
      setShowDrop(true);
    }
  }

  const toggleFetch = () => {
    setFetch(!fetch);
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
                  renderInput={props => (
                    <TextField
                      {...props}
                      label="Search customer by First name, last name, car plate number."
                      onChange={e => {
                        // setInputStack(e.target.value)
                        filterData(e.target.value);
                      }}
                      onClick={() => {
                        handleSearch()
                      }}
                      onKeyDown={(e: any) => {
                        if (e.key === 'Enter' || e.key === 'Search' || e.key === 'Submit') {
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
                            {partnerReducer.getDriversFilterDataStatus === 'loading'
                              ? ( <CircularProgress color="inherit" size={20} /> )
                              : <Button
                                  sx={{
                                    zIndex: 1,
                                    cursor: 'pointer',
                                    backgroundColor: 'green', color: 'white',
                                    '&:hover': {color: 'green', backgroundColor: 'white', boxShadow: 2}
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

              <Grid ml={2} sx={{display: 'flex', alignItems: {xs: 'left', md: 'none'}}}>
                <Box onClick={toggleFetch}>
                  {fetch
                    ? <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ToggleOn color="success" fontSize='large'/>&nbsp;<span style={{fontSize: '16px', fontWeight: 500}}>Customer</span>
                      </Box>
                    : <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ToggleOff color="warning" fontSize='large'/>&nbsp;<span style={{fontSize: '16px', fontWeight: 500}}>Global customer</span>
                      </Box>
                  }
                </Box>
              </Grid>
            </Grid>

            {/* <Divider orientation="horizontal" /> */}
          </Grid>
          <Grid container justifyContent="center" alignItems="center"
            sx={{
              mt: {md: 4, xs: 2},
              width: {xs: '100%', md: '50%'}
            }}
          >
            <Typography
              onClick={() => setCreateModal(true)}
              color={'skyblue'}
              style={{
                marginLeft: 20,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                textAlign: 'center'
              }}>
              <FaPlus style={{ marginRight: 8 }} />
              New Customer
            </Typography>
          </Grid>
          {/*
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
          </Grid> */}

          {userInfo.firstName.length != 0 && (
            <Grid style={{ padding: 20 }} xs={12} container>
              <Grid item xs={11}>
                <Grid item xs={12} container>
                  <Typography>
                    {values?.firstName || 'First Name & '} {values?.lastName || 'Last Name'}
                  </Typography>{' '}
                  <br />
                </Grid>

                {(userInfo?.companyName || '').length != 0 && (
                  <Grid xs={12} container>
                    <Typography>{userInfo?.companyName || 'First Name & '}</Typography> <br />
                  </Grid>
                )}

                <Grid item xs={12} container>
                  <Typography>{values?.email || 'Email'}</Typography> <br />
                </Grid>

                <Grid item xs={12} container>
                  <Typography>{values?.phone || 'Phone'}</Typography> <br />
                </Grid>

                <Grid item xs={12} container>
                  <Typography>{values?.address || 'Address'}</Typography> <br />
                </Grid>

                <Grid item xs={12} container>
                  <Typography>{values?.state || 'State'}</Typography> <br />
                </Grid>
              </Grid>

              <Grid>
                <Typography
                  onClick={() => {
                    setEditModal(true);
                  }}>
                  {activeId != 0 && (
                    <span style={{ color: 'skyblue', textDecoration: 'none', cursor: 'pointer' }}>Edit</span>
                  )}
                </Typography>{' '}
                <br />
              </Grid>
            </Grid>
          )}

          <Typography>
            {'\n'}
            <br />
          </Typography>

          <VehicleInformationFields
            vinOptions={vinOptions}
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
                          <Grid container item spacing={1} xs={14} key={index} columns={14} mb={2}>
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
                                        // loading={itemReducer.getItemsStatus === 'loading'}
                                        noOptionsText="..."
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
                                                <InputAdornment position="end" sx={{ position: 'absolute', left: {lg: '90%', xs: '80%'} }}>
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
                    <br />
                    <Grid item xs={12} justifyContent='left'>
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
                                  // marginLeft: 20,
                                  display: 'flex',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                }}>
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
                      <Divider orientation="horizontal" />
                      <Grid item sm={4} xs={0} />
                      <Grid item sm={4} xs={6} mb={2} mt={2}>
                        <Typography
                          style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'left'
                            }}
                          >
                          {/* Part(s): ₦{formatNumberToIntl(Math.round(partTotal))} */}
                          Part(s): ₦{formatNumberToIntl(+partTotal.toFixed(2))}
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
          <Grid item xs={12}>
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
                                      noOptionsText="..."
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
                                              <InputAdornment position="end" sx={{ position: 'absolute', left: {lg: '95%', md: '85%', xs: '78%'} }}>
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
                    {/* <br /> */}
                    <Grid item xs={12} justifyContent='left'>
                      {document.documentElement.clientWidth <= 375
                          ? <Button
                              onClick={() =>
                                laboursProps.push({
                                  title: '',
                                  cost: '0',
                                })
                              }
                            >
                              {'Add Service'}
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
                                // marginLeft: 20,
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                              }}>
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
            <Grid item sm={4} xs={0}/>
            <Grid item sm={4} xs={6} mb={2} mt={2}>
              <Typography
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left'
                }}
              >
                {/* Service Charge(s): ₦{formatNumberToIntl(Math.round(labourTotal))} */}
                Service Charge(s): ₦{formatNumberToIntl(+labourTotal.toFixed(2))}
              </Typography>
              {enableTaxLabor && (
                <TextField
                  name={fields.tax.name}
                  value={values.tax}
                  label={`${fields.tax.label} (VAT 7.5%)`}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2, mt: 2, color: 'black'}}
                  type="number"
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
          <Grid item xs={6} alignSelf="center">
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
            <Grid container spacing={0}>
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
          </Grid>
          <Grid item xs={6}>
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
            <Grid item xs={12} container spacing={0.5}>
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
                    { label: 'hour(s)', value: 'hour' },
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
            <br />
            <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12}
            sx={{
              display: 'flex',
              flexDirection: {sm: 'row', xs: 'column'},
              mt: 2, mb: 2
            }}
          >
            <Grid item sm={6} xs={12}>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>VAT(7.5%):</Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>₦{formatNumberToIntl(+vatTotal.toFixed(2))}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>Grand Total:</Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{fontSize: {sm: '20px', xs: '15px'}, fontWeight: 600}}>₦{formatNumberToIntl(+grandTotal.toFixed(2))}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={6} xs={12} />
          </Grid>
          {parseInt(values.depositAmount) > 0 && parseInt(values.depositAmount) <= grandTotal && (
            <Grid item xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Divider sx={{ mb: 3 }} flexItem orientation="horizontal" />
              <LoadingButton
                type="submit"
                size={document.documentElement.clientWidth <= 375 ? 'small' : 'large'}
                loading={saveStatus}
                disabled={
                  saveStatus || values.status === ESTIMATE_STATUS.sent || values.status === ESTIMATE_STATUS.invoiced
                }
                variant="contained"
                color="secondary"
                endIcon={<Save />}
                onClick={() => {
                  console.log('called> ', discountType, discount);
                  props.setDiscountType && props.setDiscountType(discountType);
                  props.setDiscount && props.setDiscount(discount);
                  props.setSave(true);
                }}>
                {'Save'}
              </LoadingButton>
              <LoadingButton
                sx={{ ml: 2 }}
                size={document.documentElement.clientWidth <= 375 ? 'small' : 'large'}
                type="submit"
                loading={sendStatus}
                disabled={values.status === ESTIMATE_STATUS.invoiced}
                onClick={() => {
                  props.setDiscountType && props.setDiscountType(discountType);
                  props.setDiscount && props.setDiscount(discount);
                  props.setSave(false);
                }}
                variant="contained"
                color="success"
                endIcon={values.status === ESTIMATE_STATUS.sent ? <SendAndArchive /> : <Send />}>
                {values.status === ESTIMATE_STATUS.sent ? 'Save & Send' : 'Send'}
              </LoadingButton>
            </Grid>
          )}
        </Grid>
      </Form>
      <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />

      {/* @ts-ignore */}
      <CreateCustomerModal
        callback={(e: any) => {
          console.log(e);

          if (e.email === undefined) {
            return null;
          }

          setFieldValue(fields.firstName.name, e.firstName);
          setFieldValue(fields.lastName.name, e.lastName);
          setFieldValue(fields.phone.name, e.phone);
          setFieldValue(fields.email.name, e.email);
          setFieldValue(fields.state.name, e.state || 'Abuja (FCT)');
          setFieldValue(fields.address.name, e.address || ' .');
          setFieldValue(fields.addressType.name, 'Home');

          setUserInfo({
            accountType: e.companyName === 'individual' ? 'individual' : 'corporate',
            email: e.email,
            firstName: e.firstName,
            lastName: e.lastName,
            companyName: e.companyName,
            phone: e.phone,
            creditRating: e.creditRating,
            state: e?.state || 'Abuja (FCT)',
            district: e?.district || 'Abuja (FCT)',
            address: e?.address || 'Abuja (FCT)',
          });
        }}
        visible={createModal}
        setVisible={setCreateModal}
      />

      {/* @ts-ignore */}
      <CreateCustomerModal
        callback={(e: any) => {
          console.log(e);

          if (e.email === undefined) {
            return null;
          }

          setFieldValue(fields.firstName.name, e.firstName);
          setFieldValue(fields.lastName.name, e.lastName);
          setFieldValue(fields.phone.name, e.phone);
          setFieldValue(fields.email.name, e.email);
          setFieldValue(fields.state.name, e.state || 'Abuja (FCT)');
          setFieldValue(fields.address.name, e.address || ' .');
          setFieldValue(fields.addressType.name, 'Home');

          setUserInfo({
            accountType: e.companyName === 'individual' ? 'individual' : 'corporate',
            email: e.email,
            firstName: e.firstName,
            lastName: e.lastName,
            companyName: e.companyName,
            phone: e.phone,
            creditRating: e.creditRating,
            state: e?.state || 'Abuja (FCT)',
            district: e?.district || '',
            address: e?.address || ' .',
          });
        }}
        data={userInfo}
        visible={editModal}
        setVisible={setEditModal}
      />
    </React.Fragment>
  );
}

export default memo(EstimateForm);
