import { IExpense } from '@app-models';
// import { Cancel, Edit, ViewAgenda } from '@mui/icons-material';
import { Button, Chip, Grid, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useMemo } from 'react';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAdmin from '../../hooks/useAdmin';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { getExpensesAction } from '../../store/actions/expenseAction';
import moment from 'moment';
import { formatNumberToIntl } from '../../utils/generic';
import { Link } from 'react-router-dom';
import { EXPENSE_STATUS } from '../../config/constants';

const Expenses = () => {
  const dispatch = useAppDispatch();
  const expenseReduder = useAppSelector(state => state.expenseReducer);

  const { isTechAdmin } = useAdmin();

  useEffect(() => {
    dispatch(getExpensesAction());
  }, []);

  const techColumns = useMemo(() => {
    return [
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
        field: 'reference',
        headerName: 'Reference',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
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
      {
        field: 'date',
        headerName: 'Date',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).format('LLL') : '-';
        },
        sortable: true,
        width: 200,
      },
      {
        field: 'invoiceCode',
        headerName: 'Invoice',
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
        field: 'updatedAt',
        headerName: 'Date Modified',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).format('LLL') : '-';
        },
        sortable: true,
        sortingOrder: ['desc'],
      },

      // {
      //   field: 'createdAt',
      //   headerName: 'Date Created',
      //   headerAlign: 'center',
      //   align: 'center',
      //   width: 200,
      //   type: 'string',
      //   valueFormatter: ({ value }) => {
      //     return value ? moment(value).format('LLL') : '-';
      //   },
      //   sortable: true,
      // },
      // {
      //   field: 'actions',
      //   type: 'actions',
      //   headerAlign: 'center',
      //   align: 'center',
      //   getActions: () => {
      //     // const row = params.row as IExpense;

      //     return [
      //       // <GridActionsCellItem
      //       //   key={0}
      //       //   icon={<Visibility sx={{ color: 'dodgerblue' }} />}
      //       //   onClick={() => {
      //       //     void dispatch(getEstimatesAction());
      //       //     navigate(`/estimates/${row.id}`, { state: { estimate: row } });
      //       //   }}
      //       //   label="View"
      //       //   showInMenu={false}
      //       // />,
      //       <GridActionsCellItem
      //         sx={{ display: isTechAdmin ? 'block' : 'none' }}
      //         key={1}
      //         icon={<ViewAgenda sx={{ color: 'limegreen' }} />}
      //         //  onClick={() => estimate.onEdit(row.id)}
      //         //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}
      //         disabled={!isTechAdmin}
      //         label="View"
      //         showInMenu={false}
      //       />,

      //       <GridActionsCellItem
      //         sx={{ display: isTechAdmin ? 'block' : 'none' }}
      //         key={1}
      //         icon={<Edit sx={{ color: 'limegreen' }} />}
      //         //  onClick={() => estimate.onEdit(row.id)}
      //         //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}
      //         disabled={!isTechAdmin}
      //         label="Edit"
      //         showInMenu={false}
      //       />,
      //       <GridActionsCellItem
      //         sx={{ display: isTechAdmin ? 'block' : 'none' }}
      //         key={2}
      //         icon={<Cancel sx={{ color: 'indianred' }} />}
      //         //  onClick={() => estimate.onDelete(row.id)}
      //         label="Delete"
      //         //  disabled={row.status === ESTIMATE_STATUS.invoiced}
      //         showInMenu={false}
      //       />,
      //     ];
      //   },
      // },
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
        <Grid item hidden={!isTechAdmin}>
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
    </div>
  );
};

export default Expenses;
