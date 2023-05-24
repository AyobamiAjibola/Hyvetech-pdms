import { Box, Button, FormLabel, Grid, Input, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import DataCard from '../../components/data/DataCard';
import { cyan, green, lime, teal } from '@mui/material/colors';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Edit } from '@mui/icons-material';
import moment from 'moment';
import AppDataGrid from '../../components/tables/AppDataGrid';
import AppModal from '../../components/modal/AppModal';
import AppAlert from '../../components/alerts/AppAlert';
import {
  getAccountBalanceAction,
  getAccountTransactionsAction,
  requestActivationAction,
  uploadFile,
} from '../../store/actions/autoHyveActions';
import useAppDispatch from '../../hooks/useAppDispatch';
import { LoadingButton } from '@mui/lab';
import useAppSelector from '../../hooks/useAppSelector';
import useAdmin from '../../hooks/useAdmin';
import { getPartnerAction } from '../../store/actions/partnerActions';
import { formatNumberToIntl } from '../../utils/generic';
import { DateRange } from '@mui/x-date-pickers-pro';
import { UploadResult } from '@app-models';
import TransferDialog from './TransferDialog';

const HyvePayDashboard = () => {
  const [openActivateModal, setOpenActivateModal] = useState(false);

  const autohyvePay = useAppSelector(state => state.autoHyveReducer);

  const dispatch = useAppDispatch();

  const [intiateTransfer, setIntiateTransfer] = useState(false);

  const [canInitiateTransfer, setCanIntiateTrafer] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [validIDFront, setValidIDFront] = useState<FileList | null>(null);
  const [validIDBack, setValidIDBack] = useState<FileList | null>(null);
  const [cacDoc, setCacDoc] = useState<FileList | null>(null);

  const [loading, setLoading] = useState(false);

  const [alerMessage, setAlert] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; message: string } | null>(
    null,
  );

  const admin = useAdmin();

  const partnerId = useMemo(() => {
    return admin.user?.partnerId;
  }, [admin.user]);

  const partnerReducer = useAppSelector(state => state.partnerReducer);

  useEffect(() => {
    if (partnerReducer.getPartnerStatus === 'idle') {
      if (partnerId) dispatch(getPartnerAction(partnerId));
    }
  }, [dispatch, partnerId, partnerReducer.getPartnerStatus]);

  const handleOnActivate = async () => {
    try {
      if (businessName.trim() === '') return setAlert({ type: 'info', message: 'Please provide your business name' });

      if (!validIDFront) return setAlert({ type: 'info', message: 'Please upload the front picture of a valid ID' });

      if (!validIDBack) return setAlert({ type: 'info', message: 'Please upload the back picture of a valid ID' });

      // if (!cacDoc) return setAlert({ type: 'info', message: 'Please upload your CAC document' });

      setLoading(true);

      const formData1 = new FormData();

      formData1.append('file', validIDFront[0]);

      const validIDFrontResult = await uploadFile(formData1);

      const formData2 = new FormData();
      formData2.append('file', validIDBack[0]);
      const validIDBackResult = await uploadFile(formData2);
      let cacDOcResult: UploadResult | null = null;
      if (cacDoc) {
        const formData3 = new FormData();
        formData3.append('file', cacDoc[0]);

        cacDOcResult = await uploadFile(formData3);
      }

      dispatch(
        requestActivationAction({
          businessName,
          cacUrl: cacDOcResult?.file?.url || '',
          validIdBackUrl: validIDBackResult.file.url,
          validIdFrontUrl: validIDFrontResult.file.url,
        }),
      );
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autohyvePay.requestAccountActivationStatus === 'completed') {
      setOpenActivateModal(false);
      setLoading(false);
      setAlert({
        type: 'success',
        message:
          'Activation request submitted successfully. Your account will be activated within 4 hours after verification is complete.',
      });
      if (partnerId) dispatch(getPartnerAction(partnerId));
    } else if (autohyvePay.requestAccountActivationStatus === 'failed') {
      setLoading(false);
    }
  }, [autohyvePay.requestAccountActivationStatus]);

  useEffect(() => {
    if (partnerReducer.partner?.accountProvisionStatus === 'APPROVED') {
      setCanIntiateTrafer(true);
      dispatch(getAccountBalanceAction());
      dispatch(getAccountTransactionsAction());
    }
  }, [dispatch, partnerReducer.partner?.accountProvisionStatus]);

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
        field: 'accountNumber',
        headerName: 'Account number',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        sortable: true,
      },
      {
        field: 'amount',
        headerName: 'Amount',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        sortable: true,
        valueFormatter: ({ value }) => {
          return value ? value / 100 : '0';
        },
      },
      {
        field: 'openingBalance',
        headerName: 'Opening Balance',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        sortable: true,
        width: 300,
        valueFormatter: ({ value }) => {
          return value ? value / 100 : '0';
        },
        renderCell: params => {
          return params.row.status;
        },
      },
      {
        field: 'balanceAfter',
        headerName: 'Balance After',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 300,
        sortable: true,
        valueFormatter: ({ value }) => {
          return value ? value / 100 : '0';
        },
        renderCell: params => {
          return params.row.status;
        },
      },
      {
        field: 'narration',
        headerName: 'Narration',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        sortable: true,
        width: 200,
        renderCell: params => {
          return params.row.status;
        },
      },
      {
        field: 'postingRecordType',
        headerName: 'Type',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        sortable: true,
        renderCell: params => {
          return params.row.status;
        },
      },

      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        getActions: (params: any) => {
          const row = params.row as any;
          console.log('row> ', row);
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
              icon={<Edit sx={{ color: 'limegreen' }} />}
              //  onClick={() => estimate.onEdit(row.id)}
              //disabled={!isTechAdmin || row.status === ESTIMATE_STATUS.invoiced}
              //  disabled={!isTechAdmin}
              label="Edit"
              showInMenu={false}
            />,
          ];
        },
      },
    ] as GridColDef<any>[];
  }, []);

  const handleOnDateChange = (value: DateRange<Date>) => {
    const dateIsInComplete = value.some(item => item === null);

    if (dateIsInComplete) return;

    dispatch(
      getAccountTransactionsAction({
        startDate: moment(value[0]).format('DD/MM/YYYY'),
        endDate: moment(value[1]).format('DD/MM/YYYY'),
      }),
    );
  };

  const handleOnTransferClose = () => {
    dispatch(getAccountBalanceAction());
    dispatch(getAccountTransactionsAction());
    setIntiateTransfer(false);
  };

  const renderActivateButton = () => {
    if (!partnerReducer.partner?.accountProvisionStatus) return null;
    if (partnerReducer.partner?.accountProvisionStatus === 'NOT_REQUESTED')
      return (
        <Button onClick={() => setOpenActivateModal(true)} color="error" variant="contained">
          Activate Account
        </Button>
      );
    if (partnerReducer.partner?.accountProvisionStatus === 'PENDING')
      return (
        <Button disabled={true} onClick={() => setOpenActivateModal(true)} color="error" variant="contained">
          Activate Account
        </Button>
      );
    if (partnerReducer.partner?.accountProvisionStatus === 'APPROVED') return null;
    if (partnerReducer.partner?.accountProvisionStatus === 'DECLINED') return null;
  };
  return (
    <React.Fragment>
      <Typography variant="h4" gutterBottom>
        HyvePay
      </Typography>
      <Box
        component="div"
        sx={{
          display: 'flex',
          width: { sm: '100%', xs: document.documentElement.clientWidth },
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: { lg: 'row', xs: 'column' },
            // justifyContent: 'center',
            width: { lg: '100%', xs: '50%' },
            gap: { lg: 3, md: 2, xs: 2 },
            ml: { lg: 10 },
            mb: { md: 3 },
            justifyContent: 'end',
          }}
          container>
          <Grid item>{renderActivateButton()}</Grid>
          <Grid item>
            <Button
              onClick={() => setIntiateTransfer(true)}
              disabled={!canInitiateTransfer}
              color="success"
              variant="outlined">
              Initiate Transaction
            </Button>
          </Grid>
          <Grid item>
            <DateRangePicker onChange={handleOnDateChange} localeText={{ start: 'Start Date', end: 'End Date' }} />
          </Grid>
        </Grid>
      </Box>
      <Box
        component="div"
        sx={{
          display: 'flex',
          width: { sm: '100%', xs: document.documentElement.clientWidth },
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Grid
          item
          sx={{
            display: 'flex',
            flexDirection: { lg: 'row', xs: 'column' },
            flexWrap: 'wrap',
            // justifyContent: 'center',
            width: { lg: '100%', xs: '50%' },
            gap: { lg: 2, md: 2, xs: 2 },
            ml: { lg: 10 },
          }}>
          <DataCard
            title={`${autohyvePay.account.accountName} - ${autohyvePay.account.accountProvider}`}
            data={autohyvePay.account.accountNumber}
            bgColor={green[400]}
          />
          <DataCard
            title="Available Balance"
            data={'₦ ' + formatNumberToIntl(autohyvePay.account.availableBalance / 100)}
            bgColor={teal[400]}
            toggleValue
          />
          <DataCard
            title="Total Credit"
            data={'₦ ' + formatNumberToIntl(autohyvePay.transaction.totalCredit / 100)}
            bgColor={cyan[400]}
            toggleValue
          />
          <DataCard
            title="Total Debit"
            data={'₦ ' + formatNumberToIntl(autohyvePay.transaction.totalDebit)}
            bgColor={lime[400]}
            toggleValue
          />
        </Grid>
      </Box>
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
              loading={autohyvePay.getAllAccountTransactionStatus === 'loading'}
              rows={autohyvePay.transaction.postingsHistory || []}
              columns={techColumns}
              showToolbar
            />
          </Grid>
        </Grid>
      </Box>

      {openActivateModal && (
        <AppModal
          size={document.documentElement.clientWidth > 375 ? 'lg' : 'md'}
          fullScreen={false}
          show={openActivateModal}
          fullWidth={true}
          title="Activate Account"
          Content={
            <React.Fragment>
              <div style={{ marginBottom: 20 }}>
                <TextField
                  margin="dense"
                  id="businessName"
                  label="Business Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <FormLabel>Valid Identity Card(Front)</FormLabel> <br />
                <Input onChange={(e: any) => setValidIDFront(e.target.files)} type="file" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <FormLabel>Valid Identity Card(Back)</FormLabel> <br />
                <Input onChange={(e: any) => setValidIDBack(e.target.files)} type="file" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <FormLabel>CAC </FormLabel> <br />
                <Input onChange={(e: any) => setCacDoc(e.target.files)} type="file" />
              </div>
              <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'end' }}>
                <LoadingButton
                  loading={loading}
                  disabled={loading}
                  onClick={handleOnActivate}
                  type="submit"
                  variant="contained">
                  Activate
                </LoadingButton>
              </div>
            </React.Fragment>
          }
          onClose={() => setOpenActivateModal(false)}
        />
      )}

      <TransferDialog show={intiateTransfer} onClose={handleOnTransferClose} />

      <AppAlert
        onClose={() => setAlert(null)}
        alertType={alerMessage ? alerMessage.type : 'info'}
        show={alerMessage !== null}
        message={alerMessage?.message || ''}
      />
    </React.Fragment>
  );
};

export default HyvePayDashboard;
