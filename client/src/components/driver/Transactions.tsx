import React, { useContext, useEffect, useState } from "react";
import { Box, Chip, Stack } from "@mui/material";
import { DriverPageContext } from "../../pages/driver/DriverPage";
import { DriverPageContextProps } from "@app-interfaces";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getDriverTransactionsAction } from "../../store/actions/rideShareActions";
import { ITransaction } from "@app-models";
import AppDataGrid from "../tables/AppDataGrid";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { MESSAGES } from "../../config/constants";

function Transactions() {
  const [_transactions, _setTransactions] = useState<ITransaction[]>([]);

  const { driver } = useContext(DriverPageContext) as DriverPageContextProps;

  const rideShareReducer = useAppSelector((state) => state.rideShareReducer);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (driver) {
      dispatch(getDriverTransactionsAction(driver.id));
    }
  }, [dispatch, driver]);

  useEffect(() => {
    if (rideShareReducer.getDriverTransactionsStatus === "completed") {
      _setTransactions(rideShareReducer.transactions);
    }
  }, [rideShareReducer.getDriverTransactionsStatus, rideShareReducer.transactions]);

  const handleView = (txn: ITransaction) => {
    navigate(`/transactions/${txn.id}`, { state: { transaction: txn } });
  };

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <AppDataGrid
          rows={_transactions}
          columns={columns({ onView: handleView })}
          checkboxSelection
          disableSelectionOnClick
          showToolbar
          loading={rideShareReducer.getDriverTransactionsStatus === "loading"}
        />
      </Stack>
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
      field: "reference",
      headerName: "Reference",
      headerAlign: "center",
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      headerAlign: "center",
      align: "center",
      type: "number",
      sortable: true,
    },
    {
      field: "purpose",
      headerName: "Purpose",
      headerAlign: "center",
      width: 200,
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "status",
      headerName: "PaymentStatus",
      headerAlign: "center",
      align: "center",
      width: 150,
      type: "string",
      sortable: true,
      renderCell: (params) => {
        const status = params.row.status;

        return status === "success" ? (
          <Chip label={status} color="success" size="small" />
        ) : status === MESSAGES.txn_init ? (
          <Chip label="pending" color="warning" size="small" />
        ) : (
          <Chip label={status} color="error" size="small" />
        );
      },
    },
    {
      field: "serviceStatus",
      headerName: "Service Status",
      headerAlign: "center",
      width: 150,
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "paidAt",
      headerName: "Paid At",
      headerAlign: "center",
      align: "center",
      type: "dateTime",
      sortable: true,
      width: 200,
      valueFormatter: (params) => {
        return params.value ? moment(params.value).utc(true).format("LLL") : "-";
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      headerAlign: "center",
      align: "center",
      type: "dateTime",
      sortable: true,
      width: 200,
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
      width: 200,
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
  ] as GridColDef<ITransaction>[];

export default Transactions;
