import React, { useEffect, useState } from "react";
import SelectField, { ISelectData } from "../fields/SelectField";
import { FieldArray, Form, useFormikContext } from "formik";
import useAppSelector from "../../../hooks/useAppSelector";
import {
  Divider,
  FormGroup,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Typography,
} from "@mui/material";
import TextInputField from "../fields/TextInputField";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Add, Remove, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import paymentPlanModel, {
  IPaymentPlanModel,
} from "../models/paymentPlanModel";

const units = ["None", "Litre"];
const intervals = [
  { label: "Annually", value: "annually" },
  { label: "Biannually", value: "biannually" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Monthly", value: "monthly" },
  { label: "Weekly", value: "weekly" },
  { label: "Daily", value: "daily" },
  { label: "Hourly", value: "hourly" },
];

export default function AddPaymentPlanForm() {
  const [plans, setPlans] = useState<ISelectData[]>([]);
  const { handleChange, values, errors, touched } =
    useFormikContext<IPaymentPlanModel>();

  const partnerReducer = useAppSelector((state) => state.partnerReducer);

  useEffect(() => {
    setPlans(
      partnerReducer.plans.map((plan) => {
        const label = plan.label.replaceAll("_", " ");

        return {
          label: label,
          value: plan.label,
        };
      })
    );
  }, [partnerReducer.plans]);

  return (
    <Form autoComplete="off">
      <Grid
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ p: 1 }}
        container
      >
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.name}
            name={paymentPlanModel.fields.name.name}
            label={paymentPlanModel.fields.name.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectField
            onChange={handleChange}
            value={values.plan}
            name={paymentPlanModel.fields.plan.name}
            label={paymentPlanModel.fields.plan.label}
            data={plans}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            value={values.discount}
            name={paymentPlanModel.fields.discount.name}
            label={paymentPlanModel.fields.discount.label}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectField
            onChange={handleChange}
            value={values.coverage}
            name={paymentPlanModel.fields.coverage.name}
            label={paymentPlanModel.fields.coverage.label}
            data={[{ label: "NationWide", value: "NATION_WIDE" }]}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />
          <Typography variant="subtitle1" display="block">
            Pricing Models
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <FieldArray
            name={paymentPlanModel.fields.pricing.name}
            render={(arrayHelpers) => {
              return (
                <React.Fragment>
                  {values.pricing.length > 0 &&
                    values.pricing.map((item, index) => {
                      return (
                        <Grid
                          container
                          item
                          spacing={2}
                          xs={12}
                          key={index}
                          columns={13}
                        >
                          {Object.keys(item).map((value) => {
                            return (
                              <React.Fragment key={`${value}`}>
                                {value === "interval" ? (
                                  <Grid item xs={6} sx={{ mb: 2 }}>
                                    <TextField
                                      select
                                      fullWidth
                                      variant="outlined"
                                      name={`pricing.${index}.${value}`}
                                      label={value}
                                      onChange={handleChange}
                                      value={item.interval}
                                    >
                                      {intervals.map((interval, index1) => (
                                        <MenuItem
                                          key={index1}
                                          value={interval.value}
                                        >
                                          {interval.label}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </Grid>
                                ) : (
                                  <Grid item xs={6} sx={{ mb: 2 }}>
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      name={`pricing.${index}.${value}`}
                                      label={value}
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                )}
                              </React.Fragment>
                            );
                          })}
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              <Remove />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                  <Grid item xs>
                    <IconButton
                      onClick={() =>
                        arrayHelpers.push({ interval: "", amount: "" })
                      }
                    >
                      <Add />
                    </IconButton>
                  </Grid>
                </React.Fragment>
              );
            }}
          />
          {errors?.pricing && touched?.pricing && (
            <FormHelperText>{errors?.pricing?.toString()}</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12}>
          <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />
          <Typography variant="subtitle1" display="block">
            Description(s)
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <FieldArray
            name={paymentPlanModel.fields.description.name}
            render={(arrayHelpers) => {
              return (
                <React.Fragment>
                  {values.description.length > 0 &&
                    values.description.map((item, index) => {
                      return (
                        <Grid item xs={11} key={index}>
                          {Object.keys(item).map((value) => (
                            <FormGroup key={`${value}`} sx={{ mb: 2 }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name={`description.${index}.${value}`}
                                label={
                                  paymentPlanModel.fields.description.label
                                }
                                onChange={handleChange}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      >
                                        <Remove />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </FormGroup>
                          ))}
                        </Grid>
                      );
                    })}
                  <Grid item xs>
                    <IconButton
                      onClick={() => arrayHelpers.push({ value: "" })}
                    >
                      <Add />
                    </IconButton>
                  </Grid>
                </React.Fragment>
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />
          <Typography gutterBottom variant="subtitle1" display="block">
            Parameter(s)
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <FieldArray
            name={paymentPlanModel.fields.parameter.name}
            render={(arrayHelpers) => {
              return (
                <React.Fragment>
                  {values.parameter.length > 0 &&
                    values.parameter.map((item, index) => {
                      return (
                        <Grid
                          container
                          item
                          spacing={2}
                          xs={12}
                          key={index}
                          columns={13}
                        >
                          {Object.keys(item).map((value) => (
                            <React.Fragment key={`${value}`}>
                              {value === "unit" ? (
                                <Grid item xs={4} sx={{ mb: 2 }}>
                                  <TextField
                                    select
                                    fullWidth
                                    variant="outlined"
                                    name={`parameter.${index}.${value}`}
                                    label={value}
                                    onChange={handleChange}
                                    value={item.unit}
                                  >
                                    {units.map((value1, index1) => (
                                      <MenuItem key={index1} value={value1}>
                                        {value1}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                              ) : (
                                <Grid item xs={4} sx={{ mb: 2 }}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name={`parameter.${index}.${value}`}
                                    label={value}
                                    onChange={handleChange}
                                  />
                                </Grid>
                              )}
                            </React.Fragment>
                          ))}
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              <Remove />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                  <Grid item xs>
                    <IconButton
                      onClick={() =>
                        arrayHelpers.push({ name: "", unit: "", value: "" })
                      }
                    >
                      <Add />
                    </IconButton>
                  </Grid>
                </React.Fragment>
              );
            }}
          />
        </Grid>
      </Grid>
      <Grid item mt={1} sx={{ mx: "auto" }}>
        <LoadingButton
          fullWidth
          variant="contained"
          type="submit"
          endIcon={<Save />}
        >
          Save
        </LoadingButton>
      </Grid>
    </Form>
  );
}
