import React, { useContext, useEffect, useState } from "react";
import { Box, Chip, Stack } from "@mui/material";
import { CustomerPageContext } from "../../pages/customer/CustomerPage";
import { CustomerPageContextProps } from "@app-interfaces";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { getCustomerVehiclesAction } from "../../store/actions/customerActions";
import moment from "moment";
import { IVehicle } from "@app-models";
import AppDataGrid from "../tables/AppDataGrid";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Vehicles() {
  const [_vehicles, _setVehicles] = useState<IVehicle[]>([]);

  const { customer } = useContext(
    CustomerPageContext
  ) as CustomerPageContextProps;

  const customerReducer = useAppSelector((state) => state.customerReducer);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (customerReducer.getCustomerVehiclesStatus === "idle" && customer) {
      //@ts-ignore
      dispatch(getCustomerVehiclesAction(customer.id));
    }
  }, [dispatch, customerReducer.getCustomerVehiclesStatus, customer]);

  useEffect(() => {
    if (customerReducer.getCustomerVehiclesStatus === "completed") {
      _setVehicles(customerReducer.vehicles);
    }
  }, [customerReducer.getCustomerVehiclesStatus, customerReducer.vehicles]);

  const handleView = (vehicle: IVehicle) => {
    navigate(`/vehicles/${vehicle.id}`, { state: { vehicle } });
  };

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <AppDataGrid
          rows={_vehicles}
          columns={columns({ onView: handleView })}
          checkboxSelection
          disableSelectionOnClick
          showToolbar
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
      field: "plateNumber",
      headerName: "Plate Number",
      headerAlign: "center",
      width: 160,
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "make",
      headerName: "Make",
      headerAlign: "center",
      width: 160,
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "model",
      headerName: "Model",
      headerAlign: "center",
      width: 160,
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "modelYear",
      headerName: "Year",
      headerAlign: "center",
      align: "center",
      type: "string",
      sortable: true,
    },
    {
      field: "isBooked",
      headerName: "Booked",
      headerAlign: "center",
      align: "center",
      type: "string",
      sortable: true,
      renderCell: (params) => {
        const status = params.row.isBooked;

        return status ? (
          <Chip label="Yes" color="success" size="small" />
        ) : (
          <Chip label="No" color="error" size="small" />
        );
      },
    },

    {
      field: "createdAt",
      headerName: "Created At",
      headerAlign: "center",
      align: "center",
      type: "dateTime",
      sortable: true,
      width: 160,
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
      width: 160,
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
  ] as GridColDef<IVehicle>[];

export default Vehicles;

/**
 * <Stack direction="row" spacing={2}>
 {customerReducer.vehicles.map((vehicle, index) => {
          const dateAdded = moment(vehicle.createdAt).format("LLL");
          return (
            <Card key={index} sx={{ maxWidth: 300 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={car1}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {vehicle.make}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body2"
                    color="text.secondary"
                  >
                    {vehicle.modelYear} {vehicle.model} ({vehicle.plateNumber})
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Added by {customer?.firstName} {customer?.lastName}, on{" "}
                    {dateAdded}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions disableSpacing>
                <Button size="small" color="primary">
                  Book Appointment
                </Button>
              </CardActions>
            </Card>
          );
        })}
 </Stack>
 */
