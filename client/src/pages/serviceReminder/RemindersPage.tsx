/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import useReminder from "../../hooks/useReminder";
import ReminderPageContext from '../../context/ReminderPageContext';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { CustomHookMessage } from '@app-types';
import { getReminderAction, toggleReminderStatusAction } from '../../store/actions/serviceReminderActions';
import moment from 'moment';
import { Button, Chip, DialogActions, DialogContentText, Grid, Typography } from '@mui/material';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { IServiceReminder } from '@app-models';
import { Cancel, Edit, ToggleOff, ToggleOn } from '@mui/icons-material';
import { clearCreateReminderStatus, clearDeleteReminderStatus, clearGetRemindersStatus, clearToggleReminderStatus, clearUpdateReminderStatus } from '../../store/reducers/serviceReminderReducer';
import AppDataGrid from '../../components/tables/AppDataGrid';
import AppAlert from '../../components/alerts/AppAlert';
import AppModal from '../../components/modal/AppModal';
import AppLoader from '../../components/loader/AppLoader';
import { MESSAGES } from '../../config/constants';
import { Formik } from 'formik';
// import { reload } from '../../utils/generic';
import reminderModel from '../../components/forms/models/reminderModel';
import ReminderForm from '../../components/forms/reminder/ReminderForm';


