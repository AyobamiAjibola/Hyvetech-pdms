import {
  Box,
  Button,
  DialogActions,
  DialogContentText,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { IServiceReminder } from '@app-models';
import { useLocation, useNavigate } from 'react-router-dom';
import reminderModel from '../../components/forms/models/reminderModel';
import moment from 'moment';
import capitalize from 'capitalize';
import { ArrowBackIosNew } from '@mui/icons-material';
import { deleteReminderAction, getReminderAction, resetLastDateAction } from '../../store/actions/serviceReminderActions';
import useAppDispatch from '../../hooks/useAppDispatch';
import { MESSAGES } from '../../config/constants';
import AppModal from '../../components/modal/AppModal';
import AppLoader from '../../components/loader/AppLoader';
import useAppSelector from '../../hooks/useAppSelector';
import { clearDeleteReminderStatus } from '../../store/reducers/serviceReminderReducer';
import { CustomHookMessage } from '@app-types';
import AppAlert from '../../components/alerts/AppAlert';
import { marked } from '../../utils/generic';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  select: {
    '&:hover': {
      background: '#F1F0F1'
    },
  },
});

interface ILocationState {
  reminder?: IServiceReminder;
}

const { fields } = reminderModel;

function ReminderPage () {
  const classes = useStyles();
  const reminderReducer = useAppSelector(state => state.serviceReminderReducer);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [reminder, setReminder] = useState<IServiceReminder>();
    const [_delete, _setDelete] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [success, setSuccess] = useState<CustomHookMessage>();
    const [error, setError] = useState<CustomHookMessage>();
    const [resetServiceDate, setResetServiceDate] = useState<boolean>(false);
    const [markedStatus, setMarkedStatus] = useState<string>('');
    const navigate = useNavigate()

    const location = useLocation();

    useEffect(() => {
      if (location.state) {
        const state = location.state as ILocationState;
        setReminder(state.reminder);
      }
    }, [location]);

    const handleReset = useCallback(() => {
      dispatch(clearDeleteReminderStatus())
  }, [dispatch]);

    const handleShare = async () => {
      const message = `Hello ${reminder?.customer?.title ? capitalize.words(reminder?.customer?.title) : ''} ${reminder?.customer?.firstName && capitalize.words(reminder?.customer?.firstName)} ${reminder?.customer?.lastName && capitalize.words(reminder?.customer?.lastName)},\n
${reminder && capitalize.words(reminder?.reminderType)} for your. ${reminder && capitalize.words(reminder?.vehicle?.modelYear)} ${reminder && capitalize.words(reminder?.vehicle?.model)} ${reminder && capitalize.words(reminder?.vehicle?.make)}
is due on ${moment(reminder?.nextServiceDate).format('ddd - Do - MMM - YYYY')}.\n
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
      const reminderId = reminder?.id !== undefined ? reminder?.id : -1
      dispatch(deleteReminderAction(reminderId));
    }

    const confirm_delete = () => {
      _setDelete(true)
    }

    const _resetServiceDate = () => {

      const data ={
        id: reminder?.id,
      }
      void dispatch(resetLastDateAction(data))
    }

    useEffect(() => {
      if (reminderReducer.deleteReminderStatus === 'failed') {
        setError({ message: reminderReducer.deleteReminderError });
        handleReset();
      }
    }, [reminderReducer.deleteReminderError, reminderReducer.deleteReminderStatus, handleReset]);

    useEffect(() => {
      if (reminderReducer.deleteReminderStatus === 'completed') {
        navigate('/reminders', {replace: true})
        dispatch(getReminderAction());
      }
    }, [dispatch, reminderReducer.deleteReminderStatus, reminderReducer.deleteReminderSuccess, handleReset]);

    const data: any = {
      open_modal: 'true',
      id: reminder?.id
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
        confirm_delete()
        setTimeout(() => {
          setSelectedValue('')
        }, 3000)
      }

      if(value === "Generate Estimate") {
        navigate('/estimates');
        Object.entries(data).forEach(([key, value]) => {
          //@ts-ignore
          sessionStorage.setItem(key, value);
        });
      }

      if(value === "Service Status"){
        setResetServiceDate(true)
        setTimeout(() => {
          setSelectedValue('')
        }, 3000)
      }
    };

    useEffect(() => {
      if(reminderReducer.updateReminderStatus === 'completed') {
        setSuccess({ message: reminderReducer.updateReminderSuccess });
        navigate('/reminders')
        dispatch(getReminderAction());
      }
    }, [reminderReducer.updateReminderStatus]);

    useEffect(() => {
      const today = new Date();
      const marked_status = marked(reminder?.lastServiceDate, today);
      setMarkedStatus(marked_status);
    }, [reminder?.lastServiceDate])

    return (
      <React.Fragment>
        <Grid item xs={12} container
          sx={{
            display: 'flex', flexDirection: 'column', p: {md: 6, xs: 0}
          }}
        >
          <Grid container item xs={12}>
            <Grid item md={6} xs={12}
                sx={{
                display: 'flex', justifyContent: 'center',
                alignItems: 'left', flexDirection: 'column'
                }}
            >
              <ArrowBackIosNew
                onClick={() => window.history.back()}
                style={{ position: 'absolute', cursor: 'pointer' }}
              />
              <Typography variant="h6" ml={6}>
                Reminder Summary
              </Typography>
            </Grid>
            <Grid item xs={6}/>
          </Grid>

          <Grid item xs={12}>
            <Divider orientation="horizontal" />
          </Grid>

          <Grid item
            sx={{
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'right',
              mb: 2, mt: 2
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
                  <MenuItem value={'Generate Estimate'} className={classes.select}
                  >Generate Estimate</MenuItem>
                  <MenuItem value={'Share Reminder'} className={classes.select}
                  >Share Reminder</MenuItem>
                  <MenuItem value={'Delete Reminder'} className={classes.select}
                  >Delete Reminder</MenuItem>
                  <Divider orientation='horizontal'/>
                  <ListSubheader
                    sx={{fontFamily: "montserrat"}}
                  >Service Status</ListSubheader>
                  <MenuItem value={'Service Status'} className={classes.select}
                  >Mark as done</MenuItem>
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-between'
                    }}
                  >
                    <MenuItem></MenuItem>
                    <Typography
                      sx={{
                        fontSize: '12px', pl: 1, pr: 1, mr: 1,
                        fontStyle: 'italic'
                      }}
                    >
                      Marked done {markedStatus}
                    </Typography>
                  </Box>
                </Select>
            </FormControl>
          </Grid>

          <Grid
            sx={{
              display: 'flex',
              flexDirection: {md: "row", xs: 'column'},
              gap: {md: 4, xs: 0},
              }} item xs={12}
          >
            <Grid item md={4} xs={12} mb={2}
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
                  {reminder?.customer?.email}
                </Typography>
                <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                  {reminder?.customer?.phone}
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
                      {reminder?.vehicle?.model}
                  </Typography>
                  <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                      {reminder?.vehicle?.modelYear}
                  </Typography>
              </Stack>
            </Grid>

            <Grid item md={4}/>
          </Grid>

          <Grid item xs={12}>
            <Divider orientation="horizontal" />
          </Grid>

          <Grid item xs={12}
            sx={{
                gap: 4, display: 'flex',
                flexDirection: {md: 'row', xs: 'column'}
            }}
            mt={4}
          >
            <Grid item md={4} xs={12}>
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
            <Grid item md={4} xs={12}>
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
            <Grid item md={4} xs={12}>
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
              flexDirection: {md: 'row', xs: 'column'}
            }}
            mt={4}
          >
            <Grid item md={4} xs={12}>
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
            <Grid item md={4} xs={12}>
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
            <Grid item md={4} xs={12}>
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
              flexDirection: {md: 'row', xs: 'column'}
            }}
            mt={4}
          >
            <Grid item md={4} xs={12}
              sx={{
                gap: 1, display: 'flex',
                flexDirection: 'row'
              }}
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  name={fields.lastServiceMileage.name}
                  label={fields.lastServiceMileage.label}
                  value={reminder?.lastServiceMileage}
                  InputProps={{
                    readOnly: true
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="string"
                  variant="outlined"
                  name={fields.lastServiceMileageUnit.name}
                  label={fields.lastServiceMileageUnit.label}
                  value={reminder?.lastServiceMileageUnit}
                  InputProps={{
                    readOnly: true
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <Grid item md={4} xs={12}
              sx={{
                gap: 1, display: 'flex',
                flexDirection: 'row'
              }}
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  name={fields.nextServiceMileage.name}
                  label={fields.nextServiceMileage.label}
                  value={reminder?.nextServiceMileage}
                  InputProps={{
                    readOnly: true
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="string"
                  variant="outlined"
                  name={fields.nextServiceMileageUnit.name}
                  label={fields.nextServiceMileageUnit.label}
                  value={reminder?.nextServiceMileageUnit}
                  InputProps={{
                    readOnly: true
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <Grid item md={4} xs={12} />
          </Grid>

          <Grid item xs={12}
            sx={{
              gap: 4, display: 'flex',
              flexDirection: {md: 'row', xs: 'column'}
            }}
            mt={4}
          >
            <Grid item md={4} xs={12}>
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
            <Grid item md={4} xs={12}>
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
            <Grid item md={4} xs={12}>
              <TextField
              fullWidth
              multiline
              rows={4}
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
        <AppModal
          fullWidth
          show={_delete}
          Content={<DialogContentText>{MESSAGES.delete_reminder}</DialogContentText>}
          ActionComponent={
            <DialogActions>
              <Button onClick={() => _setDelete(false)}>Disagree</Button>
              <Button onClick={handleDelete}>Agree</Button>
            </DialogActions>
          }
          onClose={() => _setDelete(false)}
        />
        <AppModal
          fullWidth
          show={resetServiceDate}
          Content={
            <DialogContentText>
              {reminder?.recurring === 'no'
                ? MESSAGES.delete_reminder_reset
                : MESSAGES.reset_reminder
              }
            </DialogContentText>}
          ActionComponent={
            <DialogActions>
              <Button onClick={() => setResetServiceDate(false)}>Disagree</Button>
              <Button onClick={_resetServiceDate}>Agree</Button>
            </DialogActions>
          }
          onClose={() => _setDelete(false)}
        />
        <AppLoader
          show={reminderReducer.deleteReminderStatus === 'loading'}
        />
        <AppAlert
          alertType="success"
          show={undefined !== success}
          message={success?.message}
          onClose={() => setSuccess(undefined)}
        />
        <AppAlert
          alertType="error"
          show={undefined !== error}
          message={error?.message}
          onClose={() => setError(undefined)}
        />
      </React.Fragment>
    )
}

export default ReminderPage