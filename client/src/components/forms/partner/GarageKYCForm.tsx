import React from "react";
import { Form, useFormikContext } from "formik";
import { Grid } from "@mui/material";
import partnerModel, { IKycValues } from "../models/partnerModel";
import TextInputField from "../fields/TextInputField";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";

interface IProps {
  isSubmitting?: boolean;
}

const { fields } = partnerModel;

function GarageKycForm(props: IProps) {
  const { handleChange, values } = useFormikContext<IKycValues>();

  return (
    <Form autoComplete="off">
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.name}
            name={fields.name.name}
            label={fields.name.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.nameOfDirector}
            name={fields.nameOfDirector.name}
            label={fields.nameOfDirector.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.nameOfManager}
            name={fields.nameOfManager.name}
            label={fields.nameOfManager.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.cac}
            name={fields.cac.name}
            label={fields.cac.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.vatNumber}
            name={fields.vatNumber.name}
            label={fields.vatNumber.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.workshopAddress}
            name={fields.workshopAddress.name}
            label={fields.workshopAddress.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LoadingButton
            loading={props.isSubmitting}
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<Save />}
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}

export default GarageKycForm;
