import React, { useEffect, useMemo, useState } from "react";
import useAppSelector from "../../../hooks/useAppSelector";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { getOwnersFilterDataAction } from "../../../store/actions/partnerActions";
import { useParams } from "react-router-dom";
import {
  Autocomplete,
  Box,
  CircularProgress,
  createFilterOptions,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { IDriversFilterData } from "@app-interfaces";
import { ICustomer } from "@app-models";
import AppLoader from "../../loader/AppLoader";
import { getCustomerAction } from "../../../store/actions/customerActions";
import useAdmin from "../../../hooks/useAdmin";

const filterOptions = createFilterOptions({
  matchFrom: "any",
  stringify: (option: IDriversFilterData) => `${option.query}`,
});

export default function VehicleOwner() {
  const [value, setValue] = React.useState<IDriversFilterData | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = useState<IDriversFilterData[]>([]);
  const [customer, setCustomer] = useState<ICustomer | null>(null);

  const partnerReducer = useAppSelector((state) => state.partnerReducer);
  const customerReducer = useAppSelector((state) => state.customerReducer);
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
    if (partnerReducer.getOwnersFilterDataStatus === "idle") {
      if (partnerId) dispatch(getOwnersFilterDataAction(+partnerId));
    }
  }, [dispatch, partnerId, partnerReducer.getOwnersFilterDataStatus]);

  useEffect(() => {
    if (partnerReducer.getOwnersFilterDataStatus === "completed") {
      setOptions(partnerReducer.ownersFilterData);
    }
  }, [
    partnerReducer.ownersFilterData,
    partnerReducer.getOwnersFilterDataStatus,
  ]);

  useEffect(() => {
    if (customerReducer.getCustomerStatus === "completed") {
      setCustomer(customerReducer.customer);
    }
  }, [customerReducer.customer, customerReducer.getCustomerStatus]);

  useEffect(() => {
    return () => {
      //
    };
  }, [dispatch]);

  const handleGetDriverInfo = (id?: number) => {
    if (id) {
      dispatch(getCustomerAction(id));
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
                if (reason === "clear") setCustomer(null);
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
        <Box hidden={customer === null}>
          <Divider orientation="horizontal" />
          <Typography>Tabs Here</Typography>
        </Box>
      </Stack>
      <AppLoader show={customerReducer.getCustomerStatus === "loading"} />
    </React.Fragment>
  );
}
