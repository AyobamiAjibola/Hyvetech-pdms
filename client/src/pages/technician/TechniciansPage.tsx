import React, { createContext, useEffect, useMemo } from 'react';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { Box, Button, DialogActions, DialogContentText, Divider, Grid, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Cancel, Edit, PersonAdd, Visibility } from '@mui/icons-material';
import { ITechnician } from '@app-models';
import AppDataGrid from '../../components/tables/AppDataGrid';
import { TechniciansPageContextProps } from '@app-interfaces';
import {
  clearCreateTechnicianStatus,
  clearDeleteTechnicianStatus,
  clearGetTechniciansStatus,
  clearUpdateTechnicianStatus,
} from '../../store/reducers/technicianReducer';
import useTechnician from '../../hooks/useTechnician';
import technicianModel from '../../components/forms/models/technicianModel';
import { AppCan } from '../../context/AbilityContext';
import AppModal from '../../components/modal/AppModal';
import { Formik } from 'formik';
import CreateTechnicianForm from '../../components/forms/technician/CreateTechnicianForm';
import AppAlert from '../../components/alerts/AppAlert';
import TechnicianPage from './TechnicianPage';
import { MESSAGES } from '../../config/constants';

export const TechniciansPageContext = createContext<TechniciansPageContextProps | null>(null);

function TechniciansPage() {
  const technician = useTechnician();

  const technicianReducer = useAppSelector(state => state.technicianReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearGetTechniciansStatus());
      dispatch(clearCreateTechnicianStatus());
      dispatch(clearDeleteTechnicianStatus());
      dispatch(clearUpdateTechnicianStatus());
      technician.setInitialValues({
        active: false,
        confirmPassword: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        phone: '',
      });
      technician.setJob(null);
      technician.setDetail(null);
      technician.setShowEdit(false);
      technician.setShowView(false);
      technician.setShowViewJob(false);
      technician.setShowCreate(false);
      technician.setShowDelete(false);
      technician.setError(undefined);
      technician.setSuccess(undefined);
    };
    // eslint-disable-next-line
  }, [dispatch]);

  const getTechnicians = useMemo(() => {
    return technicianReducer.technicians;
  }, [technicianReducer.technicians]);

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
          return param ? `${param.row.firstName} ${param.row.lastName}` : '';
        },
      },
      {
        field: 'active',
        headerName: 'Active',
        headerAlign: 'center',
        align: 'center',
        type: 'boolean',
        width: 100,
        sortable: true,
      },
      {
        field: 'email',
        headerName: 'Email',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
        valueGetter: param => {
          return param ? param.value : '';
        },
      },
      {
        field: 'phone',
        headerName: 'Phone Number',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
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
        valueGetter: ({ value }) => value && moment(value).format('LLL'),
        sortable: true,
      },
      {
        field: 'updatedAt',
        headerName: 'Modified Date',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        type: 'string',
        valueGetter: ({ value }) => value && moment(value).format('LLL'),
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
            onClick={() => technician.handleView(params.row)}
            label="View"
            showInMenu={false}
          />,

          <GridActionsCellItem
            key={1}
            icon={<Edit sx={{ color: 'limegreen' }} />}
            onClick={() => {
              const row = params.row;

              technician.setShowEdit(true);
              technician.setTechId(row.id);
              technician.setInitialValues(prevState => ({
                ...prevState,
                active: row.active,
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                phone: row.phone,
              }));
            }}
            label="Edit"
            showInMenu={false}
          />,
          <GridActionsCellItem
            key={2}
            icon={<Cancel sx={{ color: 'indianred' }} />}
            onClick={() => {
              technician.setShowDelete(true);
              technician.setDetail(params.row);
            }}
            label="Delete"
            showInMenu={false}
          />,
        ],
      },
    ] as GridColDef<ITechnician>[];
  }, [technician]);

  return (
    <TechniciansPageContext.Provider
      value={{
        showCreate: technician.showCreate,
        setShowCreate: technician.setShowCreate,
        showEdit: technician.showEdit,
        setShowEdit: technician.setShowEdit,
        showDelete: technician.showDelete,
        setShowDelete: technician.setShowDelete,
        showView: technician.showView,
        setShowView: technician.setShowView,
        detail: technician.detail,
        setDetail: technician.setDetail,
        showViewJob: technician.showViewJob,
        setShowViewJob: technician.setShowViewJob,
        job: technician.job,
        setJob: technician.setJob,
      }}>
      <Box>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Technicians
            </Typography>
          </Grid>
          <Grid item>
            <AppCan I="manage" a="technician">
              <Button
                onClick={() => technician.setShowCreate(true)}
                variant="outlined"
                color="success"
                endIcon={<PersonAdd />}>
                Create
              </Button>
            </AppCan>
          </Grid>
        </Grid>
        <Stack
          direction="column"
          spacing={5}
          justifyContent="center"
          alignItems="center"
          divider={<Divider orientation="horizontal" flexItem />}>
          <Stack direction="row" sx={{ width: '100%' }}>
            <AppDataGrid
              loading={technicianReducer.getTechniciansStatus === 'loading'}
              rows={getTechnicians}
              columns={columns}
              showToolbar
            />
          </Stack>
        </Stack>
      </Box>
      <AppModal
        fullWidth
        size="md"
        show={technician.showCreate}
        Content={
          <Formik
            onSubmit={technician.handleCreate}
            initialValues={technicianModel.initialValues}
            validationSchema={technicianModel.schema[0]}>
            <CreateTechnicianForm isSubmitting={technician.loading} />
          </Formik>
        }
        onClose={() => technician.setShowCreate(false)}
      />
      <AppModal
        fullWidth
        size="md"
        show={technician.showEdit}
        Content={
          <Formik
            onSubmit={technician.handleEdit}
            initialValues={technician.initialValues}
            validationSchema={technicianModel.schema[1]}
            enableReinitialize>
            <CreateTechnicianForm isSubmitting={technician.loading} />
          </Formik>
        }
        onClose={() => technician.setShowEdit(false)}
      />
      <AppModal
        fullWidth
        fullScreen
        show={technician.showView}
        Content={<TechnicianPage />}
        onClose={() => technician.setShowView(false)}
      />
      <AppModal
        fullWidth
        show={technician.showDelete}
        Content={<DialogContentText>{MESSAGES.cancelText}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button onClick={() => technician.setShowDelete(false)}>Disagree</Button>
            <Button onClick={technician.handleDelete}>Agree</Button>
          </DialogActions>
        }
        onClose={() => technician.setShowDelete(false)}
      />
      <AppAlert
        alertType="error"
        show={technician.error !== undefined}
        message={technician.error?.message}
        onClose={() => technician.setError(undefined)}
      />
      <AppAlert
        alertType="success"
        show={technician.success !== undefined}
        message={technician.success?.message}
        onClose={() => technician.setSuccess(undefined)}
      />
    </TechniciansPageContext.Provider>
  );
}

export default TechniciansPage;