function RemindersPage() {
    const reminderReducer = useAppSelector(state => state.serviceReminderReducer);
    const dispatch = useAppDispatch();
    const [_reminder, _setReminder] = useState<any>([]);
    const [success, setSuccess] = useState<CustomHookMessage>();
    const [error, setError] = useState<CustomHookMessage>();
    const [removeSessionStorage, setRemoveSessionStorage] = useState<boolean>(false);
    const navigate = useNavigate();

    const reminder = useReminder();

    useEffect(() => {
      const _temp01 = reminder.reminders;
      _setReminder(_temp01);
    }, [reminder.reminders]);

    const techColumns = useMemo(() => {
        return [
          {
            field: 'reminderType',
            headerName: 'Type',
            headerAlign: 'center',
            align: 'center',
            sortable: true,
            type: 'string',
            width: 150,
            renderCell: (params: any) => {
              return (
                <span
                  style={{ color: 'skyblue', cursor: 'pointer' }}
                  onClick={() => {
                    void dispatch(getReminderAction());
                    navigate(`/reminder/${params.row.id}`, { state: { reminder: params.row } });
                  }}>
                  {params.row.reminderType.toUpperCase()}
                </span>
              );
            },
          },
          {
            field: 'customer',
            headerName: 'Customer Name',
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            width: 200,
            renderCell: (params: any) => {
                return (
                    <span>{params.row.customer.firstName} {params.row.customer.lastName}</span>
                )
            }
          },
          {
            field: 'vehicle',
            headerName: 'Vehicle',
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            width: 200,
            renderCell: (params: any) => {
                return (
                    <span>{params.row.vehicle.modelYear} {params.row.vehicle.make} {params.row.vehicle.model}</span>
                )
            }
          },
          {
            field: 'lastServiceDate',
            headerName: 'Last Service Date',
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            renderCell: (params: any) => {
                const serviceDate = params.row.lastServiceDate
                return (
                    <span>{moment(serviceDate).format('DD/MM/YYYY')}</span>
                )
            },
            sortable: true,
            width: 200
          },
          {
            field: 'reminderStatus',
            headerName: 'Status',
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            width: 150,
            renderCell: (params: any) => {
              return (
                <>
                  {params.row.reminderStatus.split(" ")[0] === 'Overdue' || params.row.reminderStatus === 'Due today'
                    ? <span style={{color: 'red'}}>{params.row.reminderStatus}</span>
                    : params.row.reminderStatus === 'Not Available'
                      ? <span>{params.row.reminderStatus}</span>
                      : <span style={{color: 'green'}}>{params.row.reminderStatus}</span>
                  }
                </>
              )
            }
          },
          {
            field: 'active',
            headerName: 'Status',
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            width: 150,
            sortable: true,
            renderCell: (params: any) => {
              return params.row.status ? (
                <Chip label={'Active'} size="small" color="success" />
              ) : (
                <Chip label={'InActive'} size="small" color="info" />
              );
            },
          },
          {
            field: 'actions',
            type: 'actions',
            headerAlign: 'center',
            align: 'center',
            getActions: (params: any) => {
              const row = params.row as IServiceReminder;

              return [
                <GridActionsCellItem
                  key={1}
                  icon={<Edit sx={{ color: 'limegreen' }} />}
                  onClick={() => reminder.onEdit(row.id)}
                  label="Edit"
                  showInMenu={false}
                />,
                <GridActionsCellItem
                  key={2}
                  icon={<Cancel sx={{ color: 'indianred' }} />}
                  onClick={() => reminder.onDelete(row.id)}
                  label="Delete"
                  showInMenu={false}
                />,
                <GridActionsCellItem
                  sx={{ display: 'block' }}
                  key={2}
                  onClick={() => handleDisableReminder(row)}
                  icon={row.status ? <ToggleOn color="success" /> : <ToggleOff color="warning" />}
                  label="Toggle"
                  showInMenu={false}
                />,
              ];
            },
          },
        ] as GridColDef<IServiceReminder>[];
      }, [ dispatch, navigate, reminder]);

      const handleDisableReminder = (reminder: IServiceReminder) => {
        dispatch(toggleReminderStatusAction({ reminderId: reminder.id }));
      };

      useEffect(() => {
        return () => {
          dispatch(clearCreateReminderStatus());
          dispatch(clearUpdateReminderStatus());
          dispatch(clearGetRemindersStatus());
          dispatch(clearToggleReminderStatus());
          dispatch(clearDeleteReminderStatus());
        };
      }, [dispatch]);

      useEffect(() => {
        if(reminderReducer.toggleReminderStatus === 'completed') {
          setSuccess({message: "Reminder updated successfully"})
          dispatch(getReminderAction())
        }
      }, [reminderReducer.toggleReminderStatus]);

      useEffect(() => {
        if(reminderReducer.toggleReminderStatus === 'failed') {
          setError({message: reminderReducer.toggleReminderError})
        }
      }, [reminderReducer.toggleReminderStatus]);

      useEffect(() => {
        if (reminderReducer.deleteReminderStatus === 'completed') {
          setSuccess({ message: reminderReducer.deleteReminderSuccess });
        }
    }, [dispatch, reminderReducer.deleteReminderStatus, reminderReducer.deleteReminderSuccess]);

    const data: any = {
      open_modal: undefined,
      // id: undefined
    }

    useEffect(() => {
      if(removeSessionStorage){
        Object.keys(data).forEach(key => {
          sessionStorage.removeItem(key);
        });
      }
    }, [removeSessionStorage])

    useEffect(() => {
      if(sessionStorage.getItem('open_modal') === 'true'){
        reminder.setShowCreate(true)
      }
    },[]);

    // remove open modal and id from session storage on page reload
    useEffect(() => {
      const handleBeforeUnload = () => {
        sessionStorage.removeItem('open_modal');
        sessionStorage.removeItem('id');
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);

    return (
        <ReminderPageContext.Provider
            value={{
                reminders: reminder.reminders,
                setReminders: reminder.setReminders,
                showCreate: reminder.showCreate,
                setShowCreate: reminder.setShowCreate,
                showEdit: reminder.showEdit,
                setShowEdit: reminder.setShowEdit
            }}
        >
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={10}>
                <Typography variant="h4" gutterBottom>
                    Service Reminder
                </Typography>
            </Grid>
            <Grid item>
                <Button variant="outlined" color="success" size="small" onClick={() => reminder.setShowCreate(true)}
                    sx={{
                      mb: {sm: 0, xs: 2}, mr: 2
                    }}
                >
                    New Reminder
                </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <AppDataGrid
                rows={_reminder}
                columns={ techColumns }
                showToolbar
                loading={reminderReducer.getRemindersStatus === 'loading'}
              />
            </Grid>
          </Grid>
          <AppAlert
            alertType="success"
            show={undefined !== reminder.success}
            message={reminder.success?.message}
            onClose={() => reminder.setSuccess(undefined)}
          />
          <AppAlert
            alertType="error"
            show={undefined !== reminder.error}
            message={reminder.error?.message}
            onClose={() => reminder.setError(undefined)}
          />
          <AppAlert
            alertType="error"
            show={undefined !== reminder.error}
            message={reminder.error?.message}
            onClose={() => reminder.setError(undefined)}
          />
          {reminder.showCreate && (
            <AppModal
                fullWidth
                size={document.documentElement.clientWidth > 375 ? "xl" : undefined}
                fullScreen={true}
                show={reminder.showCreate}
                Content={
                  <Formik
                    initialValues={reminder.initialValues}
                    validationSchema={reminderModel.schema}
                    validateOnChange
                    onSubmit={(values) => {
                        if(reminder.save) reminder.handleCreateReminder(values);
                    }}>
                    <ReminderForm
                        showCreate={reminder.showCreate}
                        isSubmitting={
                          reminderReducer.createReminderStatus === 'loading'
                        }
                        setSave={reminder.setSave}
                    />
                  </Formik>
                }
                onClose={() => {reminder.setShowCreate(false), setRemoveSessionStorage(true)}}
            />
          )}
          {reminder.showEdit && (
            <AppModal
              fullWidth
              size={document.documentElement.clientWidth > 375 ? "xl" : undefined}
              fullScreen={true}
              show={reminder.showEdit}
              Content={
                  <Formik
                    initialValues={reminder.initialValues}
                    validationSchema={reminderModel.schema}
                    onSubmit={(values) => {
                        if(!reminder.save) reminder.handleUpdateReminder(values);
                    }}
                    enableReinitialize
                    validateOnChange>
                    <ReminderForm
                      showEdit={reminder.showEdit}
                      isSubmitting={
                      reminderReducer.updateReminderStatus === 'loading'
                      }
                      setSave={reminder.setSave}
                    />
                  </Formik>
              }
              onClose={() => {reminder.setShowEdit(false), setRemoveSessionStorage(true)}}
            />
          )}
          <AppModal
            fullWidth
            show={reminder.showDelete}
            Content={<DialogContentText>{MESSAGES.cancelText}</DialogContentText>}
            ActionComponent={
              <DialogActions>
                <Button onClick={() => reminder.setShowDelete(false)}>Disagree</Button>
                <Button onClick={reminder.handleDelete}>Agree</Button>
              </DialogActions>
            }
            onClose={() => reminder.setShowDelete(false)}
          />
        <AppLoader show={reminderReducer.deleteReminderStatus === 'loading'} />
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
        </ReminderPageContext.Provider>
    )
}

export default RemindersPage;