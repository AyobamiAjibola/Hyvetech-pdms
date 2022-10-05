import React, { useEffect, useMemo, useState } from "react";
import useAppSelector from "../../../hooks/useAppSelector";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { getDriversFilterDataAction } from "../../../store/actions/partnerActions";
import { useParams } from "react-router-dom";
import { clearGetDriversFilterDataStatus } from "../../../store/reducers/partnerReducer";
import {
  Autocomplete,
  Box,
  CircularProgress,
  createFilterOptions,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { IDriversFilterData } from "@app-interfaces";
import { getDriverAction } from "../../../store/actions/rideShareActions";
import { IRideShareDriver } from "@app-models";
import AppLoader from "../../loader/AppLoader";
import AppTab from "../../tabs/AppTab";
import { driverSearchResultTabs } from "../../../navigation/menus";
import useAdmin from "../../../hooks/useAdmin";

const filterOptions = createFilterOptions({
  matchFrom: "any",
  stringify: (option: IDriversFilterData) => `${option.query}`,
});

function RideShareDriver() {
  const [value, setValue] = React.useState<IDriversFilterData | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = useState<IDriversFilterData[]>([]);
  const [driver, setDriver] = useState<IRideShareDriver | null>(null);

  const partnerReducer = useAppSelector((state) => state.partnerReducer);
  const rideShareReducer = useAppSelector((state) => state.rideShareReducer);
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    if (partnerReducer.getDriversFilterDataStatus === "idle") {
      if (partnerId) dispatch(getDriversFilterDataAction(+partnerId));
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
      setDriver(null);
      dispatch(clearGetDriversFilterDataStatus());
    };
  }, [dispatch]);

  const handleGetDriverInfo = (id?: number) => {
    if (id) {
      dispatch(getDriverAction(id));
    }
  };

  return (
    <React.Fragment>
      <Stack direction="column" spacing={5}>
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
                  label="Search driver by First name, last name, car plate number."
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
          <Divider orientation="horizontal" />
          <Paper sx={{ p: 3 }}>
            <AppTab slideDirection="left" tabMenus={driverSearchResultTabs} />
          </Paper>
        </Box>
      </Stack>
      <AppLoader show={rideShareReducer.getDriverStatus === "loading"} />
    </React.Fragment>
  );
}

export default RideShareDriver;
