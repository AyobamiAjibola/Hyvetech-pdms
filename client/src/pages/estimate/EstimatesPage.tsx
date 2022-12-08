import React, { createContext, useMemo } from 'react';
import { EstimatePageContextProps } from '@app-interfaces';
import { IEstimate } from '@app-models';
import { Button, Grid, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAppSelector from '../../hooks/useAppSelector';
import AppAlert from '../../components/alerts/AppAlert';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Cancel, Edit, Visibility } from '@mui/icons-material';
import { Formik } from 'formik';
import AppModal from '../../components/modal/AppModal';
import estimateModel from '../../components/forms/models/estimateModel';
import EstimateForm from '../../components/forms/estimate/EstimateForm';
import useEstimate from '../../hooks/useEstimate';
import { useNavigate } from 'react-router-dom';
import useAdmin from '../../hooks/useAdmin';

export const EstimatePageContext = createContext<EstimatePageContextProps | null>(null);

function EstimatesPage() {
  const estimateReducer = useAppSelector(state => state.estimateReducer);

  const estimate = useEstimate();
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
        field: 'fullName',
        headerName: 'Full Name',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 250,
        sortable: true,
        valueGetter: param => {
          const driver = param.row.rideShareDriver;
          const customer = param.row.customer;

          return driver ? `${driver.firstName} ${driver.lastName}` : `${customer.firstName} ${customer.lastName}`;
        },
      },
      {
        field: 'phone',
        headerName: 'Phone',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 100,
        sortable: true,
        valueGetter: param => {
          const driver = param.row.rideShareDriver;
          const customer = param.row.customer;

          return driver ? `${driver.phone}` : `${customer.phone}`;
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
          const vehicle = param.row.vehicle;

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

              navigate(`/estimates/${row.id}`, { state: { estimate: row } });
            }}
            label="View"
            showInMenu={false}
          />,

          <GridActionsCellItem
            key={1}
            icon={<Edit sx={{ color: 'limegreen' }} />}
            onClick={() => {
              const row = params.row as IEstimate;

              estimate.onEdit(row.id);
            }}
            label="Edit"
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
    ] as GridColDef<IEstimate>[];
  }, [estimate, navigate]);

  return (
    <EstimatePageContext.Provider
      value={{
        driver: estimate.driver,
        setDriver: estimate.setDriver,
        estimates: estimate.estimates,
        setEstimates: estimate.setEstimates,
        showCreate: estimate.showCreate,
        setShowCreate: estimate.setShowCreate,
        showEdit: estimate.showEdit,
        setShowEdit: estimate.setShowEdit,
      }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h4" gutterBottom>
            Estimates
          </Typography>
        </Grid>
        <Grid item hidden={!isTechAdmin}>
          <Button variant="outlined" color="success" size="small" onClick={() => estimate.setShowCreate(true)}>
            Generate
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <AppDataGrid
            rows={estimate.estimates}
            columns={columns}
            showToolbar
            loading={estimateReducer.getEstimatesStatus === 'loading'}
          />
        </Grid>
      </Grid>
      <AppAlert
        alertType="success"
        show={undefined !== estimate.success}
        message={estimate.success?.message}
        onClose={() => estimate.setSuccess(undefined)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== estimate.error}
        message={estimate.error?.message}
        onClose={() => estimate.setError(undefined)}
      />
      <AppModal
        fullWidth
        size="xl"
        show={estimate.showCreate}
        Content={
          <Formik
            initialValues={estimate.initialValues}
            validationSchema={estimateModel.schema}
            onSubmit={values => {
              estimate.handleCreateEstimate(values, { url: 'yes' });
            }}>
            <EstimateForm
              showCreate={estimate.showCreate}
              setLabourTotal={estimate.setLabourTotal}
              setPartTotal={estimate.setPartTotal}
              setGrandTotal={estimate.setGrandTotal}
              labourTotal={estimate.labourTotal}
              partTotal={estimate.partTotal}
              grandTotal={estimate.grandTotal}
            />
          </Formik>
        }
        onClose={() => estimate.setShowCreate(false)}
      />
      <AppModal
        fullWidth
        size="xl"
        show={estimate.showEdit}
        Content={
          <Formik
            initialValues={estimate.initialValues}
            validationSchema={estimateModel.schema}
            onSubmit={estimate.handleCreateEstimate}
            enableReinitialize>
            <EstimateForm
              showEdit={estimate.showEdit}
              setLabourTotal={estimate.setLabourTotal}
              setPartTotal={estimate.setPartTotal}
              setGrandTotal={estimate.setGrandTotal}
              labourTotal={estimate.labourTotal}
              partTotal={estimate.partTotal}
              grandTotal={estimate.grandTotal}
            />
          </Formik>
        }
        onClose={() => estimate.setShowEdit(false)}
      />
    </EstimatePageContext.Provider>
  );
}

export default EstimatesPage;
