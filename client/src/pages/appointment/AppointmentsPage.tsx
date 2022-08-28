import React, { useEffect, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getAppointmentsAction } from "../../store/actions/appointmentActions";
import moment from "moment";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { IAppointment } from "@app-models";
import AppDataGrid from "../../components/tables/AppDataGrid";
import { useNavigate } from "react-router-dom";

function AppointmentsPage() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  const navigate = useNavigate();

  const appointmentReducer = useAppSelector(
    (state) => state.appointmentReducer
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (appointmentReducer.getAppointmentsStatus === "idle") {
      dispatch(getAppointmentsAction());
    }
  }, [appointmentReducer.getAppointmentsStatus, dispatch]);

  useEffect(() => {
    if (appointmentReducer.getAppointmentsStatus === "completed") {
      setAppointments(appointmentReducer.appointments);
    }
  }, [
    appointmentReducer.appointments,
    appointmentReducer.getAppointmentsStatus,
    dispatch,
  ]);

  const handleView = (appointment: IAppointment) => {
    navigate(`/appointments/${appointment.id}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>
      <Box>
        <AppDataGrid
          rows={appointments}
          columns={columns({ onView: handleView })}
          checkboxSelection
          disableSelectionOnClick
          showToolbar
        />
      </Box>
    </Box>
  );
}

const columns = (options?: any) =>
  [
    {
      field: "id",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      sortable: true,
      type: "number",
    },
    {
      field: "code",
      headerName: "Code",
      headerAlign: "center",
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "planCategory",
      headerName: "Plan Category",
      headerAlign: "center",
      width: 170,
      align: "center",
      type: "number",
      sortable: true,
    },
    {
      field: "modeOfService",
      headerName: "Mode Of Service",
      headerAlign: "center",
      width: 170,
      align: "center",
      type: "number",
      sortable: true,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      type: "string",
      sortable: true,
      renderCell: (params) => {
        const status = params.row.status;

        return status === "Pending" ? (
          <Chip label={status} color="warning" size="small" />
        ) : status === "In-progress" ? (
          <Chip label={status} color="error" size="small" />
        ) : status === "Complete" ? (
          <Chip label={status} color="success" size="small" />
        ) : (
          <Chip label={status} color="info" size="small" />
        );
      },
    },

    {
      field: "appointmentDate",
      headerName: "Appointment Date",
      headerAlign: "center",
      align: "center",
      type: "dateTime",
      sortable: true,
      width: 170,
      valueFormatter: (params) => {
        return moment(params.value).format("LLL");
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      headerAlign: "center",
      align: "center",
      type: "dateTime",
      sortable: true,
      width: 170,
      valueFormatter: (params) => {
        return moment(params.value).format("LLL");
      },
    },
    {
      field: "updatedAt",
      headerName: "Modified At",
      headerAlign: "center",
      align: "center",
      type: "dateTime",
      sortable: true,
      width: 170,
      valueFormatter: (params) => {
        return moment(params.value).format("LLL");
      },
    },
    {
      field: "actions",
      type: "actions",
      align: "center",
      headerAlign: "center",
      getActions: (params: any) => [
        <GridActionsCellItem
          key={0}
          icon={<Visibility sx={{ color: "dodgerblue" }} />}
          onClick={() => options.onView(params.row)}
          label="View"
          showInMenu={false}
        />,
      ],
    },
  ] as GridColDef<IAppointment>[];

export default AppointmentsPage;
