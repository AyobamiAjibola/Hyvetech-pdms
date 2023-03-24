import {
  IExpense,
  IExpenseCategory,
  IExpenseType,
  IInvoice
} from '@app-models';
import { ArrowBackIosNew, Save, Edit } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, CircularProgress, Divider, Grid, TextField, Typography } from '@mui/material';
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
  clearGetExpenseStatus,
  clearUpdateExpenseDetailStatus
} from '../../store/reducers/expenseReducer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Spinner from '../../utils/Spinner';
import { formatDate } from '../../utils/generic';

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
  const [invoice, setInvoice] = useState<IInvoice | null>();
  const [dateModified, setDateModified] = useState(new Date());
  const [suucessAlert, setSuccessAlert] = useState('');
  const navigate = useNavigate();
  const params = useParams() as unknown as { id: number };
  const [errorAlert, setErrorAlert] = useState('');
  const [edit, setEdit] = useState<boolean>(false)
  const [date, setDate] = useState<string | null>('')

  useEffect(() => {
    if (store.updateExpenseDetailStatus === 'completed') {
      setType(null);
      setInvoice(null);
      setCategory(null);
      setNote('');
      setAmount('');
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
    if(store.getExpensesStatus === 'completed'){
      setExpense(store.expense);
    }

    dispatch(clearGetExpenseStatus())
  }, [dispatch, store.expense]);

  useEffect(() => {
    setNote(expense?.note);
    setInvoiceCode(expense?.invoiceCode);
    setAmount(expense?.amount.toString());
    setCategory(expense?.category);
    setReference(expense?.reference);
    setType(expense?.type)
    setInvoice(expense?.invoice)
    setDate(expense?.dateModified)
  },[expense])

  const handleDate = (newValue: any) => {
    setDateModified(newValue)
  }

  const handleFormSubmit = () => {
    if (!amount) return setErrorAlert('Please provide amount');

    if (isNaN(+amount)) return setErrorAlert('Amount is invalid');

    if (!category) return setErrorAlert('Please select category');
    if (type === null) return setErrorAlert('Please select type');

    let findRef = ''
    store.expenses.find(value => {
      value.reference === reference
      // && (findRef = value.reference)
    })
    if (findRef !== '') return setErrorAlert('This payment has already been recorded or you entering a blank reference.');

    dispatch(
      updateExpenseDetailAction({
        category,
        id: params.id,
        note,
        type,
        invoice,
        dateModified,
        amount: amount === undefined ? null : +amount,
        status: expense?.status
      }),
    );
  };

  const getOptionLabel = (option: any) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option && option.name) {
      return option.name;
    }
    return '';
  };

  const getOptionLabelInv = (option: any) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option && option.code) {
      return option.code;
    }
    return '';
  };

  const isOptionEqualToValue = (option: any, value: any) => {
    return option === value || option.name === value
  }

  const isOptionEqualToValueInv = (option: any, value: any) => {
    return option === value || option.code === value
  }

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
          height: 'auto',

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
            <Grid>
              <ArrowBackIosNew
                onClick={() => window.history.back()}
                style={{ position: 'absolute', cursor: 'pointer' }}
              />
            </Grid>
            <br /><br/>

            <Typography sx={{fontSize: '25px', fontWeight: 600}}>
              Summary
            </Typography>
            <Typography sx={{fontSize: '20px', fontWeight: 500}}>
              {expense?.expenseCode ? `EXP-00${expense?.partnerId}${expense?.expenseCode}` : ''}
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
                    {!edit && <Grid item md={6} sm={7}>
                      <TextField
                        value={formatDate(date)}
                        // onChange={e => setInvoiceCode(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        // name="Invoice"
                        label={'Date Created'}
                        InputProps={{
                          readOnly: edit === false && true
                        }}
                      />
                    </Grid>}
                  {edit && <Grid item md={6} sm={7}>
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
                            label="Date Created"
                            variant="outlined"
                          />
                        }
                      />
                    </LocalizationProvider>
                  </Grid>}
                  <Grid item md={6} sm={5}>
                    <Grid xs={12} container>
                        <Typography sx={{fontSize: '17px', fontWeight: '500'}}>{expense?.beneficiary?.name}</Typography> <br />
                      </Grid>

                      <Grid xs={12} container>
                        <Typography sx={{fontSize: '17px', fontWeight: '500'}}>{expense?.beneficiary?.accountNumber ? expense?.beneficiary?.accountNumber : ''}</Typography> <br />
                      </Grid>

                      <Grid xs={12} container>
                        <Typography sx={{fontSize: '17px', fontWeight: '500'}}>{expense?.beneficiary?.bankName ? expense?.beneficiary?.bankName : ''}</Typography> <br />
                      </Grid>
                    </Grid>
                </Grid>
                <Grid spacing={6} style={{ marginTop: 3 }} xs={12} container>
                  <Grid item md={6} sm={12}>
                    {edit && <Autocomplete
                        getOptionLabel={getOptionLabel}
                        isOptionEqualToValue={isOptionEqualToValue}
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
                        defaultValue={edit ? category?.name : category}
                        onChange={(_: any, newValue: any) => {
                          setCategory(newValue);
                        }}
                        options={store.expenseCategories}
                      />
                    }
                    {!edit &&
                      <TextField
                        value={expense?.category?.name}
                        // onChange={e => setInvoiceCode(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        // name="Invoice"
                        label={'Expense category'}
                        InputProps={{
                          readOnly: edit === false && true
                        }}
                      />
                    }
                  </Grid>
                  <Grid item md={6} sm={12}>
                    <TextField
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      type={'number'}
                      fullWidth
                      variant="outlined"
                      name="amount"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label={'Amount'}
                      InputProps={{
                        readOnly: edit === false && true
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
                        InputLabelProps={{
                          shrink: true,
                        }}
                        // name="Invoice"
                        label={'Expense Type/Name'}
                        InputProps={{
                          readOnly: edit === false && true
                        }}
                      />
                    }
                    {edit && <Autocomplete
                        getOptionLabel={getOptionLabel}
                        isOptionEqualToValue={isOptionEqualToValue}
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
                        defaultValue={edit ? type?.name : type}
                        onChange={(_: any, newValue: any) => {
                          setType(newValue);
                        }}
                        options={store.expenseTypes}
                      />
                    }
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
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label={'Note/Remarks'}
                      InputProps={{
                        readOnly: edit === false && true
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid spacing={6} xs={12} style={{ marginTop: 3 }} container>
                  <Grid item md={6} sm={12}>
                    {!edit &&
                      <TextField
                        value={invoiceCode ? invoiceCode : ''}
                        onChange={e => setInvoiceCode(e.target.value)}
                        fullWidth
                        variant="outlined"
                        name="Invoice"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        label={'Invoice'}
                        InputProps={{
                          readOnly: edit === false && true
                        }}
                      />
                    }
                    {edit && <Autocomplete
                        getOptionLabel={getOptionLabelInv}
                        isOptionEqualToValue={isOptionEqualToValueInv}
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
                        defaultValue={edit ? invoice?.code : invoice}
                        onChange={(_: any, newValue: any) => {
                          setInvoice(newValue);
                        }}
                        options={invoiceStore.invoices}
                      />
                    }
                  </Grid>
                  <Grid item md={6} sm={12}>
                    {!edit && <TextField
                      value={reference}
                      onChange={e => setReference(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`reference`}
                      label="Payment reference"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        readOnly: edit === false && true
                      }}
                    />}
                  </Grid>
                </Grid>
                <Divider style={{ marginTop: 40, marginBottom: 20 }} />

                {edit && <LoadingButton
                  type="submit"
                  loading={store.updateExpenseDetailStatus === 'loading'}
                  disabled={store.updateExpenseDetailStatus === 'loading' || expense?.status === 'PAID'}
                  variant="contained"
                  color="secondary"
                  endIcon={<Save />}>
                  {'Save'}
                </LoadingButton>}
              </Form>
            )}
          </Formik>
          {expense?.status === "UNPAID" && <Button
            onClick={() => setEdit(true)}
            variant="contained"
            color="secondary"
            endIcon={<Edit />}
            disabled={edit === true}
            sx={{
              width: '10%',
              mt: 2
            }}
          >
            {'Edit'}
          </Button>}
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
