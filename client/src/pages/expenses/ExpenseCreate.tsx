import { IBeneficiary, IExpenseCategory, IExpenseType, IInvoice, IPayStackBank } from '@app-models';
import { ArrowBack, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, CircularProgress, Divider, Grid, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AppAlert from '../../components/alerts/AppAlert';
import AppModal from '../../components/modal/AppModal';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  createBeneficiaryAction,
  createExpenseAction,
  createExpenseCategoryAction,
  createExpenseTypeAction,
  getBeneficiariesAction,
  getExpenseCategories,
  getExpenseTypesActions,
} from '../../store/actions/expenseAction';
import { getInvoicesAction } from '../../store/actions/invoiceActions';
import { getPayStackBanksAction } from '../../store/actions/miscellaneousActions';
import {
  clearCreateBeneficiaryStatus,
  clearCreateEspenseStatus,
  clearCreateExpenseCategoryStatus,
  clearCreateExpenseTypeStatus,
  setInvoiceCode
} from '../../store/reducers/expenseReducer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ExpenseCreate = () => {
  const store = useAppSelector(state => state.expenseReducer);
  const invoiceStore = useAppSelector(state => state.invoiceReducer);
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const [beneficiary, setValue] = useState<IBeneficiary | null>(null);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<IExpenseCategory | null>();
  const [type, setType] = useState<IExpenseType | null>();
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [showBenenficiaryForm, setBeneficiaryForm] = useState(false);
  const [bank, setBank] = useState<IPayStackBank | null>();
  const [name, setName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [suucessAlert, setSuccessAlert] = useState('');
  const [dateModified, setDateModified] = useState(new Date());
  const navigate = useNavigate();
  const expenseReducer = useAppSelector(state => state.expenseReducer);

  const [errorAlert, setErrorAlert] = useState('');

  const [showCategoryForm, setCategoryForm] = useState(false);
  const [showExpenseTypeForm, setExpenseForm] = useState(false);

  const miscStore = useAppSelector(state => state.miscellaneousReducer);

  useEffect(() => {
    if (store.createExpenseStatus === 'completed') {
      setValue(null);
      setInvoice(null);
      setCategory(null);
      setType(null);
      setAmount('');
      setReference('');
      dispatch(clearCreateEspenseStatus());
      dispatch(setInvoiceCode(''))
      navigate(-1);
    } else if (store.createExpenseStatus === 'failed') {
      setErrorAlert(store.createExpenseError);
    }
    return () => {
      dispatch(clearCreateEspenseStatus());
    };
  }, [store.createExpenseStatus]);

  useEffect(() => {
    dispatch(getBeneficiariesAction());
    dispatch(getExpenseCategories());
    dispatch(getExpenseTypesActions());
    dispatch(getInvoicesAction());
    dispatch(getPayStackBanksAction());
  }, []);

  const handleDate = (newValue: any) => {
    setDateModified(newValue)
  }

  const handleFormSubmit = () => {
    if (!beneficiary) {
      return setErrorAlert('Please select beneficiary');
    }
    if (!amount) return setErrorAlert('Please provide amount');

    if (isNaN(+amount)) return setErrorAlert('Amount is invalid');

    if (!category) return setErrorAlert('Please select category');
    if (!type) return setErrorAlert('Please select type');

    let findRef = ''
    expenseReducer.expenses.find(value => {
      value.reference === reference && (findRef = value.reference)
    })
    if (findRef !== '') return setErrorAlert('This payment has already been recorded');

    const invoiceCode = invoiceStore.invoices.find((inv: IInvoice) => inv.code === expenseReducer.invoiceCode)
      
    dispatch(
      createExpenseAction({
        category,
        type,
        reference: reference.trim() === '' ? null : reference,
        beneficiary,
        invoice: expenseReducer.invoiceCode !== '' ? invoiceCode : invoice,
        amount: +amount,
        note,
        dateModified,
      }),
    );

  };

  useEffect(() => {
    if (store.createBeneficiaryStatus === 'completed') {
      setBank(null);
      setName('');
      setAccountName('');
      setAccountNumber('');
      dispatch(clearCreateBeneficiaryStatus());
      setBeneficiaryForm(false);
      dispatch(getBeneficiariesAction());
      setSuccessAlert('Beneficiary created successfully');
    } else if (store.createBeneficiaryStatus === 'failed') {
      setErrorAlert(store.createBeneficiaryError);
    }
  }, [store.createBeneficiaryStatus]);

  const handleOnCreateBeneficiary = () => {
    if (!name || name.trim() === '') return setErrorAlert('Please provide beneficiary name');
    if(accountNumber) {
      if (accountNumber.length < 10 || accountNumber.length > 10) return setErrorAlert('Please account number must be 10 digits');
      // if (accountNumber.replace(/[0-9]/g, '')) return setErrorAlert('Only numbers are allowed'); // PLEASE CHECK THIS
    }

    dispatch(
      createBeneficiaryAction({
        name,
        bankName: bank?.name,
        accountName,
        accountNumber,
      }),
    );
  };

  useEffect(() => {
    if (store.createExpenseTypeStatus === 'completed') {
      setName('');
      dispatch(clearCreateExpenseTypeStatus());
      dispatch(getExpenseTypesActions());
      setSuccessAlert('Expense type created successfully');
      setExpenseForm(false);
    } else if (store.createExpenseTypeStatus === 'failed') {
      setErrorAlert(store.createExpenseTypeError);
    }
  }, [store.createExpenseTypeStatus]);

  useEffect(() => {
    if (store.createExpenseCategoryStatus === 'completed') {
      setName('');
      dispatch(clearCreateExpenseCategoryStatus());
      dispatch(getExpenseCategories());
      setSuccessAlert('Expense category created successfully');
      setCategoryForm(false);
    } else if (store.createExpenseCategoryStatus === 'failed') {
      setErrorAlert(store.createExpenseCategoryError);
    }
  }, [store.createExpenseCategoryStatus]);

  const handleCreateExpenseType = () => {
    dispatch(createExpenseTypeAction({ name }));
  };

  const handleCreateExpenseCategory = () => {
    dispatch(createExpenseCategoryAction({ name }));
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={{}}
        onSubmit={() => {
          handleFormSubmit();
        }}>
        {() => (
          <Form autoComplete="off" autoCorrect="off">
            <Grid spacing={document.documentElement.clientWidth <= 375 ? 4 : 8}
              container alignItems={'center'} justifyContent="flex-start"
            >
              <Grid item>
                <Typography
                  onClick={() => navigate(-1)}
                  color={'skyblue'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                  <ArrowBack />
                  Back
                </Typography>
              </Grid>
              <Grid md={10} item>
                <Typography
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 24,
                  }}>
                  New Expense
                </Typography>
              </Grid>
            </Grid>
            <Grid
              sx={{
                marginTop: 5,
                display: 'flex',
                justifyContent: {sm: "center", xs: "normal"},
                alignItems: "center"
              }}
              container
            >
              <Grid item sm={8} md={6} xs={10}>
                <Autocomplete
                  filterOptions={(options, state) => {
                    return options.filter(item => item.name.toLowerCase().startsWith(state.inputValue.toLowerCase()));
                  }}
                  inputValue={inputValue}
                  value={beneficiary}
                  loading={store.getExpensesStatus === 'loading'}
                  getOptionLabel={option => `${option.name} | ${option.bankName ? option.bankName: ''} | ${option.accountNumber ? option.accountNumber : ''}`}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  onChange={(_: any, newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={props => (
                    <TextField
                      {...props}
                      label="Search beneficiary by First name, last name."
                      InputProps={{
                        ...props.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {store.getExpensesStatus === 'loading' ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {props.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                      onChange={e => setInputValue(e.target.value)}
                    />
                  )}
                  options={store.beneficiaries || []}
                />
              </Grid>

              <Grid item>
                <Typography
                  onClick={() => setBeneficiaryForm(true)}
                  color={'skyblue'}
                  style={{
                    marginLeft: 20,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                  <FaPlus style={{ marginRight: 8 }} />
                  New Beneficiary
                </Typography>
              </Grid>
            </Grid>
            {beneficiary && (
              <Grid style={{ padding: 20 }} xs={12} container>
                <Grid item sm={11} xs={12}>
                  <Grid xs={12} container>
                    <Typography>{beneficiary?.name}</Typography> <br />
                  </Grid>

                  <Grid xs={12} container>
                    <Typography>{beneficiary.accountNumber}</Typography> <br />
                  </Grid>

                  <Grid xs={12} container>
                    <Typography>{beneficiary.bankName}</Typography> <br />
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid spacing={document.documentElement.clientWidth <= 375 ? 4 : 8}
              style={{ marginTop: 20 }} xs={12} container
            >
              <Grid item md={6} sm={12} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableFuture
                    minDate={new Date('2000/01/01')}
                    openTo="year"
                    views={['year', 'month', 'day']}
                    value={dateModified}
                    onChange={ handleDate }
                    renderInput={(params: any) =>
                      <TextField
                        {...params}
                        fullWidth
                        label="Date"
                        variant="outlined"
                      />
                    }
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid spacing={document.documentElement.clientWidth <= 375 ? 4 : 8} style={{ marginTop: 5 }} xs={12} container>
              <Grid item md={6} sm={12} xs={12}>
                <Autocomplete
                  getOptionLabel={option => option.name}
                  renderInput={props => (
                    <TextField
                      {...props}
                      label="Expense category"
                      InputProps={{
                        ...props.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {store.getExpensesStatus === 'loading' ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {props.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                  value={category}
                  onChange={(_: any, newValue) => {
                    setCategory(newValue);
                  }}
                  options={store.expenseCategories}
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  type={'number'}
                  fullWidth
                  variant="outlined"
                  name={`amount`}
                  label={'Amount'}
                />
              </Grid>
            </Grid>
            <Grid spacing={document.documentElement.clientWidth <= 375 ? 4 : 8}
              xs={12} style={{ marginTop: 5 }} container
            >
              <Grid item md={6} sm={12} xs={12}>
                <Autocomplete
                  getOptionLabel={option => option.name}
                  renderInput={props => (
                    <TextField
                      {...props}
                      label="Expense Type/Name"
                      InputProps={{
                        ...props.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {store.getExpensesStatus === 'loading' ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {props.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                  value={type}
                  onChange={(_: any, newValue) => {
                    setType(newValue);
                  }}
                  options={store.expenseTypes}
                />
                <Typography
                  onClick={() => setExpenseForm(true)}
                  color={'skyblue'}
                  style={{
                    marginTop: 20,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                  <FaPlus style={{ marginRight: 8 }} />
                  New Expense type
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  name={`note`}
                  label={'Note/Remarks'}
                />
              </Grid>
            </Grid>
            <Grid spacing={document.documentElement.clientWidth <= 375 ? 4 : 8}
              xs={12} style={{ marginTop: 5 }} container
            >
              <Grid item md={6} sm={12} xs={12}>
                {expenseReducer.invoiceCode === ''
                  ? <Autocomplete
                      getOptionLabel={option => option.code}
                      disabled={category?.name === "Others" || category?.name === "Overhead"}
                      renderInput={props => (
                        <TextField
                          {...props}
                          label="Invoice"
                          disabled={category?.name === "Others" || category?.name === "Overhead"}
                          InputProps={{
                            ...props.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {store.getExpensesStatus === 'loading' ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {props.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                      defaultValue={expenseReducer.invoiceCode !== '' ? expenseReducer.invoiceCode : invoice}
                      onChange={(_: any, newValue) => setInvoice(newValue)}
                      options={invoiceStore.invoices}
                    />
                  : <TextField
                      value={expenseReducer.invoiceCode}
                      // onChange={e => setReference(e.target.value)}
                      fullWidth
                      variant="outlined"
                      label="Invoice"
                    />
                }
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  fullWidth
                  variant="outlined"
                  name={`reference`}
                  label="Payment reference"
                />
              </Grid>
            </Grid>
            <Divider style={{ marginTop: 40, marginBottom: 20 }} />

            <LoadingButton
              type="submit"
              loading={store.createEstimateStatus === 'loading'}
              disabled={store.createEstimateStatus === 'loading'}
              // disabled={
              //   saveStatus || values.status === ESTIMATE_STATUS.sent || values.status === ESTIMATE_STATUS.invoiced
              // }
              variant="contained"
              color="secondary"
              endIcon={<Save />}>
              {'Save'}
            </LoadingButton>
          </Form>
        )}
      </Formik>
      {showBenenficiaryForm && (
        <AppModal
          fullWidth
          size="md"
          fullScreen={document.documentElement.clientWidth <= 375 ? true : false}
          show={showBenenficiaryForm}
          Content={
            <Formik
              initialValues={{}}
              onSubmit={(values, formikHelpers) => {
                console.log(values, formikHelpers);
              }}
              enableReinitialize
              validateOnChange>
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <Typography
                  style={{
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                  <FaPlus style={{ marginRight: 8 }} />
                  New Beneficiary
                </Typography>
                <Grid spacing={document.documentElement.clientWidth <= 375 ? 4 : 10}
                  container
                >
                  <Grid item md={6} xs={12}>
                    <TextField
                      value={name}
                      onChange={e => setName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`name`}
                      label="Benenficiary Name"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      value={accountName}
                      onChange={e => setAccountName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`accountName`}
                      label="Account Name"
                    />
                  </Grid>
                </Grid>
                <Grid style={{ marginTop: 2 }} spacing={document.documentElement.clientWidth <= 375 ? 4 : 10}
                  container
                >
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      getOptionLabel={option => option.name}
                      renderInput={props => (
                        <TextField
                          {...props}
                          label="Bank"
                          InputProps={{
                            ...props.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {store.getExpensesStatus === 'loading' ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {props.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                      value={bank}
                      onChange={(_: any, newValue) => {
                        setBank(newValue);
                      }}
                      options={miscStore.banks}
                      loading={miscStore.getBanksStatus === 'loading'}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value.replace(" ", ""))}
                      fullWidth
                      variant="outlined"
                      name={`accountNumber`}
                      label="Account Number"
                    />
                  </Grid>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <LoadingButton
                  type="submit"
                  loading={store.createBeneficiaryStatus === 'loading'}
                  disabled={store.createBeneficiaryStatus === 'loading'}
                  // disabled={
                  //   saveStatus || values.status === ESTIMATE_STATUS.sent || values.status === ESTIMATE_STATUS.invoiced
                  // }
                  onClick={() => {
                    handleOnCreateBeneficiary();
                  }}
                  variant="contained"
                  color="secondary"
                  endIcon={<Save />}>
                  {'Save'}
                </LoadingButton>
              </div>
            </Formik>
          }
          onClose={() => setBeneficiaryForm(false)}
        />
      )}

      {showCategoryForm && (
        <AppModal
          fullWidth
          size="md"
          fullScreen={document.documentElement.clientWidth <= 375 ? true : false}
          show={showCategoryForm}
          Content={
            <Formik
              initialValues={{}}
              onSubmit={(values, formikHelpers) => {
                console.log(values, formikHelpers);
              }}
              enableReinitialize
              validateOnChange>
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <Typography
                  style={{
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                  <FaPlus style={{ marginRight: 8 }} />
                  New Expense Category
                </Typography>
                <Grid spacing={document.documentElement.clientWidth <= 375 ? 4 : 10}
                  container
                >
                  <Grid item md={12} xs={12}>
                    <TextField
                      value={name}
                      onChange={e => setName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`name`}
                      label="Expense category"
                    />
                  </Grid>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <LoadingButton
                  type="submit"
                  loading={store.createExpenseCategoryStatus === 'loading'}
                  disabled={store.createExpenseCategoryStatus === 'loading'}
                  // disabled={
                  //   saveStatus || values.status === ESTIMATE_STATUS.sent || values.status === ESTIMATE_STATUS.invoiced
                  // }
                  onClick={handleCreateExpenseCategory}
                  variant="contained"
                  color="secondary"
                  endIcon={<Save />}>
                  {'Save'}
                </LoadingButton>
              </div>
            </Formik>
          }
          onClose={() => setCategoryForm(false)}
        />
      )}
      {showExpenseTypeForm && (
        <AppModal
          fullWidth
          size="md"
          fullScreen={document.documentElement.clientWidth <= 375 ? true : false}
          show={showExpenseTypeForm}
          Content={
            <Formik
              initialValues={{}}
              onSubmit={(values, formikHelpers) => {
                console.log(values, formikHelpers);
              }}
              enableReinitialize
              validateOnChange>
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <Typography
                  style={{
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                  <FaPlus style={{ marginRight: 8 }} />
                  New Expense Type
                </Typography>
                <Grid spacing={document.documentElement.clientWidth <= 375 ? 4 : 10}
                  container
                >
                  <Grid item md={12} xs={12}>
                    <TextField
                      value={name}
                      onChange={e => setName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`name`}
                      label="Expense Type"
                    />
                  </Grid>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <LoadingButton
                  type="submit"
                  loading={store.createExpenseTypeStatus === 'loading'}
                  disabled={store.createExpenseTypeStatus === 'loading'}
                  // disabled={
                  //   saveStatus || values.status === ESTIMATE_STATUS.sent || values.status === ESTIMATE_STATUS.invoiced
                  // }
                  onClick={handleCreateExpenseType}
                  variant="contained"
                  color="secondary"
                  endIcon={<Save />}>
                  {'Save'}
                </LoadingButton>
              </div>
            </Formik>
          }
          onClose={() => setExpenseForm(false)}
        />
      )}
      <AppAlert onClose={() => setErrorAlert('')} alertType="error" show={errorAlert !== ''} message={errorAlert} />
      <AppAlert
        onClose={() => setSuccessAlert('')}
        alertType="success"
        show={suucessAlert !== ''}
        message={suucessAlert}
      />
    </React.Fragment>
  );
};

export default ExpenseCreate;
