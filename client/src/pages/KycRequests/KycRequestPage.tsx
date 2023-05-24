import React, { useEffect, useMemo, useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getKycRequestAction, performAccountActivation } from '../../store/actions/autoHyveActions';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Check, Pageview } from '@mui/icons-material';
import { AccountActivateRequest } from '@app-models';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAppSelector from '../../hooks/useAppSelector';
import { Link } from 'react-router-dom';
import AppAlert from '../../components/alerts/AppAlert';

const KycRequestPage = () => {
  const dispatch = useAppDispatch();

  const autohyvePay = useAppSelector(state => state.autoHyveReducer);
  const [alerMessage, setAlert] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; message: string } | null>(
    null,
  );

  useEffect(() => {
    dispatch(getKycRequestAction());
  }, []);

  useEffect(() => {
    if (autohyvePay.activateAccountStatus === 'completed') {
      setAlert({ type: 'success', message: 'Operation successful' });
      dispatch(getKycRequestAction());
    } else if (autohyvePay.activateAccountStatus === 'failed') {
      setAlert({ type: 'error', message: autohyvePay.activateAccountError || 'Unable to perform action' });
    }
  }, [autohyvePay.activateAccountStatus]);

  useEffect(() => {
    if (autohyvePay.getKycRequestStatus === 'failed') {
      setAlert({ type: 'error', message: autohyvePay.getKycRequestError || 'Unable to perform action' });
    }
  }, [autohyvePay.getKycRequestStatus]);

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
        field: 'partnerId',
        headerName: 'Partner',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        sortable: true,
        renderCell: params => {
          return (
            <Link style={{ color: 'skyblue', cursor: 'pointer' }} to={`/partner/${params.row.id}`}>
              {/* {`EXP - 00${params.row.partnerId}${params.row.expenseCode}`} */}
              {params.row.partnerId}
            </Link>
          );
        },
      },
      {
        field: 'businessName',
        headerName: 'Business Name',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        sortable: true,
        width: 300,
      },
      {
        field: 'cacUrl',
        headerName: 'CAC Doc',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        sortable: true,
        width: 200,
        renderCell: params => {
          return (
            <a style={{ color: 'skyblue', cursor: 'pointer' }} target="__blank" href={params.row.cacUrl}>
              {/* {`EXP - 00${params.row.partnerId}${params.row.expenseCode}`} */}
              <Pageview />
            </a>
          );
        },
      },
      {
        field: 'validIdBackUrl',
        headerName: 'Valid ID Back',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
        renderCell: params => {
          return (
            <Button onClick={() => window.open(params.row.validIdBackUrl, '_blank')}>
              <Pageview style={{ color: 'skyblue', cursor: 'pointer' }} />;
            </Button>
          );
        },
      },
      {
        field: 'isApproved',
        headerName: 'Status',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
        renderCell: params => {
          return params.row.isApproved ? (
            <Chip label={'Approved'} size="small" color="success" />
          ) : (
            <Chip label={'Pending Approval'} size="small" color="error" />
          );
        },
      },
      {
        field: 'validIdFrontUrl',
        headerName: 'Valid ID Front',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        sortable: true,
        width: 200,
        renderCell: params => {
          return (
            <a style={{ color: 'skyblue', cursor: 'pointer' }} target="__blank" href={params.row.validIdFrontUrl}>
              {/* {`EXP - 00${params.row.partnerId}${params.row.expenseCode}`} */}
              <Pageview />
            </a>
          );
        },
      },

      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        getActions: (params: any) => {
          const row = params.row as any;
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
              //  sx={{ display: isTechAdmin ? 'block' : 'none' }}
              key={1}
              icon={<Check sx={{ color: 'limegreen' }} />}
              onClick={() => dispatch(performAccountActivation(row.id))}
              //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}
              //  disabled={!isTechAdmin}
              label="Edit"
              showInMenu={false}
            />,
          ];
        },
      },
    ] as GridColDef<AccountActivateRequest>[];
  }, []);
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        KYC Requests
      </Typography>
      <Box
        component="div"
        sx={{
          display: 'flex',
          width: { sm: '100%', xs: document.documentElement.clientWidth },
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Grid container>
          <Grid
            sx={{
              display: 'flex',
              flexDirection: { lg: 'row', xs: 'column' },
              // justifyContent: 'center',
              width: { lg: '100%', xs: '50%' },
              gap: { lg: 8, md: 4, xs: 2 },
              ml: { lg: 10 },
            }}
            item
            xs={12}>
            <AppDataGrid
              loading={autohyvePay.getKycRequestStatus === 'loading'}
              rows={autohyvePay.accountRequests || []}
              columns={techColumns}
              showToolbar
            />
          </Grid>
        </Grid>
      </Box>
      <AppAlert
        onClose={() => setAlert(null)}
        alertType={alerMessage ? alerMessage.type : 'info'}
        show={alerMessage !== null}
        message={alerMessage?.message || ''}
      />
    </div>
  );
};

export default KycRequestPage;
