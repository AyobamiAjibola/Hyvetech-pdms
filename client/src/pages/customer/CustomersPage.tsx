import React, { useContext } from 'react';
import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useCustomer from '../../hooks/useCustomer';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ICustomer } from '@app-models';
import { AppContext } from '../../context/AppContextProvider';
import { AppContextProps } from '@app-interfaces';

function CustomersPage() {
  const { setCustomer } = useContext(AppContext) as AppContextProps;

  const customer = useCustomer();
  const navigate = useNavigate();

  const handleView = (customer: ICustomer) => {
    setCustomer(customer);
    navigate(`/customers/${customer.id}`, { state: { customer } });
  };

  const handleDelete = () => {
    customer.setShowDelete(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>
      <Stack
        direction="column"
        spacing={5}
        justifyContent="center"
        alignItems="center"
        divider={<Divider orientation="horizontal" flexItem />}>
        <Stack direction="row" sx={{ width: '100%' }}>
          <AppDataGrid
            loading={customer.loading}
            rows={customer.rows}
            columns={getTableColumn({
              onDelete: handleDelete,
              onView: handleView,
            })}
            showToolbar
            sortModel={customer.sortModel}
            onSortModel={customer.setSortModel}
            checkboxSelection
            disableSelectionOnClick
          />
        </Stack>
      </Stack>
    </Box>
  );
}

const getTableColumn = (options?: any) =>
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
      ],
    },
  ] as GridColDef<ICustomer>[];

export default CustomersPage;
