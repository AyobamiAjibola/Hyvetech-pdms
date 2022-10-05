import React, { useContext, useEffect } from "react";
import { Form, useFormikContext } from "formik";
import { Divider, Grid } from "@mui/material";
import TextInputField from "../fields/TextInputField";
import technicianModel, { ITechnicianValues } from "../models/technicianModel";
import { LoadingButton } from "@mui/lab";
import { Send } from "@mui/icons-material";
import { TechniciansPageContext } from "../../../pages/technician/TechniciansPage";
import { TechniciansPageContextProps } from "@app-interfaces";
import SwitchField from "../fields/SwitchField";

const { fields } = technicianModel;

interface IProps {
  isSubmitting?: boolean;
}

function CreateTechnicianForm(props: IProps) {
  const { handleChange, values, resetForm } =
    useFormikContext<ITechnicianValues>();

  const { showCreate, showEdit } = useContext(
    TechniciansPageContext
  ) as TechniciansPageContextProps;

  useEffect(() => {
    if (!showCreate || !showEdit) {
      resetForm();
    }
  }, [resetForm, showCreate, showEdit]);

  return (
    <Form>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ p: 1 }}
      >
        <Grid item xs={12}>
          <SwitchField
            onChange={handleChange}
            value={values.active}
            name={fields.active.name}
            label={fields.active.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.firstName}
            name={fields.firstName.name}
            label={fields.firstName.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.lastName}
            name={fields.lastName.name}
            label={fields.lastName.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.email}
            name={fields.email.name}
            label={fields.email.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.phone}
            name={fields.phone.name}
            label={fields.phone.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.password}
            name={fields.password.name}
            label={fields.password.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.confirmPassword}
            name={fields.confirmPassword.name}
            label={fields.confirmPassword.label}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider orientation="horizontal" sx={{ my: 1 }} />
          <LoadingButton
            loading={props.isSubmitting}
            type="submit"
            variant="contained"
            color="secondary"
            endIcon={<Send />}
          >
            Submit
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}

export default CreateTechnicianForm;
