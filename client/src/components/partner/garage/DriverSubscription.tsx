import React, { useContext, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { DriverVehiclesContextProps } from "@app-interfaces";
import {
  Autocomplete,
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import capitalize from "capitalize";
import { IJob } from "@app-models";
import { DriverVehiclesContext } from "./DriverVehicles";
import useAppSelector from "../../../hooks/useAppSelector";
import { formatNumberToIntl } from "../../../utils/generic";
import useTechnician from "../../../hooks/useTechnician";
import { ISelectData } from "../../forms/fields/SelectField";
import { useParams } from "react-router-dom";
import useAppDispatch from "../../../hooks/useAppDispatch";
import {
  driverAssignJobAction,
  getJobsAction,
} from "../../../store/actions/jobActions";
import { CustomHookMessage } from "@app-types";
import AppAlert from "../../alerts/AppAlert";
import { FileDownload } from "@mui/icons-material";
import { getTechniciansAction } from "../../../store/actions/technicianActions";
import { JOB_STATUS } from "../../../config/constants";
import { getDriverVehicleSubscriptionAction } from "../../../store/actions/vehicleActions";
import useAdmin from "../../../hooks/useAdmin";

interface IAssignJob {
  partnerId?: number;
  subscriptionId?: number;
  techId?: number;
}

function DriverSubscription() {
  const [_technicians, _setTechnicians] = useState<ISelectData[]>([]);
  const [error, setError] = useState<CustomHookMessage>();
  const [success, setSuccess] = useState<CustomHookMessage>();

  const { driverSub, vehicle, setViewSub } = useContext(
    DriverVehiclesContext
  ) as DriverVehiclesContextProps;

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
  const dispatch = useAppDispatch();

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
    const data: IAssignJob = {
      partnerId,
      techId: +value,
      subscriptionId: driverSub?.id,
    };

    dispatch(driverAssignJobAction(data));
  };

  console.log(driverSub);

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
        variant="body2"
        component="div"
        display="block"
        sx={{ mt: 2 }}
      >
        Inspections
      </Typography>
      <Stack spacing={1}>
        {jobs.map((job, index) => {
          return (
            <React.Fragment key={index}>
              {_.isEmpty(job) && (
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
              )}
              {!_.isEmpty(job) && (
                <Paper
                  sx={{
                    p: 1,
                    flexGrow: 1,
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm container alignItems="center">
                      <Grid
                        item
                        xs
                        container
                        justifyItems="flex-end"
                        direction="column"
                        spacing={2}
                      >
                        <Grid item xs>
                          <Typography
                            gutterBottom
                            variant="caption"
                            component="div"
                          >
                            {job.name}
                          </Typography>
                          <Typography
                            gutterBottom
                            variant="caption"
                            component="div"
                          >
                            status: {job.status}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item>
                        {job.status === JOB_STATUS.complete && (
                          <IconButton>
                            <FileDownload />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              )}
            </React.Fragment>
          );
        })}
      </Stack>
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