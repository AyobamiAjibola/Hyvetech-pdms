import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
// import useCustomer from '../../hooks/useCustomer';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
// import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ICustomer } from '@app-models';
import { AppContext } from '../../context/AppContextProvider';
import { AppContextProps } from '@app-interfaces';
import useNewCustomer from '../../hooks/useNewCustomer';
// import useAdmin from '../../hooks/useAdmin';
import CreateCustomerModal from '../../components/modal/CreateCustomer';
import ImportCustomerModal from '../../components/modal/ImportCustomer';
import { Visibility } from '@mui/icons-material';
import useAdmin from '../../hooks/useAdmin';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getPartnersAction } from '../../store/actions/partnerActions';
import useAppSelector from '../../hooks/useAppSelector';

function CustomersPage() {
  const { setCustomer } = useContext(AppContext) as AppContextProps;
  const [createModal, setCreateModal] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  // const [partner, setPartner] = useState<any>([])

  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const dispatch = useAppDispatch()

  const customer = useNewCustomer();

  const navigate = useNavigate();
  const { isTechAdmin, isSuperAdmin } = useAdmin();

  const handleView = (customer: ICustomer) => {
    setCustomer(customer);
    navigate(`/customers/${customer.id}`, { state: { customer } });
  };

  const handleDelete = () => {
    customer.setShowDelete(true);
  };

  // for tech
const getPartnerTableColumn = (options?: any) =>
[
  {
    field: 'fullName',
    headerName: 'Full Name',
    headerAlign: 'center',
    align: 'center',
    type: 'string',
    width: 250,
    sortable: true,
    renderCell: param => (
      <div style={{ cursor: 'pointer', color: 'lightblue' }} onClick={() => options.onView(param.row)}>
        {param ? `${param?.row?.title || ''} ${param.row.firstName} ${param.row.lastName}` : ''}
      </div>
    ),
  },
  {
    field: 'company',
    headerName: 'Company Name',
    headerAlign: 'center',
    align: 'center',
    type: 'string',
    width: 250,
    sortable: true,
    valueGetter: param => {
      return param.row.companyName ? `${param.row.companyName}` : '';
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
    field: 'creditRating',
    headerName: 'Credit Rating',
    headerAlign: 'center',
    align: 'center',
    width: 200,
    type: 'string',
    // @ts-ignore
    valueGetter: params => params.row.creditRating || 'N/A',
    sortable: true,
  },
  {
    field: 'receivables',
    headerName: 'Receivables',
    headerAlign: 'center',
    align: 'center',
    width: 200,
    type: 'string',
    valueGetter: () => 'N/A',
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

  // for superAdmin
const getSuperAdminTableColumn = useMemo(() => {
  return [
    {
      field: 'createdAt',
      headerName: 'Date',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      type: 'string',
      valueFormatter: ({ value }) => {
        return value ? moment(value).format('DD/MM/YYYY') : '-';
      },
      sortable: true,
      sortingOrder: ['desc'],
    },
    {
      field: 'fullName',
      headerName: 'Name',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      width: 250,
      sortable: true,
      valueGetter: param => {
        return param ? `${param.row.firstName} ${param.row.lastName}` : '';
      },
    },
    // {
    //   field: 'enabled',
    //   headerName: 'Status',
    //   headerAlign: 'center',
    //   align: 'center',
    //   type: 'boolean',
    //   width: 100,
    //   sortable: true,
    //   renderCell: params => {
    //     return params.row.enabled ? (
    //       <Chip label="Active" size="small" color="success" />
    //     ) : (
    //       <Chip label="Inactive" size="small" color="warning" />
    //     );
    //   },
    // },
    {
      field: 'companyName',
      headerName: 'Type (Individual or Cooperate)',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      width: 250,
      sortable: true,
      valueGetter: param => {
        return param.value === null || param.value === '' ? 'Individual' : 'Cooperate';
      },
    },
    {
      field: 'partnerId',
      headerName: 'Route',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      width: 200,
      sortable: true,
      valueGetter: param => {
        return param.value === null ? 'AutoHyve' : 'Workshop';
      },
    },
    {
      field: 'partner',
      headerName: 'Workshop name',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      width: 200,
      sortable: true,
      renderCell: params => {
        const partner = partnerReducer.partners.find((value: any) => value.id === params.row.partnerId)
        return (
          <span>
            {partner ? partner?.name : '------'}
          </span>
        );
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Last Modified',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      type: 'string',
      valueGetter: ({ value }) => value && moment(value).format('LLL'),
      sortable: true,
    },
    // {
    //   field: 'actions',
    //   type: 'actions',
    //   headerAlign: 'center',
    //   align: 'center',
    //   getActions: (params: any) => [
    //     <GridActionsCellItem
    //       key={0}
    //       icon={<Visibility sx={{ color: 'dodgerblue' }} />}
    //       onClick={() => options.onView(params.row)}
    //       label="View"
    //       showInMenu={false}
    //     />,
    //   ],
    // },
    ] as GridColDef<ICustomer>[];
  }, [isSuperAdmin, customer]);

  useEffect(() => {
    if (partnerReducer.getPartnersStatus === 'idle') {
      dispatch(getPartnersAction());
    }
  }, [dispatch, partnerReducer.getPartnersStatus]);

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={9}>
          <Typography variant="h4" gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Customers
          </Typography>
        </Grid>
        <Grid item>
          {isTechAdmin && <Button
            variant="outlined"
            color="success"
            size="small"
            sx={{
              mb: {sm: 0, xs: 2}
            }}
            onClick={() => {
              // s
              setCreateModal(true);
            }}>
            ADD CUSTOMER
          </Button>}
        </Grid>

        <Grid item>
          {isTechAdmin && <Button
            variant="outlined"
            color="success"
            size="small"
            sx={{
              mb: {sm: 0, xs: 2}
            }}
            onClick={() => {
              // s
              setInviteModal(true);
            }}>
            IMPORT CUSTOMER
          </Button>}
        </Grid>
      </Grid>

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
            columns={ isTechAdmin ?
                          getPartnerTableColumn({
                            onDelete: handleDelete,
                            onView: handleView,
                          }) :
                        isSuperAdmin ? getSuperAdminTableColumn : []
                    }
            showToolbar
            sortModel={customer.sortModel}
            onSortModel={customer.setSortModel}
            checkboxSelection
            disableSelectionOnClick
          />
        </Stack>
      </Stack>

      {/* @ts-ignore */}
      <CreateCustomerModal
        callback={(e: any) => {
          console.log(e);
          window.location.reload();
        }}
        visible={createModal}
        setVisible={setCreateModal}
      />

      {/* @ts-ignore */}
      <ImportCustomerModal
        callback={(e: any) => {
          console.log(e);
          window.location.reload();
        }}
        visible={inviteModal}
        setVisible={setInviteModal}
      />
    </Box>
  );
}

export default CustomersPage;
