import React, { createContext, useEffect, useState } from "react";
import useAppSelector from "../../../hooks/useAppSelector";
import { ICustomerSubscription, IRideShareDriverSubscription, IVehicle } from "@app-models";
import { Avatar, Box, IconButton, LinearProgress, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { FaCarAlt, FaExpandAlt } from "react-icons/fa";
import AppModal from "../../modal/AppModal";
import { DriverVehiclesContextProps } from "@app-interfaces";
import { clearDriverAssignJobStatus, clearGetJobsStatus } from "../../../store/reducers/jobReducer";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { getCheckListsAction } from "../../../store/actions/checkListActions";
import CustomerVehicle from "./CustomerVehicle";

export const DriverVehiclesContext = createContext<DriverVehiclesContextProps | null>(null);

export default function CustomerVehicles() {
  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const [openViewVehicle, setOpenViewVehicle] = useState<boolean>(false);
  const [viewSub, setViewSub] = useState<boolean>(false);
  const [driverSub, setDriverSub] = useState<IRideShareDriverSubscription | null>(null);
  const [customerSub, setCustomerSub] = useState<ICustomerSubscription | null>(null);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);

  const customerReducer = useAppSelector((state) => state.customerReducer);
  const checkListReducer = useAppSelector((state) => state.checkListReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (checkListReducer.getCheckListsStatus === "idle") {
      dispatch(getCheckListsAction());
    }
  }, [dispatch, checkListReducer.getCheckListsStatus]);

  useEffect(() => {
    if (customerReducer.customer) {
      setVehicles(customerReducer.customer.vehicles);
    }
  }, [customerReducer.customer]);

  useEffect(() => {
    return () => {
      setViewSub(false);
      setDriverSub(null);
      dispatch(clearGetJobsStatus());
      dispatch(clearDriverAssignJobStatus());
    };
  }, [dispatch, setDriverSub, setViewSub]);

  const handleViewVehicle = (vehicle: IVehicle) => {
    setVehicle(vehicle);
    setOpenViewVehicle(true);
  };

  return (
    <DriverVehiclesContext.Provider
      value={{
        viewSub,
        setViewSub,
        driverSub,
        setDriverSub,
        customerSub,
        setCustomerSub,
        vehicle,
        setVehicle,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: 500 }}>
          <List dense={true}>
            {vehicles.length ? (
              vehicles.map((vehicle, index) => {
                return (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton onClick={() => handleViewVehicle(vehicle)} edge="end" aria-label="delete">
                        <FaExpandAlt />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <FaCarAlt />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={vehicle.make}
                      secondary={`${vehicle.modelYear} ${vehicle.model} (${vehicle.plateNumber})`}
                    />
                  </ListItem>
                );
              })
            ) : (
              <ListItem>
                <ListItemText primary="No data" secondary="Customer have not added a vehicle yet." />
              </ListItem>
            )}
          </List>
        </Box>
      </Box>
      <AppModal
        fullWidth
        fullScreen
        show={openViewVehicle}
        Content={vehicle ? <CustomerVehicle /> : <LinearProgress />}
        onClose={() => setOpenViewVehicle(false)}
      />
    </DriverVehiclesContext.Provider>
  );
}
