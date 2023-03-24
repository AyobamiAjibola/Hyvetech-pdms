import { IExpense } from '@app-models';
// import { Cancel, Edit, ViewAgenda } from '@mui/icons-material';
import { Button, Chip, Divider, Grid, TextField, Typography } from '@mui/material';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAdmin from '../../hooks/useAdmin';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { deleteExpenseAction, getExpensesAction, updateExpenseAction } from '../../store/actions/expenseAction';
import moment from 'moment';
import { formatNumberToIntl } from '../../utils/generic';
import { Link } from 'react-router-dom';
import { EXPENSE_STATUS } from '../../config/constants';
import { Add, Cancel, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import AppModal from '../../components/modal/AppModal';
import { Formik } from 'formik';
import { FaPlus } from 'react-icons/fa';
import AppAlert from '../../components/alerts/AppAlert';
import { clearDeleteExpenseStatus } from '../../store/reducers/expenseReducer';

const Expenses = () => {
  const dispatch = useAppDispatch();
  const expenseReduder = useAppSelector(state => state.expenseReducer);
  const [showAddReferenceForm, setReferenceForm] = useState(false);
  const [reference, setReference] = useState('');
  const [expenseId, setExpenseId] = useState<number | null>(-1);
  const [alerMessage, setAlert] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; message: string } | null>(
    null,
  );
  const { isTechAdmin } = useAdmin();

  useEffect(() => {
    dispatch(getExpensesAction());
  }, []);

  const handleAddReference = () => {
    dispatch(updateExpenseAction({ reference, id: expenseId }));
    setExpenseId(-1);
    setReference('');
    setReferenceForm(false);
  };

  const updateExpenseReference = (expenseId: number | null) => {
    setReferenceForm(true);
    setExpenseId(expenseId);
  };

  useEffect(() => {
    if (expenseReduder.deleteExpenseStatus === 'failed') {
      setAlert({ type: 'error', message: expenseReduder.deleteExpenseError });
    } else if (expenseReduder.deleteExpenseStatus === 'completed') {
      setAlert({ type: 'success', message: 'Expense deleted successfully' });

      setAlert(null);
      dispatch(clearDeleteExpenseStatus());
      dispatch(getExpensesAction());
    }
  }, [expenseReduder.deleteExpenseStatus]);

  useEffect(() => {
    if (expenseReduder.updateExpenseStatus === 'failed') {
      setAlert({ type: 'error', message: expenseReduder.updateExpenseError });
    } else if (expenseReduder.updateExpenseStatus === 'completed') {
      setAlert({ type: 'success', message: 'Expense updated successfully' });

      setAlert(null);
      dispatch(clearDeleteExpenseStatus());
      dispatch(getExpensesAction());
    }
  }, [expenseReduder.updateExpenseStatus]);

  const handleExpenseDelete = (id: number) => {
    dispatch(deleteExpenseAction({ id }));
  };

  const techColumns = useMemo(() => {
    return [
      {
        field: 'dateModified',
        headerName: 'Date',
        headerAlign: 'center',
        align: 'center',
        width: 100,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).format('DD/MM/YYYY') : '-';
        },
        sortable: true,
        sortingOrder: ['desc'],
      },
      {
        field: 'id',
        headerName: 'Expense #',
        headerAlign: 'center',
        align: 'center',
        type: 'string',

        renderCell: params => {
          console.log(params)
          return (
            <Link style={{ color: 'skyblue', cursor: 'pointer' }} to={`/expense/${params.row.id}`}>
              {`EXP - 00${params.row.partnerId}${params.row.expenseCode}`}
            </Link>
          );
        },
        sortable: true,
        width: 100,
      },
      {
        field: 'category',
        headerName: 'Category',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
        renderCell: params => {
          return <span>{params.row.category.name}</span>;
        },
      },
      {
        field: 'amount',
        headerName: 'Amount',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? formatNumberToIntl(value) : '0';
        },
        sortable: true,
        sortingOrder: ['desc'],
        width: 150,
      },
      {
        field: 'beneficiary',
        headerName: 'Beneficiary',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
        renderCell: params => {
          return <span>{params.row.beneficiary.name}</span>;
        },
      },
      {
        field: 'invoiceCode',
        headerName: 'Invoice #',
        headerAlign: 'center',
        align: 'center',
        type: 'string',

        renderCell: params => {
          return (
            <Link style={{ color: 'skyblue', cursor: 'pointer' }} to={`/invoices/${params.row.invoiceId}`}>
              {params.row.invoiceCode}
            </Link>
          );
        },
        sortable: true,
        width: 100,
      },
      {
        field: 'reference',
        headerName: 'Payment Reference',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        renderCell: params => {
          return (
            params.row.reference || (
              <LoadingButton onClick={() => updateExpenseReference(params.row.id)} startIcon={<Add />}>
                Add
              </LoadingButton>
            )
          );
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 100,
        sortable: true,
        renderCell: params => {
          return params.row.status === EXPENSE_STATUS.paid ? (
            <Chip label={EXPENSE_STATUS.paid} size="small" color="success" />
          ) : (
            <Chip label={EXPENSE_STATUS.unpaid} size="small" color="info" />
          );
        },
      },
      // {
      //   field: 'note',
      //   headerName: 'Note',
      //   headerAlign: 'center',
      //   align: 'center',
      //   type: 'string',
      //   width: 400,
      //   sortable: true,
      //   renderCell: params => {
      //     return <span>{params.row.note}</span>;
      //   },
      // },
      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        headerName: 'Actions',
        getActions: (params: any) => {
          const row = params.row as IExpense;

          return [
            // <GridActionsCellItem
            //   key={0}
            //   icon={<Visibility sx={{ color: 'dodgerblue' }} />}
            //   onClick={() => {
            //     void dispatch(getEstimatesAction());
            //     navigate(`/estimates/${row.id}`, { state: { estimate: row } });
            //   }}
            //   label="View"
            //   showInMenu={false}
            // />,
            // <GridActionsCellItem
            //   sx={{ display: isTechAdmin ? 'block' : 'none' }}
            //   key={1}
            //   icon={<ViewAgenda sx={{ color: 'limegreen' }} />}
            //   //  onClick={() => estimate.onEdit(row.id)}
            //   //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}
            //   disabled={!isTechAdmin}
            //   label="View"
            //   showInMenu={false}
            // />,

            // <GridActionsCellItem
            //   sx={{ display: isTechAdmin ? 'block' : 'none' }}
            //   key={1}
            //   icon={<Edit sx={{ color: 'limegreen' }} />}
            //   //  onClick={() => estimate.onEdit(row.id)}
            //   //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}
            //   disabled={!isTechAdmin}
            //   label="Edit"
            //   showInMenu={false}
            // />,
            <GridActionsCellItem
              sx={{ display: isTechAdmin ? 'block' : 'none' }}
              key={2}
              icon={<Cancel sx={{ color: 'indianred' }} />}
              onClick={() => handleExpenseDelete(row.id)}
              label="Delete"
              //  disabled={row.status === ESTIMATE_STATUS.invoiced}
              showInMenu={false}
            />,
          ];
        },
      },
    ] as GridColDef<IExpense>[];
  }, [isTechAdmin]);

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h4" gutterBottom>
            Expenses
          </Typography>
        </Grid>
        <Grid item>
          <Link to="/expense/create">
            <Button variant="outlined" color="success" size="small">
              Generate
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <AppDataGrid
            rows={expenseReduder.expenses}
            columns={isTechAdmin ? techColumns : techColumns}
            showToolbar
            loading={expenseReduder.getExpensesStatus === 'loading'}
          />
        </Grid>
      </Grid>
      {showAddReferenceForm && (
        <AppModal
          fullWidth
          size="md"
          show={showAddReferenceForm}
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
                  Add Payment Reference
                </Typography>
                <Grid spacing={10} container>
                  <Grid item md={12} sm={12}>
                    <TextField
                      value={reference}
                      onChange={e => setReference(e.target.value)}
                      fullWidth
                      variant="outlined"
                      name={`name`}
                      label="Reference"
                    />
                  </Grid>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <LoadingButton
                  type="submit"
                  loading={expenseReduder.createExpenseTypeStatus === 'loading'}
                  disabled={expenseReduder.createExpenseTypeStatus === 'loading'}
                  // disabled={
                  //   saveStatus || values.status === ESTIMATE_STATUS.sent || values.status === ESTIMATE_STATUS.invoiced
                  // }
                  onClick={handleAddReference}
                  variant="contained"
                  color="secondary"
                  endIcon={<Save />}>
                  {'Save'}
                </LoadingButton>
              </div>
            </Formik>
          }
          onClose={() => setReferenceForm(false)}
        />
      )}
      <AppAlert
        onClose={() => setAlert(null)}
        alertType={alerMessage ? alerMessage.type : 'info'}
        show={alerMessage !== null}
        message={alerMessage?.message || ''}
      />
    </div>
  );
};

export default Expenses;
