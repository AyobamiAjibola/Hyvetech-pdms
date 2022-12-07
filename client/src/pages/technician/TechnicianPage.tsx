import React, { Dispatch, FC, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TechniciansPageContext } from './TechniciansPage';
import { TechniciansPageContextProps } from '@app-interfaces';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  DialogActions,
  DialogContentText,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { AssignmentInd, Cancel, PlaylistAddCheck, Visibility } from '@mui/icons-material';
import { IJob } from '@app-models';
import useAdmin from '../../hooks/useAdmin';
import { JOB_STATUS, MESSAGES } from '../../config/constants';
import moment from 'moment';
import AppModal from '../../components/modal/AppModal';
import { useNavigate, useParams } from 'react-router-dom';
import useAppDispatch from '../../hooks/useAppDispatch';
import { cancelJobAction, reassignJobAction } from '../../store/actions/jobActions';
import AppLoader from '../../components/loader/AppLoader';
import useAppSelector from '../../hooks/useAppSelector';
import { CustomHookMessage } from '@app-types';
import AppAlert from '../../components/alerts/AppAlert';
import { getPartnerTechniciansAction, getTechniciansAction } from '../../store/actions/technicianActions';
import { ISelectData } from '../../components/forms/fields/SelectField';

interface Props {
  setShow?: Dispatch<SetStateAction<boolean>>;
}

