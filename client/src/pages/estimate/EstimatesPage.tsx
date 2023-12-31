/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react';
import { IEstimate } from '@app-models';
import { Button, Chip, DialogActions, DialogContentText, Grid, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAppSelector from '../../hooks/useAppSelector';
import AppAlert from '../../components/alerts/AppAlert';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Cancel, Edit } from '@mui/icons-material';
import { Formik } from 'formik';
import AppModal from '../../components/modal/AppModal';
import estimateModel from '../../components/forms/models/estimateModel';
import EstimateForm from '../../components/forms/estimate/EstimateForm';
import useEstimate from '../../hooks/useEstimate';
import { useNavigate } from 'react-router-dom';
import useAdmin from '../../hooks/useAdmin';
import { ESTIMATE_STATUS, MESSAGES } from '../../config/constants';
import {
  clearCreateEstimateStatus,
  clearGetEstimateStatus,
  clearSaveEstimateStatus,
  clearSendDraftEstimateStatus,
  clearUpdateEstimateStatus,
} from '../../store/reducers/estimateReducer';
import useAppDispatch from '../../hooks/useAppDispatch';
import EstimatePageContext from '../../context/EstimatePageContext';
import AppLoader from '../../components/loader/AppLoader';
import { getEstimatesAction } from '../../store/actions/estimateActions';
import { reload } from '../../utils/generic';

