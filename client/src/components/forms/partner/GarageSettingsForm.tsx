import React, { useEffect, useState } from 'react';
import { FieldArray, Form, useFormikContext } from 'formik';
import { Autocomplete, Button, Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { Add, PhotoCamera, Remove, Save } from '@mui/icons-material';
import partnerModel, { IGarageSettings } from '../models/partnerModel';
import { LoadingButton } from '@mui/lab';
import TextInputField from '../fields/TextInputField';
import { DAYS } from '../../../config/constants';
import TimePickerField from '../fields/TimePickerField';
import { getImageUrl } from '../../../utils/generic';
import { getPayStackBanksAction } from '../../../store/actions/miscellaneousActions';
import useAppSelector from '../../../hooks/useAppSelector';
import useAppDispatch from '../../../hooks/useAppDispatch';
import { ISelectData } from '../fields/SelectField';

interface IProps {
  isSubmitting?: boolean;
}

const { fields } = partnerModel;

function GarageSettingsForm(props: IProps) {
  const [banks, setBanks] = useState<ISelectData[]>([]);

  const { values, handleChange, setFieldValue, errors, touched } = useFormikContext<IGarageSettings>();

  const miscellaneousReducer = useAppSelector(state => state.miscellaneousReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (miscellaneousReducer.getBanksStatus === 'idle') {
      void dispatch(getPayStackBanksAction());
    }
  }, [dispatch, miscellaneousReducer.getBanksStatus]);

  useEffect(() => {
    if (miscellaneousReducer.getBanksStatus === 'completed') {
      setBanks(
        miscellaneousReducer.banks
          .filter(value => value.active && value.country === 'Nigeria')
          .map(bank => ({
            label: bank.name,
            value: bank.code,
          })),
      );
    }
  }, [miscellaneousReducer.banks, miscellaneousReducer.getBanksStatus]);

  return (
    <Form>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item container xs={12} justifyContent="space-evenly" alignItems="center" spacing={2} mb={3}>
          <Grid item>
            <Button endIcon={<PhotoCamera />} color="primary" aria-label="upload picture" component="label">
              upload logo
              <input
                hidden
                name={fields.logo.name}
                onChange={event => {
                  const files = event.target.files;
                  if (files) {
                    setFieldValue(fields.logo.name, files[0]);
                  }
                }}
                accept="image/*"
                type="file"
              />
            </Button>
          </Grid>
          <Grid item xs>
            {values.logo && <img src={getImageUrl(values.logo)} crossOrigin="anonymous" width="10%" alt="logo" />}
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextInputField
            onChange={handleChange}
            value={values.phone}
            name={fields.phone.name}
            label={fields.phone.label}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextInputField
            onChange={handleChange}
            value={values.totalStaff}
            name={fields.totalStaff.name}
            label={fields.totalStaff.label}
            type="number"
            inputProps={{ min: '0' }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextInputField
            onChange={handleChange}
            value={values.totalTechnicians}
            name={fields.totalTechnicians.name}
            label={fields.totalTechnicians.label}
            type="number"
            inputProps={{ min: '0' }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextInputField
            onChange={handleChange}
            value={values.googleMap}
            name={fields.googleMap.name}
            label={fields.googleMap.label}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Bank Account</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={banks}
            value={{ label: values.bankName, value: values.bankName }}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            onChange={(_, value) => {
              if (value) setFieldValue(fields.bankName.name, value.label);
            }}
            renderInput={params => (
              <TextInputField
                {...params}
                name={fields.bankName.name}
                label={fields.bankName.label}
                onChange={handleChange}
                value={values.bankName}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextInputField
            onChange={handleChange}
            value={values.accountName}
            name={fields.accountName.name}
            label={fields.accountName.label}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextInputField
            onChange={handleChange}
            value={values.accountNumber}
            name={fields.accountNumber.name}
            label={fields.accountNumber.label}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Brands</Typography>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <FieldArray
            name={fields.brands.name}
            render={arrayHelpers => {
              return (
                <React.Fragment>
                  {values.brands.length > 0 &&
                    values.brands.map((brand, index) => {
                      return (
                        <Grid container item spacing={2} xs={12} key={index} columns={13}>
                          {Object.keys(brand).map(value => {
                            return (
                              <React.Fragment key={`${value}`}>
                                <Grid item xs={value === 'name' ? 13 : 12} sm={value === 'name' ? 4 : 8} sx={{ mb: 2 }}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name={`brands.${index}.${value}`}
                                    label={value}
                                    //@ts-ignore
                                    value={brand[value]}
                                    onChange={handleChange}
                                    error={undefined !== errors.brands && undefined !== touched.brands}
                                  />
                                </Grid>
                              </React.Fragment>
                            );
                          })}
                          <Grid item xs={1}>
                            <IconButton onClick={() => arrayHelpers.remove(index)}>
                              <Remove />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                  <Grid item xs>
                    {document.documentElement.clientWidth <= 375
                      ? <Button
                          onClick={() =>
                            arrayHelpers.push({
                              name: '',
                              description: '',
                            })
                          }>
                          {`Add brand`}
                        </Button>
                      : <IconButton
                          onClick={() =>
                            arrayHelpers.push({
                              name: '',
                              description: '',
                            })
                          }>
                          <Add />
                        </IconButton>
                    }
                  </Grid>
                </React.Fragment>
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Working Hours</Typography>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <FieldArray
            name={fields.workingHours.name}
            render={arrayHelpers => {
              // console.log(arrayHelpers)
              return (
                <React.Fragment>
                  {values.workingHours.length > 0 &&
                    values.workingHours.map((workingHour, index) => {
                      return (
                        <Grid container item spacing={2} xs={12} key={index} columns={13}>
                          {Object.keys(workingHour).map(value => {
                            return (
                              <React.Fragment key={`${value}`}>
                                {value === 'days' ? (
                                  <Grid item md={6} xs={12} sx={{ mb: 2 }}>
                                    <Autocomplete
                                      multiple
                                      options={DAYS}
                                      value={workingHour.days}
                                      onChange={(_, newValue) => {
                                        setFieldValue(`workingHours.${index}.${value}`, newValue);
                                      }}
                                      onInputChange={(_, newValue) => {
                                        setFieldValue(`workingHours.${index}.${value}`, newValue);
                                      }}
                                      renderInput={params => (
                                        <TextField {...params} name={`workingHours.${index}.${value}`} />
                                      )}
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item sm={3} md={3} xs={6} sx={{ mb: 2 }}>
                                    <TimePickerField
                                      fullWidth
                                      variant="outlined"
                                      name={`workingHours.${index}.${value}`}
                                      label={value}
                                      //@ts-ignore
                                      value={workingHour[value]}
                                    />
                                  </Grid>
                                )}
                              </React.Fragment>
                            );
                          })}
                          <Grid item xs={1}>
                            <IconButton onClick={() => arrayHelpers.remove(index)}>
                              <Remove />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                  <Grid item xs>
                    {document.documentElement.clientWidth <= 375
                      ? <Button
                          onClick={() =>
                            arrayHelpers.push({
                              days: [],
                              from: new Date(),
                              to: new Date(),
                            })
                          }>
                          {'Add working hour'}
                        </Button>
                      : <IconButton
                          onClick={() =>
                            arrayHelpers.push({
                              days: [],
                              from: new Date(),
                              to: new Date(),
                            })
                          }>
                          <Add />
                        </IconButton>
                    }
                  </Grid>
                </React.Fragment>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} mt={2}>
          <LoadingButton
            loading={props.isSubmitting}
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<Save />}>
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}

export default GarageSettingsForm;
