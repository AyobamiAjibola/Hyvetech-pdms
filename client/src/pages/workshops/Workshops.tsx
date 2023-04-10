import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import usePartner from '../../hooks/usePartner';
import useAdmin from '../../hooks/useAdmin';
import { IPartner } from '@app-models';
import { Box, Button, DialogActions, DialogContentText, Divider, Grid, Stack, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useEstimate from '../../hooks/useEstimate';
import useInvoice from '../../hooks/useInvoice';
import { Delete, ToggleOff, ToggleOn, Visibility } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import AppModal from '../../components/modal/AppModal';
import { MESSAGES } from '../../config/constants';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { CustomHookMessage } from '@app-types';
import { deletePartnerAction, togglePartnerAction } from '../../store/actions/partnerActions';
import AppAlert from '../../components/alerts/AppAlert';
import { clearDeletePartnerStatus, clearTogglePartnerStatus } from '../../store/reducers/partnerReducer';
import { reload } from '../../utils/generic';

function Workshops() {
  const navigate = useNavigate();
  const partners = usePartner();
  const { isSuperAdmin } = useAdmin();
  const estimate = useEstimate()
  const invoice = useInvoice()
  const [id, setId] = useState<number>();
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [_timeout, _setTimeout] = useState<NodeJS.Timer>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();

  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const dispatch = useAppDispatch();

  const onDelete = (partnerId?: number) => {
    setId(partnerId);
    setShowDelete(true);
  };

  const handleDelete = () => {
    if (id) dispatch(deletePartnerAction(id));
    setShowDelete(false);
  };

  const handleToggleAccount = (id: any) => {
    if (id) dispatch(togglePartnerAction(id));
  };

  console.log(partnerReducer.deletePartnerStatus)
  useEffect(() => {
    if (partnerReducer.deletePartnerStatus === 'completed') {
      setSuccess({ message: partnerReducer.deletePartnerSuccess });

      _setTimeout(setTimeout(() => navigate(-1), 1000));
    }
  }, [navigate, partnerReducer.deletePartnerStatus, partnerReducer.deletePartnerSuccess]);

  useEffect(() => {
    if (partnerReducer.deletePartnerStatus === 'failed') {
      if (partnerReducer.deletePartnerError) setError({ message: partnerReducer.deletePartnerError });
    }
  }, [partnerReducer.deletePartnerStatus, partnerReducer.deletePartnerError]);
  console.log(success)
  useEffect(() => {
    if (partnerReducer.togglePartnerStatus === 'completed') {
      setSuccess({ message: partnerReducer.togglePartnerSuccess });

      _setTimeout(setTimeout(() => reload(), 1000));
    }
  }, [navigate, partnerReducer.togglePartnerStatus, partnerReducer.togglePartnerSuccess]);

  useEffect(() => {
    if (partnerReducer.togglePartnerStatus === 'failed') {
      if (partnerReducer.togglePartnerError) setError({ message: partnerReducer.togglePartnerError });
    }
  }, [partnerReducer.togglePartnerStatus, partnerReducer.togglePartnerError]);

  useEffect(() => {
    return () => {
      dispatch(clearDeletePartnerStatus());
      dispatch(clearTogglePartnerStatus());
      clearTimeout(_timeout);
    };
  }, [_timeout, dispatch]);

  const getWorkshops = useMemo(() => {
    return [
      {
        field: 'createdAt',
        headerName: 'Date Joined',
        headerAlign: 'center',
        align: 'center',
        width: 150,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).format('DD/MM/YYYY') : '-';
        },
        sortable: true,
        sortingOrder: ['desc'],
      },
      {
        field: 'id',
        headerName: 'Workshop ID',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 100,
        sortable: true,
      },
      {
        field: 'name',
        headerName: 'Name of workshop',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 150,
        sortable: true,
      },
      {
        field: 'state',
        headerName: 'State',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 150,
        sortable: true,
        valueGetter: params => {
          return params.row.contact ? params.row.contact.state : '';
        },
      },
      {
        field: 'email',
        headerName: 'Email ID',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 150,
        sortable: true,
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
        field: 'estimateCount',
        headerName: 'Estimate Count',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
        valueGetter: param => {
          let count = 0;
          const id = param.row.id;
          estimate.estimates.map((data: any) => {
            if(data.partnerId === id){
              count++
            }
          })
          return count;
        },
      },
      {
        field: 'invoiceCount',
        headerName: 'Invoice Count',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
        valueGetter: param => {
          let count = 0;
          const id = param.row.id;

          invoice.invoices.map((data: any) => {
            if(data.estimate?.partnerId === id){
              count++
            }
          })
          return count;
        },
      },
      {
        field: 'grandTotal',
        headerName: 'Sales volume',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
        valueGetter: param => {
          let amount = 0;
          const id = param.row.id;

          invoice.invoices.map((data: any) => {
            if(data.estimate?.partnerId === id){
              amount = amount + data.grandTotal
            }
          })
          return amount;
        },
      },
      {
        field: 'view',
        headerName: '',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        renderCell: params => {
          return (
            <Link style={{ color: 'dodgerblue', cursor: 'pointer' }} to={`/workshop/${params.row.id}`}>
              <Visibility/>
            </Link>
          );
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        getActions: (params: any) => {
          const row = params.row

          return [
            <GridActionsCellItem
              sx={{ display: 'block' }}
              key={1}
              icon={<Delete sx={{ color: 'red' }} />}
              onClick={() => onDelete(row.id)}
              label="Delete"
              showInMenu={false}
            />,
            <GridActionsCellItem
              sx={{ display: 'block' }}
              key={2}
              onClick={() => handleToggleAccount(row.id)}
              icon={row?.users[0]?.active ? <ToggleOn color="success" /> : <ToggleOff color="warning" />}
              label="Toggle"
              showInMenu={false}
            />,
          ];
        },
      },
    ] as GridColDef<IPartner>[];
  }, [partners, isSuperAdmin, estimate.estimates, invoice.invoices])

  return (
    <Box>
      <Grid container justifyContent="left" alignItems="center">
        <Grid item xs={9}>
          <Typography variant="h4" gutterBottom
            sx={{
              fontWeight: 600
            }}
          >
            Workshops
          </Typography>
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
            loading={partners.loading}
            rows={partners.rows}
            columns={ isSuperAdmin ? getWorkshops : []}
            showToolbar
            sortModel={partners.sortModel}
            onSortModel={partners.setSortModel}
            checkboxSelection
            disableSelectionOnClick
          />
        </Stack>
      </Stack>

      <AppModal
        fullWidth
        show={showDelete}
        Content={<DialogContentText>{MESSAGES.cancelText}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button onClick={() => setShowDelete(false)}>Disagree</Button>
            <Button onClick={handleDelete}>Agree</Button>
          </DialogActions>
        }
        onClose={() => setShowDelete(false)}
      />

      <AppAlert
        alertType="success"
        show={undefined !== success}
        message={success?.message}
        onClose={() => setSuccess(undefined)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
    </Box>
  );
}

export default Workshops;
