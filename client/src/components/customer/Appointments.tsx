import React, { useContext, useEffect, useState } from "react";
import { Box, Chip } from "@mui/material";
import { CustomerPageContext } from "../../pages/customer/CustomerPage";
import { CustomerPageContextProps } from "@app-interfaces";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getCustomerAppointmentsAction } from "../../store/actions/customerActions";
import moment from "moment";
import { IAppointment } from "@app-models";
import AppDataGrid from "../tables/AppDataGrid";
import { useNavigate } from "react-router-dom";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Visibility } from "@mui/icons-material";

function Appointments() {
  const [_appointments, _setAppointments] = useState<IAppointment[]>([]);

  const { customer } = useContext(CustomerPageContext) as CustomerPageContextProps;

  const customerReducer = useAppSelector((state) => state.customerReducer);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (customer) {
      dispatch(getCustomerAppointmentsAction(customer.id));
    }
  }, [dispatch, customer]);

  useEffect(() => {
    if (customerReducer.getCustomerAppointmentsStatus === "completed") {
      _setAppointments(customerReducer.appointments);
    }
  }, [customerReducer.getCustomerAppointmentsStatus, customerReducer.appointments]);

  const handleView = (appointment: IAppointment) => {
    navigate(`/appointments/${appointment.id}`);
  };

  return (
    <Box>
      <AppDataGrid
        rows={_appointments}
        columns={columns({ onView: handleView })}
        checkboxSelection
        disableSelectionOnClick
        showToolbar
        loading={customerReducer.getCustomerAppointmentsStatus === "loading"}
      />
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
      headerName: "Plans Category",
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
        return moment(params.value).utc(true).format("LLL");
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
        return moment(params.value).utc(true).format("LLL");
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
        return moment(params.value).utc(true).format("LLL");
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

export default Appointments;
