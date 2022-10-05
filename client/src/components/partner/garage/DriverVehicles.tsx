import React, { createContext, useEffect, useState } from "react";
import useAppSelector from "../../../hooks/useAppSelector";
import {
  IRideShareDriver,
  IRideShareDriverSubscription,
  IVehicle,
} from "@app-models";
import {
  Avatar,
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { FaCarAlt, FaExpandAlt } from "react-icons/fa";
import AppModal from "../../modal/AppModal";
import DriverVehicle from "./DriverVehicle";
import { DriverVehiclesContextProps } from "@app-interfaces";
import {
  clearDriverAssignJobStatus,
  clearGetJobsStatus,
} from "../../../store/reducers/jobReducer";
import useAppDispatch from "../../../hooks/useAppDispatch";

export const DriverVehiclesContext =
  createContext<DriverVehiclesContextProps | null>(null);

export default function DriverVehicles() {
  const [driver, setDriver] = useState<IRideShareDriver | null>(null);
  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const [openViewVehicle, setOpenViewVehicle] = useState<boolean>(false);
  const [viewSub, setViewSub] = useState<boolean>(false);
  const [driverSub, setDriverSub] =
    useState<IRideShareDriverSubscription | null>(null);

  const rideShareReducer = useAppSelector((state) => state.rideShareReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setDriver(rideShareReducer.driver);
  }, [rideShareReducer.driver]);

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
            {driver ? (
              driver.vehicles.map((vehicle, index) => {
                return (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        onClick={() => handleViewVehicle(vehicle)}
                        edge="end"
                        aria-label="delete"
                      >
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
                <LinearProgress />
              </ListItem>
            )}
          </List>
        </Box>
      </Box>
      <AppModal
        fullWidth
        fullScreen
        show={openViewVehicle}
        Content={vehicle ? <DriverVehicle /> : <LinearProgress />}
        onClose={() => setOpenViewVehicle(false)}
      />
    </DriverVehiclesContext.Provider>
  );
}
