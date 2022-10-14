import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import _ from "lodash";
import { DriverVehiclesContextProps } from "@app-interfaces";
import {
  Alert,
  Autocomplete,
  Box,
  Grid,
  IconButton,
  LinearProgress,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import capitalize from "capitalize";
import { ICheckList, IJob } from "@app-models";
import { DriverVehiclesContext } from "./DriverVehicles";
import useAppSelector from "../../../hooks/useAppSelector";
import { formatNumberToIntl } from "../../../utils/generic";
import useTechnician from "../../../hooks/useTechnician";
import { ISelectData } from "../../forms/fields/SelectField";
import { useNavigate, useParams } from "react-router-dom";
import useAppDispatch from "../../../hooks/useAppDispatch";
import {
  driverAssignJobAction,
  getJobsAction,
} from "../../../store/actions/jobActions";
import { CustomHookMessage } from "@app-types";
import AppAlert from "../../alerts/AppAlert";
import { FileDownload } from "@mui/icons-material";
import { getTechniciansAction } from "../../../store/actions/technicianActions";
import { getDriverVehicleSubscriptionAction } from "../../../store/actions/vehicleActions";
import useAdmin from "../../../hooks/useAdmin";
import { JOB_STATUS } from "../../../config/constants";

interface IAssignJob {
  partnerId?: number;
  subscriptionId?: number;
  techId?: number;
  checkListId?: number;
}

function DriverSubscription() {
  const [_technicians, _setTechnicians] = useState<ISelectData[]>([]);
  const [error, setError] = useState<CustomHookMessage>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [checkLists, setCheckLists] = useState<ICheckList[]>([]);
  const [checkList, setCheckList] = useState<number>();

  const { driverSub, vehicle, setViewSub } = useContext(
    DriverVehiclesContext
  ) as DriverVehiclesContextProps;

  const navigate = useNavigate();
  useTechnician();
  const params = useParams();
  const admin = useAdmin();

  const partnerId = useMemo(() => {
    if (admin.isTechAdmin && admin.user) {
      return admin.user.partner.id;
    }

    if (params.id) {
      return +(params.id as unknown as string);
    }
  }, [admin.isTechAdmin, admin.user, params.id]);

  const jobReducer = useAppSelector((state) => state.jobReducer);
  const technicianReducer = useAppSelector((state) => state.technicianReducer);
  const checkListReducer = useAppSelector((state) => state.checkListReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (checkListReducer.getCheckListsStatus === "completed") {
      if (partnerId) {
        setCheckLists(
          checkListReducer.checkLists.filter(
            (checkList) => checkList.partnerId === partnerId
          )
        );
      }
    }
  }, [
    checkListReducer.getCheckListsStatus,
    checkListReducer.checkLists,
    partnerId,
  ]);

  useEffect(() => {
    if (technicianReducer.getTechniciansStatus === "completed") {
      _setTechnicians(
        technicianReducer.technicians
          .filter((tech) => !tech.hasJob && tech.active)
          .map((tech) => ({
            label: `${tech.firstName} ${tech.lastName}`,
            value: `${tech.id}`,
          }))
      );
    }
  }, [technicianReducer.getTechniciansStatus, technicianReducer.technicians]);

  useEffect(() => {
    if (jobReducer.driverAssignJobStatus === "completed" && vehicle) {
      setSuccess({ message: jobReducer.driverAssignJobSuccess });
      dispatch(getJobsAction(partnerId));
      dispatch(getTechniciansAction());
      dispatch(getDriverVehicleSubscriptionAction(vehicle.id));
      setViewSub(false);
    }
  }, [
    dispatch,
    jobReducer.driverAssignJobStatus,
    jobReducer.driverAssignJobSuccess,
    partnerId,
    setViewSub,
    vehicle,
  ]);

  useEffect(() => {
    if (jobReducer.driverAssignJobStatus === "failed") {
      if (jobReducer.driverAssignJobError) {
        setError({ message: jobReducer.driverAssignJobError });
      }
    }
  }, [jobReducer.driverAssignJobError, jobReducer.driverAssignJobStatus]);

  const jobs = useMemo(() => {
    if (driverSub) {
      const maxDriveIn = driverSub.maxDriveIn;
      const tempJobs: Partial<IJob>[] = [...jobReducer.jobs];

      tempJobs.length += maxDriveIn - tempJobs.length;

      const startIndex =
        jobReducer.jobs.length > 0 ? jobReducer.jobs.length : 0;

      for (let i = startIndex; i < tempJobs.length; i++) tempJobs[i] = {};

      return tempJobs;
    }
    return [];
  }, [driverSub, jobReducer.jobs]);

  const vehicleIsBusy = useMemo(() => {
    if (driverSub) {
      return driverSub.vehicles.every(
        (vehicle) => vehicle.onInspection || vehicle.onMaintenance
      );
    }
    return true;
  }, [driverSub]);

  const handleAssignJob = (value: string) => {
    if (!checkLists.length)
      return setError({
        message: "You do not have a check list for inspection.",
      });

    if (undefined === checkList)
      return setError({
        message: "You must select one check list for this inspection",
      });

    const data: IAssignJob = {
      partnerId,
      techId: +value,
      subscriptionId: driverSub?.id,
      checkListId: checkList,
    };

    dispatch(driverAssignJobAction(data));
  };

  const handleViewReport = useCallback(
    (job: Partial<IJob>) =>
      navigate(`/job-check-list-report/${job.id}`, { state: { job } }),
    [navigate]
  );

  return (
    <React.Fragment>
      <TableContainer
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        component={Box}
      >
        {driverSub ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} component="th" scope="row">
                Plan Name
              </TableCell>
              <TableCell colSpan={4} align="right">
                {capitalize.words(driverSub.planType)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} component="th" scope="row">
                Payment Plan
              </TableCell>
              <TableCell colSpan={4} align="right">
                {driverSub.paymentPlan}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} component="th" scope="row">
                Amount
              </TableCell>
              <TableCell colSpan={4} align="right">
                {formatNumberToIntl(+driverSub.amount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} component="th" scope="row">
                Payment Status
              </TableCell>
              <TableCell colSpan={4} align="right">
                {driverSub.transaction.status}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} component="th" scope="row">
                Mode Of Service
              </TableCell>
              <TableCell colSpan={4} align="right">
                {driverSub.modeOfService}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} component="th" scope="row">
                Drive-in Count
              </TableCell>
              <TableCell colSpan={4} align="right">
                {driverSub.driveInCount}/{driverSub.maxDriveIn}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} component="th" scope="row">
                Mobile Count
              </TableCell>
              <TableCell colSpan={4} align="right">
                {driverSub.mobileCount}/{driverSub.maxMobile}
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell>
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </TableContainer>
      <Typography
        variant="h6"
        component="div"
        display="block"
        sx={{ mt: 2 }}
        gutterBottom
      >
        Inspections
      </Typography>
      <Grid container direction="column" spacing={1}>
        <Grid item xs hidden={vehicleIsBusy}>
          <Autocomplete
            disabled={vehicleIsBusy}
            options={checkLists}
            getOptionLabel={(option) => option.name}
            onChange={(event, option) => {
              if (option) setCheckList(option.id);
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth label="Check List" />
            )}
          />
        </Grid>
        {jobs.map((job, index) => {
          return (
            <React.Fragment key={index}>
              {_.isEmpty(job) && (
                <Grid item xs>
                  <Autocomplete
                    disabled={vehicleIsBusy}
                    options={_technicians}
                    onChange={(event, option) => {
                      if (option) {
                        handleAssignJob(option.value);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label="Assign To" />
                    )}
                  />
                </Grid>
              )}
              {!_.isEmpty(job) && (
                <Grid item>
                  <Alert
                    severity={
                      JOB_STATUS.complete === job.status ? "success" : "info"
                    }
                    action={
                      JOB_STATUS.complete === job.status && (
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => handleViewReport(job)}
                        >
                          <FileDownload fontSize="inherit" />
                        </IconButton>
                      )
                    }
                  >
                    <Typography gutterBottom variant="caption" component="div">
                      {job.name}
                    </Typography>
                    <Typography gutterBottom variant="caption" component="div">
                      status: {job.status}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </React.Fragment>
          );
        })}
      </Grid>
      <AppAlert
        alertType="error"
        show={error !== undefined}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
      <AppAlert
        alertType="success"
        show={success !== undefined}
        message={success?.message}
        onClose={() => setSuccess(undefined)}
      />
    </React.Fragment>
  );
}

export default DriverSubscription;
