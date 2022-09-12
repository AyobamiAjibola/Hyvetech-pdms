import { Form, useFormikContext } from "formik";
import { Grid, Typography } from "@mui/material";
import TextInputField from "../fields/TextInputField";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import React from "react";
import { IPlanModel } from "../models/planModel";
import useAppSelector from "../../../hooks/useAppSelector";

export default function AddPlanForm() {
  const { handleChange, values } = useFormikContext<IPlanModel>();

  const partnerReducer = useAppSelector((state) => state.partnerReducer);

  return (
    <Form>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContent="center"
        alignItems="center"
        sx={{ p: 1 }}
      >
        <Grid item xs={12}>
          <TextInputField
            fullWidth
            onChange={handleChange}
            value={values.label}
            name="label"
            label="Name of Plan"
          />
        </Grid>
        <Grid item xs={6}>
          <TextInputField
            fullWidth
            type="number"
            inputProps={{ min: "0" }}
            onChange={handleChange}
            value={values.minVehicles}
            name="minVehicles"
            label="Min Vehicles"
          />
        </Grid>
        <Grid item xs={6}>
          <TextInputField
            fullWidth
            type="number"
            inputProps={{ min: "0" }}
            onChange={handleChange}
            value={values.maxVehicles}
            name="maxVehicles"
            label="Max Vehicles"
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            fullWidth
            type="number"
            inputProps={{ min: "0", max: "12" }}
            onChange={handleChange}
            value={values.validity}
            name="validity"
            label="Plan Validity (Month)"
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            fullWidth
            type="number"
            inputProps={{ min: "0" }}
            onChange={handleChange}
            value={values.driveIn}
            name="driveIn"
            label="No of Drive-in"
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            fullWidth
            type="number"
            inputProps={{ min: "0" }}
            onChange={handleChange}
            value={values.mobile}
            name="mobile"
            label="No of Mobile"
          />
        </Grid>
        <Grid item xs={3}>
          <Typography>
            Total Inspections:{" "}
            {parseInt(values.driveIn) + parseInt(values.mobile)}
          </Typography>
        </Grid>
        <Grid item xs mt={1} sx={{ mx: "auto" }}>
          <LoadingButton
            loading={partnerReducer.addPlanStatus === "loading"}
            type="submit"
            variant="contained"
            color="info"
            fullWidth
            endIcon={<Save />}
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}
