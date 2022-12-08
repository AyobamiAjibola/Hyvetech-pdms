import React, { createContext, useMemo } from 'react';
import { EstimatePageContextProps } from '@app-interfaces';
import { IEstimate, IInvoice } from '@app-models';
import { Grid, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAppSelector from '../../hooks/useAppSelector';
import AppAlert from '../../components/alerts/AppAlert';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Cancel, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAdmin from '../../hooks/useAdmin';
import useInvoice from '../../hooks/useInvoice';

export const EstimatePageContext = createContext<EstimatePageContextProps | null>(null);

function InvoicesPage() {
  const invoiceReducer = useAppSelector(state => state.invoiceReducer);

  const invoice = useInvoice();
  const { isTechAdmin } = useAdmin();
  const navigate = useNavigate();

  const columns = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: 'ID',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'number',
      },
      {
        field: 'code',
        headerName: 'Code',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'number',
      },
      {
        field: 'fullName',
        headerName: 'Full Name',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 250,
        sortable: true,
        valueGetter: param => {
          const estimate = param.row.estimate;
          const customer = estimate.customer;

          return `${customer.firstName} ${customer.lastName}`;
        },
      },
      {
        field: 'phone',
        headerName: 'Phone',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 150,
        sortable: true,
        valueGetter: param => {
          const estimate = param.row.estimate;
          const customer = estimate.customer;

          return `${customer.phone}`;
        },
      },
      {
        field: 'model',
        headerName: 'Vehicle',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
        valueGetter: param => {
          const estimate = param.row.estimate;
          const vehicle = estimate.vehicle;

          return `${vehicle.modelYear} ${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})`;
        },
      },
      {
        field: 'grandTotal',
        headerName: 'Grand Total',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
      },
      {
        field: 'depositAmount',
        headerName: 'Deposit Amount',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
      },
      {
        field: 'dueAmount',
        headerName: 'Due Amount',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
      },
      {
        field: 'createdAt',
        headerName: 'Created Date',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).utc(false).format('LLL') : '-';
        },
        sortable: true,
      },
      {
        field: 'updatedAt',
        headerName: 'Modified Date',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).utc(false).format('LLL') : '-';
        },
        sortable: true,
      },
      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        getActions: (params: any) => [
          <GridActionsCellItem
            key={0}
            icon={<Visibility sx={{ color: 'dodgerblue' }} />}
            onClick={() => {
              const row = params.row as IEstimate;

              navigate(`/invoices/${row.id}`, { state: { invoice: row } });
            }}
            label="View"
            showInMenu={false}
          />,

          <GridActionsCellItem
            key={2}
            icon={<Cancel sx={{ color: 'indianred' }} />}
            onClick={() => {
              //
            }}
            label="Delete"
            showInMenu={false}
          />,
        ],
      },
    ] as GridColDef<IInvoice>[];
  }, [navigate]);

  return (
    <React.Fragment>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h4" gutterBottom>
            Invoices
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <AppDataGrid
            rows={invoice.invoices}
            columns={columns}
            showToolbar
            loading={invoiceReducer.getInvoicesStatus === 'loading'}
          />
        </Grid>
      </Grid>
      <AppAlert
        alertType="error"
        show={undefined !== invoice.error}
        message={invoice.error?.message}
        onClose={() => invoice.setError(undefined)}
      />
    </React.Fragment>
  );
}

export default InvoicesPage;
