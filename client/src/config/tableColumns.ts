import moment from "moment";
import { GridColDef } from "@mui/x-data-grid";
import { IAppointment } from "@app-models";

export const appointmentColumn = (options?: any) =>
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
  ] as GridColDef<IAppointment>[];
