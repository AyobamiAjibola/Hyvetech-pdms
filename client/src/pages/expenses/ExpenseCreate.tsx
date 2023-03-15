import { IBeneficiary, IExpenseCategory, IExpenseType, IInvoice, IPayStackBank } from '@app-models';
import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, CircularProgress, Divider, Grid, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import AppAlert from '../../components/alerts/AppAlert';
import AppModal from '../../components/modal/AppModal';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  createBeneficiaryAction,
  createExpenseAction,
  getBeneficiariesAction,
  getExpenseCategories,
  getExpenseTypesActions,
} from '../../store/actions/expenseAction';
import { getInvoicesAction } from '../../store/actions/invoiceActions';
import { getPayStackBanksAction } from '../../store/actions/miscellaneousActions';
import { clearCreateBeneficiaryStatus, clearCreateEspenseStatus } from '../../store/reducers/expenseReducer';

const ExpenseCreate = () => {
  const store = useAppSelector(state => state.expenseReducer);
  const invoiceStore = useAppSelector(state => state.invoiceReducer);
  const dispatch = useAppDispatch();
  const [inputValue] = useState('');
  const [beneficiary, setValue] = useState<IBeneficiary | null>(null);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<IExpenseCategory | null>();
  const [type, setType] = useState<IExpenseType | null>();
  const [invoice, setInvoice] = useState<IInvoice | null>();
  const [showBenenficiaryForm, setBeneficiaryForm] = useState(false);
  const [bank, setBank] = useState<IPayStackBank | null>();
  const [name, setName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const [errorAlert, setErrorAlert] = useState('');

  const miscStore = useAppSelector(state => state.miscellaneousReducer);

  useEffect(() => {
    if (store.createExpenseStatus === 'completed') {
      alert('estimate created successfully');
      setValue(null);
      setInvoice(null);
      setCategory(null);
      setType(null);
      setAmount('');
      setDate('');
      setReference('');
      dispatch(clearCreateEspenseStatus());
    }
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
      return alert('Please select beneficiary');
    }
    if (!amount) return alert('Please provide amount');

    if (isNaN(+amount)) return alert('Amount is invalid');

    if (!date || date.trim() === '') return alert('Please provide date');
    if (!category) return alert('Please select category');
    if (!type) return alert('Please select type');
    if (!invoice) return alert('Please select invoice');

    dispatch(
      createExpenseAction({
        date,
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
      clearCreateBeneficiaryStatus();
      setBeneficiaryForm(false);
      dispatch(getBeneficiariesAction());
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

  return (
    <React.Fragment>
      <Formik
        initialValues={{}}
        onSubmit={() => {
          handleFormSubmit();
        }}>
        {() => (
          <Form autoComplete="off" autoCorrect="off">
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={8} md={6}>
                <Autocomplete
                  // filterOptions={filterOptions}
                  inputValue={inputValue}
                  value={beneficiary}
                  openOnFocus={false}
                  loading={store.getExpensesStatus === 'loading'}
                  getOptionLabel={option => option.name}
                  isOptionEqualToValue={(option, value) => option.name.toLowerCase() === value.name.toLowerCase()}
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
              <Grid item md={6} sm={12}>
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
              <Grid item md={6} sm={12}>
                <TextField
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  type={'date'}
                  fullWidth
                  variant="outlined"
                  name={`date`}
                  label="Date"
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
      <AppAlert onClose={() => setErrorAlert('')} alertType="error" show={errorAlert !== ''} message={errorAlert} />
    </React.Fragment>
  );
};

export default ExpenseCreate;
