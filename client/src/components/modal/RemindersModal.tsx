/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import useReminder from "../../hooks/useReminder";
import useAppDispatch from '../../hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Grid, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IServiceReminder } from '@app-models';
import AppDataGrid from '../tables/AppDataGrid';

interface IProps {
  vehicleReminder: IServiceReminder;
}

function RemindersModal(props: IProps) {
    const dispatch = useAppDispatch();
    const [_reminder, _setReminder] = useState<any>([]);
    const navigate = useNavigate();

    const reminder = useReminder();

    useEffect(() => {
      const _temp01 = props.vehicleReminder;
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
                <span>
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
            width: 250,
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
            width: 250,
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
            field: 'nextServiceDate',
            headerName: 'Next Service Date',
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            renderCell: (params: any) => {
                const nextServiceDate = params.row.nextServiceDate
                return (
                    <span>{moment(nextServiceDate).format('DD/MM/YYYY')}</span>
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
            width: 200,
            renderCell: (params: any) => {
              return (
                <>
                  {params.row.reminderStatus.split(" ")[0] === 'Overdue' || params.row.reminderStatus === 'Due today'
                    ? <span style={{color: 'red'}}>{params.row.reminderStatus}</span>
                    : <span style={{color: 'green'}}>{params.row.reminderStatus}</span>
                  }
                </>
              )
            }
          }
        ] as GridColDef<IServiceReminder>[];
      }, [ dispatch, navigate, reminder]);

    return (
      <React.Fragment>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h6" gutterBottom>
              Reminders
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <AppDataGrid
              rows={_reminder}
              columns={ techColumns }
              showToolbar
              // loading={reminderReducer.getRemindersStatus === 'loading'}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    )
}

export default RemindersModal;