const TechnicianPage: FC<Props> = ({ setShow }) => {
  const [cancelJob, setCancelJob] = useState<boolean>(false);
  const [reassignJob, setReassignJob] = useState<boolean>(false);
  const [jobId, setJobId] = useState<number>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();
  const [_technicians, _setTechnicians] = useState<ISelectData[]>([]);

  const admin = useAdmin();

  const { detail, setShowViewJob, showViewJob, job, setJob } = useContext(
    TechniciansPageContext,
  ) as TechniciansPageContextProps;

  const params = useParams();
  const navigate = useNavigate();

  const jobReducer = useAppSelector(state => state.jobReducer);
  const technicianReducer = useAppSelector(state => state.technicianReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (technicianReducer.getTechniciansStatus === 'idle') {
      if (params.id) {
        dispatch(getPartnerTechniciansAction(+params.id));
      } else dispatch(getTechniciansAction());
    }
  }, [dispatch, params.id, technicianReducer.getTechniciansStatus]);

  useEffect(() => {
    if (technicianReducer.getTechniciansStatus === 'completed') {
      _setTechnicians(
        technicianReducer.technicians
          .filter(tech => !tech.hasJob && tech.active)
          .map(tech => ({
            label: `${tech.firstName} ${tech.lastName}`,
            value: `${tech.id}`,
          })),
      );
    }
  }, [technicianReducer.getTechniciansStatus, technicianReducer.technicians]);

  useEffect(() => {
    let timer: NodeJS.Timer;

    if (jobReducer.cancelJobStatus === 'completed') {
      setSuccess({ message: jobReducer.cancelJobSuccess });

      if (params.id) {
        dispatch(getPartnerTechniciansAction(+params.id));
      } else dispatch(getTechniciansAction());

      timer = setTimeout(() => {
        if (setShow) setShow(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, jobReducer.cancelJobStatus, jobReducer.cancelJobSuccess, params.id, setShow]);

  useEffect(() => {
    if (jobReducer.cancelJobStatus === 'failed') {
      if (jobReducer.cancelJobError) setError({ message: jobReducer.cancelJobError });
    }
  }, [jobReducer.cancelJobError, jobReducer.cancelJobStatus]);

  useEffect(() => {
    let timer: NodeJS.Timer;

    if (jobReducer.reassignJobStatus === 'completed') {
      setSuccess({ message: jobReducer.reassignJobSuccess });

      if (params.id) {
        dispatch(getPartnerTechniciansAction(+params.id));
      } else dispatch(getTechniciansAction());

      timer = setTimeout(() => {
        if (setShow) setShow(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, jobReducer.reassignJobStatus, jobReducer.reassignJobSuccess, params.id, setShow]);

  useEffect(() => {
    if (jobReducer.reassignJobStatus === 'failed') {
      if (jobReducer.reassignJobError) setError({ message: jobReducer.reassignJobError });
    }
  }, [jobReducer.reassignJobError, jobReducer.reassignJobStatus]);

  const jobStatusCount = useMemo(() => {
    let pending = 0,
      complete = 0,
      inProgress = 0;

    if (detail) {
      pending = detail.jobs.filter(job => job.status === JOB_STATUS.pending).length;
      complete = detail.jobs.filter(job => job.status === JOB_STATUS.complete).length;
      inProgress = detail.jobs.filter(job => job.status === JOB_STATUS.inProgress).length;
    }

    return { pending, complete, inProgress };
  }, [detail]);

  const handleView = useCallback(
    (job: IJob) => {
      setJob(job);
      setShowViewJob(true);
    },
    [setJob, setShowViewJob],
  );

  const onCancelJob = useCallback(
    (job: IJob) => {
      setJobId(job.id);
      setJob(job);
      setCancelJob(true);
    },
    [setJob],
  );

  const onReassignJob = useCallback(
    (job: IJob) => {
      setJob(job);
      setReassignJob(true);
    },
    [setJob],
  );

  const handleCancelJob = () => {
    if (jobId && job) {
      setCancelJob(false);
      dispatch(
        cancelJobAction({
          partnerId: job.partnerId,
          data: {
            jobId,
            client: 'Driver',
          },
        }),
      );
    }
  };

  const handleViewJobCheckList = useCallback(
    (job: IJob) => navigate(`/job-check-list-report/${job.id}`, { state: { job } }),
    [navigate],
  );

  const handleReassignJob = (value: string) => {
    if (job && params.id) {
      const subscriptionId = job.rideShareDriverSubscriptionId
        ? job.rideShareDriverSubscriptionId
        : job.customerSubscriptionId;

      const client = job.rideShareDriverSubscriptionId ? 'Driver' : 'Customer';

      const data = {
        partnerId: +params.id as unknown as string,
        techId: +value,
        subscriptionId,
        checkListId: job.checkList.id,
        jobId: job.id,
        client,
      };

      dispatch(reassignJobAction(data));
    }
    setReassignJob(false);
  };

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
        field: 'type',
        headerName: 'Type',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'string',
        width: 180,
      },

      {
        field: 'status',
        headerName: 'Status',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'string',
        width: 150,
        renderCell: params => {
          const status = params.value;
          return status === JOB_STATUS.pending ? (
            <Chip label={status} color="warning" />
          ) : status === JOB_STATUS.inProgress ? (
            <Chip label={status} color="error" />
          ) : status === JOB_STATUS.complete ? (
            <Chip label={status} color="success" />
          ) : (
            ''
          );
        },
      },
      {
        field: 'jobDate',
        headerName: 'Completed Date',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'dateTime',
        width: 200,
        valueFormatter: params => {
          const date = params.value;
          return date ? moment(date).format('LLL') : '-';
        },
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'dateTime',
        width: 200,
        valueFormatter: params => {
          const date = params.value;
          return date ? moment(date).format('LLL') : '';
        },
      },

      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        getActions: (params: { row: IJob }) => {
          const job = params.row;

          return [
            <GridActionsCellItem
              key={0}
              icon={
                <Tooltip title="view job">
                  <Visibility sx={{ color: 'dodgerblue' }} />
                </Tooltip>
              }
              onClick={() => handleView(params.row)}
              label="View"
              showInMenu={false}
            />,

            <GridActionsCellItem
              hidden={!admin.isTechAdmin}
              key={1}
              icon={
                <Tooltip title="view report">
                  <PlaylistAddCheck sx={{ color: 'limegreen' }} />
                </Tooltip>
              }
              onClick={() => handleViewJobCheckList(params.row)}
              label="Edit"
              showInMenu={false}
              sx={{
                display: job.status === JOB_STATUS.complete ? 'block' : 'none',
              }}
            />,
            <GridActionsCellItem
              sx={{ display: job.status === JOB_STATUS.complete ? 'none' : 'block' }}
              key={2}
              icon={
                <Tooltip title="reassign job">
                  <AssignmentInd sx={{ color: 'yellowgreen' }} />
                </Tooltip>
              }
              onClick={() => onReassignJob(job)}
              label="View"
              showInMenu={false}
            />,
            <GridActionsCellItem
              sx={{ display: job.status === JOB_STATUS.complete ? 'none' : 'block' }}
              key={3}
              icon={
                <Tooltip title="cancel job">
                  <Cancel sx={{ color: 'orangered' }} />
                </Tooltip>
              }
              onClick={() => onCancelJob(job)}
              label="View"
              showInMenu={false}
            />,
          ];
        },
      },
    ] as GridColDef<IJob>[];
  }, [admin.isTechAdmin, handleView, handleViewJobCheckList, onCancelJob, onReassignJob]);

  return (
    <React.Fragment>
      {!detail ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ) : (
        <Stack spacing={4} divider={<Divider orientation="horizontal" />}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="body1">Jobs Pending</Typography>
                  <Typography variant="subtitle1">{jobStatusCount.pending}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="body1">Jobs In-Progress</Typography>
                  <Typography variant="subtitle1">{jobStatusCount.inProgress}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="body1">Jobs Completed</Typography>
                  <Typography variant="subtitle1">{jobStatusCount.complete}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5">Personal Information</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th">First Name</TableCell>
                      <TableCell component="td">{detail.firstName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Last Name</TableCell>
                      <TableCell component="td">{detail.lastName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Email</TableCell>
                      <TableCell component="td">{detail.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Phone Number</TableCell>
                      <TableCell component="td">{detail.phone}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h5">Jobs</Typography>
              <AppDataGrid rows={detail.jobs} columns={columns} />
            </Grid>
          </Grid>
        </Stack>
      )}
      <AppModal
        fullWidth
        show={showViewJob}
        Content={
          !job ? null : (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th">Name</TableCell>
                    <TableCell component="td">{job.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Type</TableCell>
                    <TableCell component="td">{job.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Status</TableCell>
                    <TableCell component="td">{job.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Date</TableCell>
                    <TableCell component="td">{job.jobDate ? moment(job.jobDate).format('LLL') : '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Client</TableCell>
                    <TableCell component="td">{job.vehicleOwner}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Vehicle Info</TableCell>
                    <TableCell component="td">
                      {job.vehicle.make} {job.vehicle.model} ({job.vehicle.plateNumber})
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )
        }
        onClose={() => setShowViewJob(false)}
      />
      <AppModal
        fullWidth
        show={cancelJob}
        Content={<DialogContentText>{MESSAGES.cancelText}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button onClick={() => setCancelJob(false)}>Disagree</Button>
            <Button onClick={() => handleCancelJob()}>Agree</Button>
          </DialogActions>
        }
        onClose={() => setCancelJob(false)}
      />
      <AppModal
        fullWidth
        size="sm"
        show={reassignJob}
        Content={
          <Box sx={{ p: 1 }}>
            <Autocomplete
              options={_technicians}
              onChange={(event, option) => {
                if (option) handleReassignJob(option.value);
              }}
              renderInput={params => <TextField {...params} fullWidth label="Reassign To" />}
            />
          </Box>
        }
        onClose={() => setReassignJob(false)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
      <AppAlert
        alertType="success"
        show={undefined !== success}
        message={success?.message}
        onClose={() => setSuccess(undefined)}
      />
      <AppLoader show={jobReducer.cancelJobStatus === 'loading'} />
      <AppLoader show={jobReducer.reassignJobStatus === 'loading'} />
    </React.Fragment>
  );
};

export default TechnicianPage;
