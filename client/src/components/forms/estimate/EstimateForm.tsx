import React, { useMemo } from "react";
import { FieldArray, Form, useFormikContext } from "formik";
import { Divider, Grid, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Add, Remove, Save } from "@mui/icons-material";
import estimateModel, { IEstimateValues } from "../models/estimateModel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import TextInputField from "../fields/TextInputField";
import { formatNumberToIntl } from "../../../utils/generic";
import SelectField from "../fields/SelectField";

interface IProps {
  isSubmitting?: boolean;
}

const { fields } = estimateModel;

function EstimateForm(props: IProps) {
  const { values, handleChange } = useFormikContext<IEstimateValues>();

  const totalPartsCost = useMemo(() => {
    let total = 0;

    for (const part of values.parts) total += parseInt(part.cost);

    return formatNumberToIntl(total);
  }, [values.parts]);

  return (
    <Form autoComplete="off" autoCorrect="off">
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ p: 1 }}
      >
        <Grid item xs={12}>
          <Typography gutterBottom variant="subtitle1" component="h1">
            Customer Information
          </Typography>
          <Divider orientation="horizontal" />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            onChange={handleChange}
            label={fields.firstName.label}
            value={values.firstName}
            name={fields.firstName.name}
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            onChange={handleChange}
            label={fields.lastName.label}
            value={values.lastName}
            name={fields.lastName.name}
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            type="tel"
            onChange={handleChange}
            label={fields.phone.label}
            value={values.phone}
            name={fields.phone.name}
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            onChange={handleChange}
            value={values.address}
            name={fields.address.name}
            label={fields.address.label}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom variant="subtitle1" component="h1">
            Vehicle Information
          </Typography>
          <Divider orientation="horizontal" />
        </Grid>
        <Grid item xs={4}>
          <TextInputField
            onChange={handleChange}
            label={fields.vin.label}
            value={values.vin}
            name={fields.vin.name}
          />
        </Grid>
        <Grid item xs={4}>
          <TextInputField
            onChange={handleChange}
            label={fields.modelYear.label}
            value={values.modelYear}
            name={fields.modelYear.name}
          />
        </Grid>
        <Grid item xs={4}>
          <TextInputField
            onChange={handleChange}
            label={fields.make.label}
            value={values.make}
            name={fields.make.name}
          />
        </Grid>
        <Grid item xs={4}>
          <TextInputField
            onChange={handleChange}
            value={values.model}
            name={fields.model.name}
            label={fields.model.label}
          />
        </Grid>
        <Grid item xs={4}>
          <TextInputField
            onChange={handleChange}
            value={values.plateNumber}
            name={fields.plateNumber.name}
            label={fields.plateNumber.label}
          />
        </Grid>
        <Grid item xs={4} container spacing={0.5}>
          <Grid item xs={8}>
            <TextInputField
              onChange={handleChange}
              value={values.mileage.count}
              name="mileage.count"
              label={fields.mileage.label}
            />
          </Grid>
          <Grid item xs>
            <SelectField
              data={[
                { label: "mph", value: "mph" },
                { label: "kmph", value: "kmph" },
              ]}
              onChange={handleChange}
              value={values.mileage.unit}
              name="mileage.unit"
              label="Unit"
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom variant="subtitle1" component="h1">
            {fields.parts.label}
          </Typography>
          <Divider orientation="horizontal" />
        </Grid>
        <Grid item xs={12} container>
          <FieldArray
            name={fields.parts.name}
            render={(partsProps) => {
              return (
                <React.Fragment>
                  {values.parts.length > 0 &&
                    values.parts.map((part, index) => {
                      return (
                        <Grid
                          container
                          item
                          spacing={2}
                          xs={12}
                          key={index}
                          columns={13}
                        >
                          {Object.keys(part).map((value) => {
                            return (
                              <React.Fragment key={`${value}`}>
                                {value === "warranty" ? (
                                  <Grid item xs={3} container spacing={0.5}>
                                    {Object.keys(part.warranty).map(
                                      (warranty, idx1) => {
                                        return warranty === "count" ? (
                                          <Grid key={idx1} item xs={8}>
                                            <TextInputField
                                              onChange={handleChange}
                                              value={values.jobDuration.count}
                                              name="jobDuration.count"
                                              label={warranty}
                                            />
                                          </Grid>
                                        ) : (
                                          <Grid key={idx1} item xs>
                                            <TextInputField
                                              onChange={handleChange}
                                              value={values.jobDuration.count}
                                              name="jobDuration.count"
                                              label={warranty}
                                            />
                                          </Grid>
                                        );
                                      }
                                    )}
                                  </Grid>
                                ) : (
                                  <Grid item xs={3} sx={{ mb: 2 }}>
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      name={`parts.${index}.${value}`}
                                      label={value}
                                      //@ts-ignore
                                      value={part[value]}
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                )}
                              </React.Fragment>
                            );
                          })}
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => partsProps.remove(index)}
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
                        partsProps.push({
                          name: "",
                          warranty: { count: "", interval: "" },
                          quantity: { count: "", unit: "" },
                          cost: "",
                        })
                      }
                    >
                      <Add />
                    </IconButton>
                  </Grid>
                  <Grid item xs={12} container spacing={2} columns={13}>
                    <Grid item xs={8} />
                    <Grid item xs={4}>
                      Total: {totalPartsCost}
                    </Grid>
                    <Grid item />
                  </Grid>
                </React.Fragment>
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom variant="subtitle1" component="h1">
            {fields.labours.label}
          </Typography>
          <Divider orientation="horizontal" />
        </Grid>
        <Grid item xs={12} container>
          <FieldArray
            name={fields.labours.name}
            render={(laboursProps) => {
              return (
                <React.Fragment>
                  {values.labours.length > 0 &&
                    values.labours.map((labour, index) => {
                      return (
                        <Grid
                          container
                          item
                          spacing={2}
                          xs={12}
                          key={index}
                          columns={13}
                        >
                          {Object.keys(labour).map((value) => {
                            return (
                              <React.Fragment key={`${value}`}>
                                <Grid
                                  item
                                  xs={value === "title" ? 8 : 4}
                                  sx={{ mb: 2 }}
                                >
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name={`labours.${index}.${value}`}
                                    label={value}
                                    //@ts-ignore
                                    value={labour[value]}
                                    onChange={handleChange}
                                  />
                                </Grid>
                              </React.Fragment>
                            );
                          })}
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => laboursProps.remove(index)}
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
                        laboursProps.push({
                          title: "",
                          cost: "",
                        })
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
        <Grid item xs={12} container spacing={2} columns={13}>
          <Grid item xs={8} />
          <Grid item xs={4}>
            <TextField
              name={fields.tax.name}
              value={values.tax}
              label={`${fields.tax.label} (VAT)`}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom variant="subtitle1" component="h1">
            Job Information
          </Typography>
          <Divider flexItem orientation="horizontal" />
        </Grid>
        <Grid item xs={6}>
          <TextInputField
            onChange={handleChange}
            value={values.depositAmount}
            name={fields.depositAmount.name}
            label={fields.depositAmount.label}
          />
        </Grid>
        <Grid item xs={6} container spacing={0.5}>
          <Grid item xs={8}>
            <TextInputField
              onChange={handleChange}
              value={values.jobDuration.count}
              name="jobDuration.count"
              label={fields.jobDuration.label}
            />
          </Grid>
          <Grid item xs>
            <SelectField
              data={[
                { label: "week", value: "week" },
                { label: "month", value: "month" },
                { label: "year", value: "year" },
              ]}
              onChange={handleChange}
              value={values.jobDuration.interval}
              name="jobDuration.interval"
              label="Interval"
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mb: 1 }} flexItem orientation="horizontal" />
          <LoadingButton
            type="submit"
            loading={props.isSubmitting}
            disabled={props.isSubmitting}
            variant="contained"
            color="secondary"
            endIcon={<Save />}
            size="large"
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}

export default EstimateForm;
