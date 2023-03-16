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
} from '../../store/reducers/expenseReducer';

const ExpenseCreate = () => {
  const store = useAppSelector(state => state.expenseReducer);
  const invoiceStore = useAppSelector(state => state.invoiceReducer);
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const [beneficiary, setValue] = useState<IBeneficiary | null>(null);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<IExpenseCategory | null>();
  const [type, setType] = useState<IExpenseType | null>();
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [showBenenficiaryForm, setBeneficiaryForm] = useState(false);
  const [bank, setBank] = useState<IPayStackBank | null>();
  const [name, setName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [suucessAlert, setSuccessAlert] = useState('');
  const navigate = useNavigate();

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

  const handleFormSubmit = () => {
    if (!beneficiary) {
      return setErrorAlert('Please select beneficiary');
    }
    if (!amount) return setErrorAlert('Please provide amount');

    if (isNaN(+amount)) return setErrorAlert('Amount is invalid');

    if (!category) return setErrorAlert('Please select category');
    if (!type) return setErrorAlert('Please select type');

    // if (!invoice) return setErrorAlert('Please select invoice');

    dispatch(
      createExpenseAction({
        category,
        type,
        reference: reference.trim() === '' ? null : reference,
        beneficiary,
        invoice,
        amount: +amount,
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
    if (!accountName || accountName.trim() === '') return setErrorAlert('Please provide account name');

    if (!accountNumber || accountNumber.trim() === '') return setErrorAlert('Please provide account number');
    if (!bank) return setErrorAlert('Please select bank');

    dispatch(
      createBeneficiaryAction({
        name,
        bankName: bank.name,
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
            <Grid spacing={8} container alignItems={'center'} justifyContent="flex-start">
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
            <Grid style={{ marginTop: 40 }} container justifyContent="center" alignItems="center">
              <Grid item xs={8} md={6}>
                <Autocomplete
                  filterOptions={(options, state) => {
                    return options.filter(item => item.name.toLowerCase().startsWith(state.inputValue.toLowerCase()));
                  }}
                  inputValue={inputValue}
                  value={beneficiary}
                  loading={store.getExpensesStatus === 'loading'}
                  getOptionLabel={option => option.name}
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
                <Grid item xs={11}>
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
            <Grid spacing={8} style={{ marginTop: 20 }} xs={12} container>
              <Grid item md={12} sm={12}>
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
            <Grid spacing={8} xs={12} style={{ marginTop: 5 }} container>
              <Grid item md={6} sm={12}>
                <TextField
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  fullWidth
                  variant="outlined"
                  name={`reference`}
                  label="Reference"
                />
              </Grid>
              <Grid item md={6}>
                <Autocomplete
                  getOptionLabel={option => option.name}
                  renderInput={props => (
                    <TextField
                      {...props}
                      label="Category"
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
                {/* <Typography
                  onClick={() => setCategoryForm(true)}
                  color={'skyblue'}
                  style={{
                    marginTop: 20,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                  <FaPlus style={{ marginRight: 8 }} />
                  New Expense category
                </Typography> */}
              </Grid>
            </Grid>
            <Grid spacing={8} xs={12} style={{ marginTop: 5 }} container>
              <Grid item md={6}>
                <Autocomplete
                  getOptionLabel={option => option.name}
                  renderInput={props => (
                    <TextField
                      {...props}
                      label="Type"
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
              <Grid item md={6}>
                <Autocomplete
                  getOptionLabel={option => option.code}
                  renderInput={props => (
                    <TextField
                      {...props}
                      label="Invoice"
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
                  value={invoice}
                  onChange={(_: any, newValue) => {
                    setInvoice(newValue);
                  }}
                  options={invoiceStore.invoices}
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
                <Grid spacing={10} container>
                  <Grid item md={6} sm={12}>
                    <TextField
                      value={name}
                      onChange={e => setName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`name`}
                      label="Benenficiary Name"
                    />
                  </Grid>
                  <Grid item md={6} sm={12}>
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
                <Grid style={{ marginTop: 2 }} spacing={10} container>
                  <Grid item md={6} sm={12}>
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
                  <Grid item md={6} sm={12}>
                    <TextField
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
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
                <Grid spacing={10} container>
                  <Grid item md={12} sm={12}>
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
                <Grid spacing={10} container>
                  <Grid item md={12} sm={12}>
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
