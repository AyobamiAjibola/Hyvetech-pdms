import React, { useEffect, useMemo, useState } from "react";
import useAppSelector from "../../../hooks/useAppSelector";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { getDriversFilterDataAction } from "../../../store/actions/partnerActions";
import { useParams } from "react-router-dom";
import { clearGetDriversFilterDataStatus } from "../../../store/reducers/partnerReducer";
import {
  Autocomplete,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  createFilterOptions,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { IDriversFilterData } from "@app-interfaces";
import { getDriverAction } from "../../../store/actions/rideShareActions";
import { IRideShareDriver } from "@app-models";
import AppLoader from "../../loader/AppLoader";
import { FaCarAlt } from "react-icons/fa";

const filterOptions = createFilterOptions({
  matchFrom: "any",
  stringify: (option: IDriversFilterData) => `${option.query}`,
});

function Drivers() {
  const [value, setValue] = React.useState<IDriversFilterData | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = useState<IDriversFilterData[]>([]);
  const [driver, setDriver] = useState<IRideShareDriver | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number>(0);

  const partnerReducer = useAppSelector((state) => state.partnerReducer);
  const rideShareReducer = useAppSelector((state) => state.rideShareReducer);
  const dispatch = useAppDispatch();

  const params = useParams();

  const partnerId = useMemo(() => params.id as string, [params.id]);

  useEffect(() => {
    if (partnerReducer.getDriversFilterDataStatus === "idle") {
      dispatch(getDriversFilterDataAction(+partnerId));
    }
  }, [dispatch, partnerId, partnerReducer.getDriversFilterDataStatus]);

  useEffect(() => {
    if (partnerReducer.getDriversFilterDataStatus === "completed") {
      setOptions(partnerReducer.driversFilterData);
    }
  }, [
    partnerReducer.driversFilterData,
    partnerReducer.getDriversFilterDataStatus,
  ]);

  useEffect(() => {
    if (rideShareReducer.getDriverStatus === "completed") {
      setDriver(rideShareReducer.driver);
    }
  }, [rideShareReducer.driver, rideShareReducer.getDriverStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearGetDriversFilterDataStatus());
    };
  }, [dispatch]);

  const handleGetDriverInfo = (id?: number) => {
    if (id) {
      dispatch(getDriverAction(id));
    }
  };

  const handleListItemClick = (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLDivElement>,
    number: number
  ) => {
    setSelectedVehicle(number);
  };

  return (
    <React.Fragment>
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" />}
        spacing={5}
      >
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <Autocomplete
              filterOptions={filterOptions}
              inputValue={inputValue}
              value={value}
              loading={partnerReducer.getDriversFilterDataStatus === "loading"}
              getOptionLabel={(option) => option.fullName}
              isOptionEqualToValue={(option, value) =>
                option.fullName === value.fullName
              }
              onChange={(event: any, newValue: IDriversFilterData | null) => {
                setValue(newValue);
                handleGetDriverInfo(newValue?.id);
              }}
              onInputChange={(event, newInputValue, reason) => {
                setInputValue(newInputValue);
                if (reason === "clear") setDriver(null);
              }}
              renderInput={(props) => (
                <TextField
                  {...props}
                  label="Find Driver"
                  InputProps={{
                    ...props.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {partnerReducer.getDriversFilterDataStatus ===
                        "loading" ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {props.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              options={options}
            />
          </Grid>
        </Grid>
        <Box hidden={driver === null}>
          <Grid
            container
            spacing={{ xs: 2, md: 4 }}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} md={4}>
              <Typography textAlign="center" display="block">
                Personal Info
              </Typography>

              <Card>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {`${driver?.firstName} ${driver?.lastName}`}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="body2"
                      color="text.secondary"
                    >
                      {driver?.email} | {driver?.phone}
                    </Typography>

                    {driver?.contacts.map((contact, index) => {
                      return (
                        <Typography
                          key={index}
                          gutterBottom
                          variant="body2"
                          color="text.secondary"
                        >
                          {contact.state} {contact.district} {contact.address}
                        </Typography>
                      );
                    })}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper>
                <Typography textAlign="center" display="block">
                  Vehicle Info
                </Typography>
                <List component="nav" aria-label="main mailbox folders">
                  {driver?.vehicles.map((vehicle, index) => {
                    return (
                      <ListItemButton
                        key={index}
                        selected={selectedVehicle === index}
                        onClick={(event) => handleListItemClick(event, index)}
                      >
                        <ListItemIcon>
                          <FaCarAlt />
                        </ListItemIcon>
                        <ListItemText
                          primary={vehicle.make}
                          secondary={`${vehicle.modelYear} | ${vehicle.model} | ${vehicle.plateNumber}`}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper>
                <Typography textAlign="center" display="block">
                  Subscription Info
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Stack>
      <AppLoader show={rideShareReducer.getDriverStatus === "loading"} />
    </React.Fragment>
  );
}

export default Drivers;
