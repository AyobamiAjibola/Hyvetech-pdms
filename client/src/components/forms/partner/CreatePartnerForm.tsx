import * as React from "react";
import { useEffect, useState } from "react";
import SelectField, { ISelectData } from "../fields/SelectField";
import { Form, useFormikContext } from "formik";
import partnerModel, { ICreatePartnerModel } from "../models/partnerModel";
import useAppSelector from "../../../hooks/useAppSelector";
import { Grid } from "@mui/material";
import TextInputField from "../fields/TextInputField";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";

const categories = [
  { label: "Garage", value: "Garage" },
  { label: "Ride-Share", value: "Ride-Share" },
];

interface ICreateFormProps {
  createPartner: boolean;
}

export default function CreatePartnerForm(props: ICreateFormProps) {
  const [states, setStates] = useState<ISelectData[]>([]);

  const { handleChange, values, resetForm } =
    useFormikContext<ICreatePartnerModel>();

  const miscReducer = useAppSelector((state) => state.miscellaneousReducer);
  const partnerReducer = useAppSelector((state) => state.partnerReducer);

  useEffect(() => {
    if (!props.createPartner) {
      resetForm();
    }
  }, [props.createPartner, resetForm]);

  useEffect(() => {
    if (miscReducer.getStatesAndDistrictsStatus === "completed") {
      setStates(
        miscReducer.states.map((state) => ({
          label: state.name,
          value: state.alias,
        }))
      );
    }
  }, [miscReducer.getStatesAndDistrictsStatus, miscReducer.states]);

  return (
    <Form autoComplete="off">
      <Grid
        container
        sx={{ p: 2 }}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.name}
            name={partnerModel.fields.name.name}
            label={partnerModel.fields.name.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.email}
            name={partnerModel.fields.email.name}
            label={partnerModel.fields.email.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.phone}
            name={partnerModel.fields.phone.name}
            label={partnerModel.fields.phone.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectField
            onChange={handleChange}
            value={values.category}
            name={partnerModel.fields.category.name}
            label={partnerModel.fields.category.label}
            data={categories}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectField
            onChange={handleChange}
            value={values.state}
            name={partnerModel.fields.state.name}
            label={partnerModel.fields.state.label}
            data={states}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={partnerReducer.createPartnerStatus === "loading"}
            fullWidth
            color="primary"
            endIcon={<Save />}
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}