function EstimatesPage() {
  const estimateReducer = useAppSelector(state => state.estimateReducer);
  const dispatch = useAppDispatch();
  const [_estimate, _seEstimate] = useState<any>([]);
  const [closeEstimateModal, setCloseEstimateModal] = useState<boolean>(false);
  const [removeSessionStorage, setRemoveSessionStorage] = useState<boolean>(false);

  const estimate = useEstimate();
  const { isTechAdmin, isSuperAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const _temp01 = estimate.estimates;

    _seEstimate(_temp01);
  }, [estimate.estimates]);

  const superAdminColumns = useMemo(() => {
    return [
      {
        field: 'createdAt',
        headerName: 'Date',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).format('DD/MM/YYYY') : '-';
        },
        sortable: true,
        sortingOrder: ['desc'],
      },
      {
        field: 'code',
        headerName: 'Estimate #',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'string',
        width: 150,
      },
      {
        field: 'name',
        headerName: 'Name of workshop',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
        valueGetter: param => {
          const partner = param.row.partner;

          return partner ? `${partner?.name}` : '';
        },
      },
      {
        field: 'fullName',
        headerName: 'Customer Name',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 250,
        sortable: true,
        valueGetter: param => {
          const driver = param.row.rideShareDriver;
          const customer = param.row.customer;

          return driver
            ? `${driver?.firstName || ''} ${driver?.lastName || ''}`
            : `${customer?.firstName || ''} ${customer?.lastName || ''}`;
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

          return vehicle ? `${vehicle?.modelYear} ${vehicle?.make} ${vehicle?.model} (${vehicle.plateNumber})` : '-';
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
        field: 'updatedAt',
        headerName: 'Last Modified',
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
      //   field: 'actions',
      //   type: 'actions',
      //   headerAlign: 'center',
      //   align: 'center',
      //   getActions: (params: any) => {
      //     const row = params.row as IEstimate;

      //     return [
      //       <GridActionsCellItem
      //         key={0}
      //         icon={<Visibility sx={{ color: 'dodgerblue' }} />}
      //         onClick={() => {
      //           void dispatch(getEstimatesAction());
      //           navigate(`/estimates/${row.id}`, { state: { estimate: row } });
      //         }}
      //         label="View"
      //         showInMenu={false}
      //       />,

      //       <GridActionsCellItem
      //         sx={{ display: isTechAdmin ? 'block' : 'none' }}
      //         key={1}
      //         icon={<Edit sx={{ color: 'limegreen' }} />}
      //         onClick={() => estimate.onEdit(row.id)}
      //         //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}
      //         disabled={!isTechAdmin}
      //         label="Edit"
      //         showInMenu={false}
      //       />,
      //       <GridActionsCellItem
      //         sx={{ display: isTechAdmin ? 'block' : 'none' }}
      //         key={2}
      //         icon={<Cancel sx={{ color: 'indianred' }} />}
      //         onClick={() => estimate.onDelete(row.id)}
      //         label="Delete"
      //         disabled={row.status === ESTIMATE_STATUS.invoiced}
      //         showInMenu={false}
      //       />,
      //     ];
      //   },
      // },
    ] as GridColDef<IEstimate>[];
  }, [isSuperAdmin, dispatch, navigate, estimate]);

  const techColumns = useMemo(() => {
    return [
      {
        field: 'createdAt',
        headerName: 'Date',
        headerAlign: 'center',
        align: 'center',
        width: 160,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).format('DD/MM/YYYY') : '-';
        },
        sortable: true,
        sortingOrder: ['desc'],
      },
      {
        field: 'code',
        headerName: 'Estimate #',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'string',
        width: 150,
        renderCell: params => {
          const code = params.row.code;
          const result = code.split('_')[0];
          return (
            <span
              style={{ color: 'skyblue', cursor: 'pointer' }}
              onClick={() => {
                void dispatch(getEstimatesAction());
                navigate(`/estimates/${params.row.id}`, { state: { estimate: params.row } });
              }}>
              {result}
            </span>
          );
        },
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

          return driver
            ? `${driver?.firstName || ''} ${driver?.lastName || ''}`
            : `${customer?.firstName || ''} ${customer?.lastName || ''}`;
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

          return vehicle ? `${vehicle?.modelYear} ${vehicle?.make} ${vehicle?.model} (${vehicle.plateNumber})` : '-';
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
        field: 'status',
        headerName: 'Status',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 100,
        sortable: true,
        renderCell: params => {
          return params.row.status === ESTIMATE_STATUS.sent 
          ? (<Chip label={ESTIMATE_STATUS.sent} size="small" color="info" />) 
          : params.row.status === ESTIMATE_STATUS.draft 
            ? (<Chip label={ESTIMATE_STATUS.draft} size="small" color="warning" />) 
            : params.row.status === ESTIMATE_STATUS.invoiced 
              ? (<Chip label={ESTIMATE_STATUS.invoiced} size="small" color="success" />) 
              : null;
        },
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
      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        getActions: (params: any) => {
          const row = params.row as IEstimate;

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

            <GridActionsCellItem
              sx={{ display: isTechAdmin ? 'block' : 'none' }}
              key={1}
              icon={<Edit sx={{ color: 'limegreen' }} />}
              onClick={() => estimate.onEdit(row.id)}
              //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}
              disabled={!isTechAdmin}
              label="Edit"
              showInMenu={false}
            />,
            <GridActionsCellItem
              sx={{ display: isTechAdmin ? 'block' : 'none' }}
              key={2}
              icon={<Cancel sx={{ color: 'indianred' }} />}
              onClick={() => estimate.onDelete(row.id)}
              label="Delete"
              disabled={row.status === ESTIMATE_STATUS.invoiced}
              showInMenu={false}
            />,
          ];
        },
      },
    ] as GridColDef<IEstimate>[];
  }, [isTechAdmin, dispatch, navigate, estimate]);

  useEffect(() => {
    return () => {
      dispatch(clearCreateEstimateStatus());
      dispatch(clearSaveEstimateStatus());
      dispatch(clearUpdateEstimateStatus());
      dispatch(clearSendDraftEstimateStatus());
      dispatch(clearGetEstimateStatus());
    };
  }, [dispatch]);

  const data: any = {
    open_modal: undefined,
    id: undefined,
  };

  useEffect(() => {
    if (removeSessionStorage) {
      Object.keys(data).forEach(key => {
        sessionStorage.removeItem(key);
      });
    }
  }, [removeSessionStorage]);

  useEffect(() => {
    if (sessionStorage.getItem('open_modal') === 'true') {
      estimate.setShowCreate(true);
    }
  }, []);

  // remove open modal and id from session storage on page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('open_modal');
      sessionStorage.removeItem('id');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
        {isTechAdmin && (
          <Grid item>
            <Button
              variant="outlined"
              color="success"
              size="small"
              onClick={() => estimate.setShowCreate(true)}
              sx={{
                mb: { sm: 0, xs: 2 },
              }}>
              Generate
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <AppDataGrid
            rows={estimate.estimates}
            columns={isSuperAdmin ? superAdminColumns : techColumns}
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
      {estimate.showCreate && (
        <AppModal
          fullWidth
          size={document.documentElement.clientWidth > 375 ? 'xl' : undefined}
          fullScreen={true}
          show={estimate.showCreate}
          Content={
            <Formik
              initialValues={estimate.initialValues}
              validationSchema={estimateModel.schema}
              validateOnChange
              onSubmit={(values, formikHelpers) => {
                if (estimate.save) {
                  estimate.handleSaveEstimate(values, formikHelpers);
                } else estimate.handleCreateEstimate(values, formikHelpers);
              }}>
              <EstimateForm
                showCreate={estimate.showCreate}
                isPopUp={true}
                setLabourTotal={estimate.setLabourTotal}
                setPartTotal={estimate.setPartTotal}
                setGrandTotal={estimate.setGrandTotal}
                setDiscount={estimate.setDiscount}
                setDiscountType={estimate.setDiscountType}
                labourTotal={estimate.labourTotal}
                partTotal={estimate.partTotal}
                grandTotal={estimate.grandTotal}
                isSubmitting={
                  estimateReducer.createEstimateStatus === 'loading' || estimateReducer.saveEstimateStatus === 'loading'
                }
                setSave={estimate.setSave}
              />
            </Formik>
          }
          // onClose={() => estimate.setShowCreate(false)}
          onClose={() => setCloseEstimateModal(true)}
        />
      )}
      {estimate.showEdit && (
        <AppModal
          fullWidth
          size={document.documentElement.clientWidth > 375 ? 'xl' : undefined}
          fullScreen={true}
          show={estimate.showEdit}
          Content={
            <Formik
              initialValues={estimate.initialValues}
              validationSchema={estimateModel.schema}
              onSubmit={(values, formikHelpers) => {
                if (estimate.save) estimate.handleUpdateEstimate(values, formikHelpers);
                if (!estimate.save) estimate.handleSendDraftEstimate(values, formikHelpers);
              }}
              enableReinitialize
              validateOnChange>
              <EstimateForm
                showEdit={estimate.showEdit}
                setDiscount={estimate.setDiscount}
                setDiscountType={estimate.setDiscountType}
                isPopUp={true}
                setLabourTotal={estimate.setLabourTotal}
                setPartTotal={estimate.setPartTotal}
                setGrandTotal={estimate.setGrandTotal}
                labourTotal={estimate.labourTotal}
                partTotal={estimate.partTotal}
                grandTotal={estimate.grandTotal}
                isSubmitting={
                  estimateReducer.updateEstimateStatus === 'loading' ||
                  estimateReducer.sendDraftEstimateStatus === 'loading'
                }
                setSave={estimate.setSave}
              /> 
            </Formik>
          }
          // onClose={() => estimate.setShowEdit(false)}
          onClose={() => setCloseEstimateModal(true)}
        />
      )}
      <AppModal
        fullWidth
        show={estimate.showDelete}
        Content={<DialogContentText>{MESSAGES.cancelText}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button onClick={() => estimate.setShowDelete(false)}>Disagree</Button>
            <Button onClick={estimate.handleDelete}>Agree</Button>
          </DialogActions>
        }
        onClose={() => estimate.setShowDelete(false)}
      />
      {closeEstimateModal && (
        <AppModal
          fullWidth
          show={closeEstimateModal}
          Content={<DialogContentText>{MESSAGES.closeEstimateModal}</DialogContentText>}
          ActionComponent={
            <DialogActions>
              <Button
                onClick={() => {
                  setCloseEstimateModal(false),
                    estimate.setShowCreate(false),
                    estimate.setShowEdit(false),
                    reload(),
                    setRemoveSessionStorage(true);
                }}>
                Yes
              </Button>
              <Button onClick={() => setCloseEstimateModal(false)}>No</Button>
            </DialogActions>
          }
          onClose={() => setCloseEstimateModal(false)}
        />
      )}
      <AppLoader show={estimateReducer.deleteEstimateStatus === 'loading'} />
    </EstimatePageContext.Provider>
  );
}

export default EstimatesPage;
