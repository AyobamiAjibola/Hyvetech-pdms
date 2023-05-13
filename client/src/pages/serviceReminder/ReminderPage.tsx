import { Box, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IServiceReminder } from '@app-models';
import { useLocation } from 'react-router-dom';
import reminderModel from '../../components/forms/models/reminderModel';
import moment from 'moment';
import capitalize from 'capitalize';
import { ArrowBackIosNew } from '@mui/icons-material';
// import { CustomHookMessage } from '@app-types';

interface ILocationState {
  reminder?: IServiceReminder;
}

const { fields } = reminderModel;

function ReminderPage () {
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [reminder, setReminder] = useState<IServiceReminder>();
    // const [error, setError] = useState<CustomHookMessage>();

    const location = useLocation();

    useEffect(() => {
      if (location.state) {
        const state = location.state as ILocationState;
        setReminder(state.reminder);
      }
    }, [location]);

    console.log(reminder, 'reminder')
    const handleShare = async () => {
        const message = `Hello [${reminder?.customer?.title ? capitalize.words(reminder?.customer?.title) : ''} ${reminder?.customer?.firstName && capitalize.words(reminder?.customer?.firstName)} ${reminder?.customer?.lastName && capitalize.words(reminder?.customer?.lastName)}],
        [${reminder && capitalize.words(reminder?.reminderType)}] for your. [${reminder && capitalize.words(reminder?.vehicle?.modelYear)} ${reminder && capitalize.words(reminder?.vehicle?.model)} ${reminder && capitalize.words(reminder?.vehicle?.make)}]
        is due on [${moment(reminder?.nextServiceDate).format('ddd - Do - MMM - YYYY')}].
        Should I send you an estimate and schedule you in?`
        try {

          const shareData = {
            title: 'Reminder',
            text: `${message}`
          };

          await navigator.share(shareData);

          console.log('File shared successfully');
        } catch (error) {
          console.error('Error sharing file:', error);
        }
    };

    const handleDelete = () => {
    //   _reminder.onDelete(reminder?.id)
    }

    const handleChange = (event: any) => {
        const value = event.target.value as string;
        setSelectedValue(value);
        if (value === "Share Reminder") {
          handleShare()
          setTimeout(() => {
            setSelectedValue('')
          }, 3000)
        }
        if(value === "Delete Reminder") {
          handleDelete()
        }
    };

    return (
      <React.Fragment>
        <Grid item xs={12} container
          sx={{
            display: 'flex', flexDirection: 'column', p: 6
          }}
        >
          <Grid container item xs={12}>
            <Grid item xs={6}
                sx={{
                display: 'flex', justifyContent: 'center',
                alignItems: 'left', flexDirection: 'column'
                }}
            >
              <ArrowBackIosNew
                onClick={() => window.history.back()}
                style={{ position: 'absolute', cursor: 'pointer' }}
              />
              <Typography variant="h5" ml={6}>
                Reminder Summary
              </Typography>
            </Grid>
            <Grid item xs={6}/>
          </Grid>

          <Grid item xs={12}>
            <Divider orientation="horizontal" />
          </Grid>

          <Grid>
            <Box component='div' sx={{ display: 'flex', justifyContent: {sm: 'space-between', xs: 'space-between'}, alignItems: 'center' }}>
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: {sm: 'row', xs: 'column'},
                    gap: {sm: 0, xs: 1}
                  }}
                >
                  <FormControl sx={{ m: 1, width: {sm: 300, xs: 170} }}>
                    <InputLabel id="demo-simple-select-helper-label">Select an action</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={selectedValue}
                        label="Select an action"
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                        ...
                        </MenuItem>
                        <MenuItem value={'Generate Invoice'}>
                          <Link to="/estimates" style={{textDecoration: 'none'}}>
                            Estimate
                          </Link>
                        </MenuItem>
                        <MenuItem value={'Share Reminder'}>Share Reminder</MenuItem>
                        <MenuItem value={'Delete Reminder'}>Delete Reminder</MenuItem>
                      </Select>
                    </FormControl>
                </Box>
            </Box>
          </Grid>

            <Grid
              sx={{
                display: 'flex',
                flexDirection: "row", gap: 4,
               }} item xs={12}
            >
              <Grid item md={4} xs={12} mb={4}
                justifyContent='left' alignItems='left' flexDirection='column'
              >
                <Typography gutterBottom sx={{fontSize: {xs: '18px', sm: '20px'}, fontWeight: 600}}>
                  Customer Detail
                </Typography>
                <Stack>
                  <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                    {reminder?.customer?.lastName} {reminder?.customer?.firstName}
                  </Typography>
                  <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                    {reminder?.customer.email}
                  </Typography>
                  <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                    {reminder?.customer.phone}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item md={4} xs={12}>
                <Typography gutterBottom sx={{fontSize: {xs: '18px', sm: '20px'}, fontWeight: 600}}>
                  Vehicle
                </Typography>
                <Stack>
                    <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                        {reminder?.vehicle?.make} {reminder?.customer?.firstName}
                    </Typography>
                    <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                        {reminder?.vehicle.model}
                    </Typography>
                    <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                        {reminder?.vehicle.modelYear}
                    </Typography>
                </Stack>
              </Grid>

              <Grid md={4}/>
            </Grid>

            <Grid item xs={12}>
                <Divider orientation="horizontal" />
            </Grid>

            <Grid item xs={12}
                sx={{
                    gap: 4, display: 'flex',
                    flexDirection: 'row'
                }}
                mt={4}
            >
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name={fields.reminderType.name}
                    label={fields.reminderType.label}
                    value={reminder?.reminderType}
                    InputProps={{
                      readOnly: true
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name={fields.lastServiceDate.name}
                    label={fields.lastServiceDate.label}
                    value={moment(reminder?.lastServiceDate).format('ddd - Do - MMM - YYYY')}
                    InputProps={{
                      readOnly: true
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                    fullWidth
                    variant="outlined"
                    name={fields.serviceInterval.name}
                    label={fields.serviceInterval.label}
                    value={reminder?.serviceInterval}
                    InputProps={{
                        readOnly: true
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    />
                </Grid>
              </Grid>

              <Grid item xs={12}
                sx={{
                    gap: 4, display: 'flex',
                    flexDirection: 'row', justifyContent: 'center',
                    alignItems: 'center'
                }}
                mt={4}
              >
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name={fields.serviceIntervalUnit.name}
                    label={fields.serviceIntervalUnit.label}
                    value={reminder?.serviceIntervalUnit}
                    InputProps={{
                      readOnly: true
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name={fields.nextServiceDate.name}
                    label={fields.nextServiceDate.label}
                    value={moment(reminder?.nextServiceDate).format('ddd - Do - MMM - YYYY')}
                    InputProps={{
                        readOnly: true
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name={fields.reminderStatus.name}
                    label={fields.reminderStatus.label}
                    value={reminder?.reminderStatus}
                    InputProps={{
                      readOnly: true
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
            </Grid>

            <Grid item xs={12}
                sx={{
                    gap: 4, display: 'flex',
                    flexDirection: 'row', justifyContent: 'center',
                    alignItems: 'center'
                }}
                mt={4}
            >
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  name={fields.serviceStatus.name}
                  label={fields.serviceStatus.label}
                  value={reminder?.serviceStatus}
                  InputProps={{
                    readOnly: true
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                fullWidth
                variant="outlined"
                name={fields.recurring.name}
                label={fields.recurring.label}
                value={reminder?.recurring}
                InputProps={{
                  readOnly: true
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              </Grid>
              <Grid item xs={4}>
                <TextField
                fullWidth
                variant="outlined"
                name={fields.note.name}
                label={fields.note.label}
                value={reminder?.note}
                InputProps={{
                  readOnly: true
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                />
              </Grid>
            </Grid>

        </Grid>
      </React.Fragment>
    )
}

export default ReminderPage