import React, { useCallback, useContext, useMemo } from "react";
import { TechniciansPageContext } from "./TechniciansPage";
import { TechniciansPageContextProps } from "@app-interfaces";
import {
  Box,
  Card,
  CardContent,
  Chip,
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
  Typography,
} from "@mui/material";
import AppDataGrid from "../../components/tables/AppDataGrid";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { PlaylistAddCheck, Visibility } from "@mui/icons-material";
import { IJob } from "@app-models";
import useAdmin from "../../hooks/useAdmin";
import { JOB_STATUS } from "../../config/constants";
import moment from "moment";
import AppModal from "../../components/modal/AppModal";
import { useNavigate } from "react-router-dom";

function TechnicianPage() {
  const admin = useAdmin();

  const { detail, setShowViewJob, showViewJob, job, setJob } = useContext(
    TechniciansPageContext
  ) as TechniciansPageContextProps;

  const navigate = useNavigate();

  const jobStatusCount = useMemo(() => {
    let pending = 0,
      complete = 0,
      inProgress = 0;

    if (detail) {
      pending = detail.jobs.filter((job) => job.status === JOB_STATUS.pending).length;
      complete = detail.jobs.filter((job) => job.status === JOB_STATUS.complete).length;
      inProgress = detail.jobs.filter((job) => job.status === JOB_STATUS.inProgress).length;
    }

    return { pending, complete, inProgress };
  }, [detail]);

  const handleView = useCallback(
    (job: IJob) => {
      setJob(job);
      setShowViewJob(true);
    },
    [setJob, setShowViewJob]
  );

  const handleViewJobCheckList = useCallback(
    (job: IJob) => navigate(`/job-check-list-report/${job.id}`, { state: { job } }),
    [navigate]
  );

  const columns = useMemo(() => {
    return [
      {
        field: "id",
        headerName: "ID",
        headerAlign: "center",
        align: "center",
        sortable: true,
        type: "number",
      },

      {
        field: "type",
        headerName: "Type",
        headerAlign: "center",
        align: "center",
        sortable: true,
        type: "string",
        width: 180,
      },

      {
        field: "status",
        headerName: "Status",
        headerAlign: "center",
        align: "center",
        sortable: true,
        type: "string",
        width: 150,
        renderCell: (params) => {
          const status = params.value;
          return status === JOB_STATUS.pending ? (
            <Chip label={status} color="warning" />
          ) : status === JOB_STATUS.inProgress ? (
            <Chip label={status} color="error" />
          ) : status === JOB_STATUS.complete ? (
            <Chip label={status} color="success" />
          ) : (
            ""
          );
        },
      },
      {
        field: "jobDate",
        headerName: "Completed Date",
        headerAlign: "center",
        align: "center",
        sortable: true,
        type: "dateTime",
        width: 200,
        valueFormatter: (params) => {
          const date = params.value;
          return date ? moment(date).format("LLL") : "-";
        },
      },
      {
        field: "createdAt",
        headerName: "Created At",
        headerAlign: "center",
        align: "center",
        sortable: true,
        type: "dateTime",
        width: 200,
        valueFormatter: (params) => {
          const date = params.value;
          return date ? moment(date).format("LLL") : "";
        },
      },

      {
        field: "actions",
        type: "actions",
        headerAlign: "center",
        align: "center",
        getActions: (params: any) => {
          const job = params.row;

          return [
            <GridActionsCellItem
              key={0}
              icon={<Visibility sx={{ color: "dodgerblue" }} />}
              onClick={() => handleView(params.row)}
              label="View"
              showInMenu={false}
            />,

            <GridActionsCellItem
              hidden={!admin.isTechAdmin}
              key={1}
              icon={<PlaylistAddCheck sx={{ color: "limegreen" }} />}
              onClick={() => handleViewJobCheckList(params.row)}
              label="Edit"
              showInMenu={false}
              sx={{
                display: job.status === JOB_STATUS.complete ? "block" : "none",
              }}
            />,
          ];
        },
      },
    ] as GridColDef<IJob>[];
  }, [admin.isTechAdmin, handleView, handleViewJobCheckList]);

  return (
    <React.Fragment>
      {!detail ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <Stack spacing={4} divider={<Divider orientation="horizontal" />}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="body1">Jobs Pending</Typography>
                  <Typography variant="subtitle1">{jobStatusCount.pending}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="body1">Jobs In-Progress</Typography>
                  <Typography variant="subtitle1">{jobStatusCount.inProgress}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
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
                    <TableCell component="td">{moment(job.jobDate).format("LLL")}</TableCell>
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
    </React.Fragment>
  );
}

export default TechnicianPage;
