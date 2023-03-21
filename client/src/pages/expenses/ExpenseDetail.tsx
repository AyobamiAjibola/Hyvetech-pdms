import { IExpense, IExpenseCategory, IExpenseType, IInvoice } from '@app-models';
import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, CircularProgress, Divider, Grid, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppAlert from '../../components/alerts/AppAlert';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  getBeneficiariesAction,
  getExpenseCategories,
  getExpenseTypesActions,
  getSingleExpenseAction,
  updateExpenseDetailAction,
} from '../../store/actions/expenseAction';
import { getInvoicesAction } from '../../store/actions/invoiceActions';
import { getPayStackBanksAction } from '../../store/actions/miscellaneousActions';
import {
  clearUpdateExpenseDetailStatus
} from '../../store/reducers/expenseReducer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Spinner from '../../utils/Spinner';

const ExpenseDetail = () => {
  const store = useAppSelector(state => state.expenseReducer);
  const invoiceStore = useAppSelector(state => state.invoiceReducer);
  const dispatch = useAppDispatch();
  // const [beneficiary] = useState<IBeneficiary | null>(null);
  const [expense, setExpense] = useState<IExpense | null>();
  const [reference, setReference] = useState<string | undefined>('');
  const [note, setNote] = useState<string | undefined>('');
  const [amount, setAmount] = useState<string | undefined>('');
  const [invoiceCode, setInvoiceCode] = useState<string | undefined>('');
  const [category, setCategory] = useState<IExpenseCategory | null>();
  const [type, setType] = useState<IExpenseType | null>();
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [dateModified, setDateModified] = useState(new Date());
  const [suucessAlert, setSuccessAlert] = useState('');
  const navigate = useNavigate();
  const params = useParams() as unknown as { id: number };
  const [errorAlert, setErrorAlert] = useState('');
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    if (store.updateExpenseDetailStatus === 'completed') {
      // setValue(null);
      setInvoice(null);
      setCategory(null);
      setType(null);
      setAmount('');
      setReference('');
      dispatch(clearUpdateExpenseDetailStatus());
      navigate(-1);
    } else if (store.updateExpenseDetailStatus === 'failed') {
      setErrorAlert(store.updateExpenseDetailError);
    }
    return () => {
      dispatch(clearUpdateExpenseDetailStatus());
    };
  }, [store.updateExpenseDetailStatus]);

  useEffect(() => {
    dispatch(getBeneficiariesAction());
    dispatch(getExpenseCategories());
    dispatch(getExpenseTypesActions());
    dispatch(getInvoicesAction());
    dispatch(getPayStackBanksAction());
  }, []);

  useEffect(() => {
    dispatch(getSingleExpenseAction(params.id));
  }, [params]);

  useEffect(() => {
    setExpense(store.expense);
  }, [store.expense]);

  useEffect(() => {
    setNote(expense?.note);
    setInvoiceCode(expense?.invoiceCode);
    setAmount(expense?.amount.toString());
    // setCategory(expense?.category?.name);
    setReference(expense?.reference)
  },[expense])
  console.log(expense)
  const handleDate = (newValue: any) => {
    setDateModified(newValue)
  }

  const handleFormSubmit = () => {
    // if (!beneficiary) {
    //   return setErrorAlert('Please select beneficiary');
    // }
    // if (!amount) return setErrorAlert('Please provide amount');

    // if (isNaN(+amount)) return setErrorAlert('Amount is invalid');

    // if (!category) return setErrorAlert('Please select category');
    // if (!type) return setErrorAlert('Please select type');

    // let findRef = ''
    // store.expenses.find(value => {
    //   value.reference === reference && (findRef = value.reference)
    // })
    // if (findRef !== '') return setErrorAlert('This payment has already been recorded');

    // if (!invoice) return setErrorAlert('Please select invoice');

    dispatch(
      updateExpenseDetailAction({
        // category,
        // type,
        // reference: reference
        // beneficiary,
        // invoice, //expenseReducer.invoiceCode !== '' ? invoiceCode : invoice,
        // amount: +amount,
        note: note
      }),
    );
  };

  useEffect(() => {
    if(expense?.status === 'UNPAID') {
      setEdit(true)
    }
  }, [expense])

  if (!expense)
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs>
          <Spinner />
        </Grid>
      </Grid>
    );
  else
  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 'auto'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'left',
            width: {lg: '80%', md: '100%'},
            height: 'auto',
            flexDirection: 'column'
          }}
        >
          <Box sx={{mt: 4, mb: 2}}>
            <Typography sx={{fontSize: '25px', fontWeight: 600}}>
              Summary
            </Typography>
            <Typography sx={{fontSize: '20px', fontWeight: 500}}>
              {expense?.expenseCode ? `EXP-${expense?.expenseCode}00${expense?.partnerId}` : ''}
            </Typography>
          </Box>
          <Formik
            initialValues={{}}
            onSubmit={() => {
              handleFormSubmit();
            }}>
            {() => (
              <Form autoComplete="off" autoCorrect="off">
                <Grid spacing={6} style={{ marginTop: 3 }} xs={12} container>
                  <Grid item md={6} sm={7}>
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
                            label="Date Modified"
                            variant="outlined"
                          />
                        }
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item md={6} sm={5}>
                    <Grid xs={12} container>
                        <Typography sx={{fontSize: '17px', fontWeight: '500'}}>{expense?.beneficiary?.name}</Typography> <br />
                      </Grid>

                      <Grid xs={12} container>
                        <Typography sx={{fontSize: '17px', fontWeight: '500'}}>{expense?.beneficiary?.accountNumber}</Typography> <br />
                      </Grid>

                      <Grid xs={12} container>
                        <Typography sx={{fontSize: '17px', fontWeight: '500'}}>{expense?.beneficiary?.bankName}</Typography> <br />
                      </Grid>
                    </Grid>
                </Grid>
                <Grid spacing={6} style={{ marginTop: 3 }} xs={12} container>
                  <Grid item md={6} sm={12}>
                    {!edit &&
                      <TextField
                        value={expense?.category?.name}
                        // onChange={e => setInvoiceCode(e.target.value)}
                        fullWidth
                        variant="outlined"
                        // name="Invoice"
                        label={'Expense Category'}
                        InputProps={{
                          readOnly: expense?.status === "PAID" && true
                        }}
                      />
                    }
                    {edit && <Autocomplete
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
                    />}
                  </Grid>
                  <Grid item md={6} sm={12}>
                    <TextField
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      type={'number'}
                      fullWidth
                      variant="outlined"
                      name="amount"
                      label={'Amount'}
                      InputProps={{
                        readOnly: expense?.status === "PAID" && true
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid spacing={6} xs={12} style={{ marginTop: 3 }} container>
                  <Grid item md={6} sm={12}>
                    {!edit &&
                      <TextField
                        value={expense?.type?.name}
                        // onChange={e => setInvoiceCode(e.target.value)}
                        fullWidth
                        variant="outlined"
                        // name="Invoice"
                        label={'Expense Type/Name'}
                        InputProps={{
                          readOnly: expense?.status === "PAID" && true
                        }}
                      />
                    }
                    {edit && <Autocomplete
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
                    />}
                  </Grid>
                  <Grid item md={6} sm={12}>
                    <TextField
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      name="note"
                      label={'Note/Remarks'}
                      InputProps={{
                        readOnly: expense?.status === "PAID" && true
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid spacing={6} xs={12} style={{ marginTop: 3 }} container>
                  <Grid item md={6} sm={12}>
                    {!edit &&
                      <TextField
                        value={invoiceCode === null && ''}
                        onChange={e => setInvoiceCode(e.target.value)}
                        fullWidth
                        variant="outlined"
                        name="Invoice"
                        label={'Invoice'}
                        InputProps={{
                          readOnly: expense?.status === "PAID" && true
                        }}
                      />
                    }
                    {edit && <Autocomplete
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
                      value={invoice}
                      onChange={(_: any, newValue) => setInvoice(newValue)}
                      options={invoiceStore.invoices}
                    />}
                  </Grid>
                  <Grid item md={6} sm={12}>
                    <TextField
                      value={reference}
                      onChange={e => setReference(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`reference`}
                      label="Payment reference"
                      InputProps={{
                        readOnly: expense?.status === "PAID" && true
                      }}
                    />
                  </Grid>
                </Grid>
                <Divider style={{ marginTop: 40, marginBottom: 20 }} />

                <LoadingButton
                  type="submit"
                  loading={store.createEstimateStatus === 'loading'}
                  // disabled={store.createEstimateStatus === 'loading' || expense?.status === 'PAID'}
                  disabled={true}
                  variant="contained"
                  color="secondary"
                  endIcon={<Save />}>
                  {'Edit'}
                </LoadingButton>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
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

export default ExpenseDetail;
