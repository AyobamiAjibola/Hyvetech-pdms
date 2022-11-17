import React from "react";
import { FieldArray, Form, useFormikContext } from "formik";
import { Divider, Grid, Typography } from "@mui/material";
import rideShareSettingsModel, { IRideShareSettings } from "../models/rideShareSettingsModel";
import TextInputField from "../fields/TextInputField";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Add, Remove, Save } from "@mui/icons-material";
import DateInputField from "../fields/DateInputField";
import { LoadingButton } from "@mui/lab";

function RideShareSettingsForm() {
  const { handleChange, values } = useFormikContext<IRideShareSettings>();
  return (
    <Form>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={4}>
          <TextInputField
            onChange={handleChange}
            value={values.totalStaff}
            name={rideShareSettingsModel.fields.totalStaff.name}
            label={rideShareSettingsModel.fields.totalStaff.label}
            type="number"
            inputProps={{ min: "0" }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextInputField
            onChange={handleChange}
            value={values.cac}
            name={rideShareSettingsModel.fields.cac.name}
            label={rideShareSettingsModel.fields.cac.label}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DateInputField
            views={["year"]}
            value={values.yearOfIncorporation}
            name={rideShareSettingsModel.fields.yearOfIncorporation.name}
            label={rideShareSettingsModel.fields.yearOfIncorporation.label}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />
          <Typography variant="h6" display="block">
            Brands
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <FieldArray
            name={rideShareSettingsModel.fields.brands.name}
            render={(arrayHelpers) => {
              return (
                <React.Fragment>
                  {values.brands.length > 0 &&
                    values.brands.map((brand, index) => {
                      return (
                        <Grid container item spacing={2} xs={12} key={index} columns={13}>
                          {Object.keys(brand).map((value) => (
                            <React.Fragment key={`${value}`}>
                              {value === "image" ? (
                                <Grid item xs={4} sx={{ mb: 2 }}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="file"
                                    inputProps={{
                                      accept: ".png, .jpg, .jpeg",
                                    }}
                                    name={`parameter.${index}.${value}`}
                                    onChange={handleChange}
                                    value={brand.image}
                                  />
                                </Grid>
                              ) : (
                                <Grid item xs={4} sx={{ mb: 2 }}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name={`brand.${index}.${value}`}
                                    label={value}
                                    onChange={handleChange}
                                  />
                                </Grid>
                              )}
                            </React.Fragment>
                          ))}
                          <Grid item xs={1}>
                            <IconButton onClick={() => arrayHelpers.remove(index)}>
                              <Remove />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                  <Grid item xs>
                    <IconButton
                      onClick={() =>
                        arrayHelpers.push({
                          name: "",
                          description: "",
                          image: "",
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
        <Grid item xs={12}>
          <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />
          <Typography variant="h6" display="block">
            Working Hours
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <FieldArray
            name={rideShareSettingsModel.fields.workingHours.name}
            render={(arrayHelpers) => {
              return (
                <React.Fragment>
                  {values.workingHours.length > 0 &&
                    values.workingHours.map((workingHour, index) => {
                      return (
                        <Grid container item spacing={2} xs={12} key={index} columns={13}>
                          {Object.keys(workingHour).map((value) => (
                            <React.Fragment key={`${value}`}>
                              <Grid item xs={6} sx={{ mb: 2 }}>
                                <DateInputField
                                  fullWidth
                                  variant="outlined"
                                  name={`workingHour.${index}.${value}`}
                                  label={value}
                                  //@ts-ignore
                                  value={workingHour[value]}
                                  views={["day"]}
                                />
                              </Grid>
                            </React.Fragment>
                          ))}
                          <Grid item xs={1}>
                            <IconButton onClick={() => arrayHelpers.remove(index)}>
                              <Remove />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                  <Grid item xs>
                    <IconButton
                      onClick={() =>
                        arrayHelpers.push({
                          from: new Date(),
                          to: new Date(),
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
        <Grid item xs={12}>
          <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />
          <Typography variant="h6" display="block">
            Images
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <FieldArray
            name={rideShareSettingsModel.fields.images.name}
            render={(arrayHelpers) => {
              return (
                <React.Fragment>
                  {values.images.length > 0 &&
                    values.images.map((image, index) => {
                      return (
                        <Grid container item spacing={2} xs={12} key={index} columns={13}>
                          {Object.keys(image).map((value) => (
                            <React.Fragment key={`${value}`}>
                              <Grid item xs={11} sx={{ mb: 2 }}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name={`image.${index}.${value}`}
                                  //@ts-ignore
                                  value={image[value]}
                                  type="file"
                                  inputProps={{
                                    accept: ".png, .jpg, .jpeg",
                                  }}
                                />
                              </Grid>
                            </React.Fragment>
                          ))}
                          <Grid item xs={1}>
                            <IconButton onClick={() => arrayHelpers.remove(index)}>
                              <Remove />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                  <Grid item xs>
                    <IconButton onClick={() => arrayHelpers.push({ value: "" })}>
                      <Add />
                    </IconButton>
                  </Grid>
                </React.Fragment>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LoadingButton type="submit" fullWidth variant="outlined" color="primary" size="large" endIcon={<Save />}>
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}

export default RideShareSettingsForm;
