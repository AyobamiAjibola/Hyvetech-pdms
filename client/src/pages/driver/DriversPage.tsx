import React, { useContext } from 'react';
import { Button, Chip, DialogActions, DialogContentText, Divider, Stack, Typography } from '@mui/material';
import { AppContext } from '../../context/AppContextProvider';
import { AppContextProps } from '@app-interfaces';
import { useNavigate } from 'react-router-dom';
import { IRideShareDriver } from '@app-models';
import useDriver from '../../hooks/useDriver';
import AppDataGrid from '../../components/tables/AppDataGrid';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Delete, Visibility } from '@mui/icons-material';
import AppModal from '../../components/modal/AppModal';
import { MESSAGES } from '../../config/constants';
import AppLoader from '../../components/loader/AppLoader';
import AppAlert from '../../components/alerts/AppAlert';

export default function DriversPage() {
  const { setDriver } = useContext(AppContext) as AppContextProps;

  const driver = useDriver();
  const navigate = useNavigate();

  const handleView = (driver: IRideShareDriver) => {
    setDriver(driver);
    navigate(`/drivers/${driver.id}`, { state: { driver } });
  };

  return (
    <React.Fragment>
      <Typography variant="h4" gutterBottom>
        Drivers
      </Typography>
      <Stack
        direction="column"
        spacing={5}
        justifyContent="center"
        alignItems="center"
        divider={<Divider orientation="horizontal" flexItem />}>
        <Stack direction="row" sx={{ width: '100%' }}>
          <AppDataGrid
            loading={driver.loading}
            rows={driver.rows}
            columns={getTableColumn({
              onDelete: driver.onDelete,
              onView: handleView,
            })}
            showToolbar
            sortModel={driver.sortModel}
            onSortModel={driver.setSortModel}
            checkboxSelection
            disableSelectionOnClick
          />
        </Stack>
      </Stack>
      <AppModal
        fullWidth
        show={driver.showDelete}
        Content={<DialogContentText>{MESSAGES.cancelText}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button onClick={() => driver.setShowDelete(false)}>Disagree</Button>
            <Button onClick={driver.handleDelete}>Agree</Button>
          </DialogActions>
        }
        onClose={() => driver.setShowDelete(false)}
      />
      <AppAlert
        alertType="success"
        show={undefined !== driver.success}
        message={driver.success?.message}
        onClose={() => driver.setSuccess(undefined)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== driver.error}
        message={driver.error?.message}
        onClose={() => driver.setError(undefined)}
      />
      <AppLoader show={driver.loading} />
    </React.Fragment>
  );
}

interface IColumn {
  onDelete: (driver: IRideShareDriver) => void;
  onView: (driver: IRideShareDriver) => void;
}

const getTableColumn = (options: IColumn) =>
  [
    {
      field: 'id',
      headerName: 'ID',
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      type: 'number',
    },
    {
      field: 'fullName',
      headerName: 'Full Name',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      width: 250,
      sortable: true,
      valueGetter: param => {
        return param ? `${param.row.firstName} ${param.row.lastName}` : '';
      },
    },
    {
      field: 'enabled',
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
      type: 'boolean',
      width: 100,
      sortable: true,
      renderCell: params => {
        return params.row.enabled ? (
          <Chip label="Active" size="small" color="success" />
        ) : (
          <Chip label="Inactive" size="small" color="warning" />
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      width: 200,
      sortable: true,
      valueGetter: param => {
        return param ? param.value : '';
      },
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      width: 150,
      sortable: true,
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      type: 'string',
      valueGetter: ({ value }) => value && moment(value).format('LLL'),
      sortable: true,
    },
    {
      field: 'updatedAt',
      headerName: 'Modified Date',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      type: 'string',
      valueGetter: ({ value }) => value && moment(value).format('LLL'),
      sortable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerAlign: 'center',
      align: 'center',
      getActions: (params: any) => [
        <GridActionsCellItem
          key={0}
          icon={<Visibility sx={{ color: 'dodgerblue' }} />}
          onClick={() => options.onView(params.row)}
          label="View"
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={0}
          icon={<Delete sx={{ color: 'orangered' }} />}
          onClick={() => options.onDelete(params.row)}
          label="View"
          showInMenu={false}
        />,
      ],
    },
  ] as GridColDef<IRideShareDriver>[];
