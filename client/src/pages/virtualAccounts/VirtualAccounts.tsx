import React, { useContext, useState } from 'react';
import useVirtualAccounts from '../../hooks/useVirtualAccounts';
import useAdmin from '../../hooks/useAdmin';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { ToggleOff, ToggleOn, Visibility } from '@mui/icons-material';
import { AppContext } from '../../context/AppContextProvider';
import { AppContextProps } from '@app-interfaces';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Stack, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import { Accounts } from '@app-models';
import { DatePicker } from 'antd';
import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getVirtualAccountsAction } from '../../store/actions/autoHyveActions';
import AppAlert from '../../components/alerts/AppAlert';
import { CustomHookMessage } from '@app-types';

const API_ROOT = settings.api.rest;

const { RangePicker } = DatePicker;

function VirtualAccount () {

    const accounts = useVirtualAccounts();
    const { isSuperAdmin } = useAdmin();
    const { setAccounts } = useContext(AppContext) as AppContextProps;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    // const [disableAccount, setDisableAccount] = useState<boolean>(false);
    const [success, setSuccess] = useState<CustomHookMessage>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const autoHyveReducer = useAppSelector(state => state.autoHyveReducer);

    const handleDateRangeChange = (dates: any) => {
        if(dates) {
            accounts._setStartDate(moment(dates[0].$d).format('YYYY/MM/DD'))
            accounts._setEndDate(moment(dates[1].$d).format('YYYY/MM/DD'))
        } else {
            accounts.setReloadTable(true)
        }
    };

    const handleViewTransactions = (account: any) => {
        setAccounts(account);
        navigate(`/account/transactions/${account.trackingReference}`, { state: { account } });
    };

    const handleToggleStatus = async (account: any) => {
        setIsLoading(true)
        if(account.isDeleted) {
            await axiosClient.get(`${API_ROOT}/enable/account/${account.trackingReference}`)
            dispatch(getVirtualAccountsAction())
        } else {
            await axiosClient.get(`${API_ROOT}/disable/account/${account.trackingReference}`)
            dispatch(getVirtualAccountsAction())
        }
        setIsLoading(false)
    };
   
    const getSuperAdminTableColumn = (options?: any) =>
        [
            {
                field: 'creationDate',
                headerName: 'Date Created',
                headerAlign: 'center',
                align: 'center',
                width: 150,
                type: 'string',
                valueFormatter: ({ value }: any) => {
                  return value ? moment(value).format('DD/MM/YYYY') : '-';
                },
                sortable: true,
                sortingOrder: ['desc'],
            },
            {
                field: 'accountName',
                headerName: 'Account Name',
                headerAlign: 'center',
                align: 'center',
                width: 150,
                type: 'string',
                sortable: true
            },
            {
                field: 'accountNumber',
                headerName: 'Account Number',
                headerAlign: 'center',
                align: 'center',
                width: 150,
                type: 'string',
                sortable: true,
            },
            {
                field: 'bussinessName',
                headerName: 'Business Name',
                headerAlign: 'center',
                align: 'center',
                width: 150,
                type: 'string',
                sortable: true
            },
            {
                field: 'email',
                headerName: 'Email',
                headerAlign: 'center',
                align: 'center',
                width: 250,
                type: 'string',
                sortable: true,
            },
            {
                field: 'fullName',
                headerName: 'Full Name',
                headerAlign: 'center',
                align: 'center',
                width: 200,
                type: 'string',
                valueGetter: (param: any) => {
                    return param ? `${param.row.firstName} ${param.row.lastName}` : '';
                  },
                sortable: true,
            },
            {
                field: 'phoneNumber',
                headerName: 'Phone Number',
                headerAlign: 'center',
                align: 'center',
                width: 150,
                type: 'string',
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
                    label=""
                    showInMenu={false}
                />,
                ],
            },
            {
                field: 'isDeleted',
                type: 'actions',
                headerAlign: 'center',
                align: 'center',
                getActions: (params: any) => [
                <GridActionsCellItem
                    key={0}
                    icon={params.row.isDeleted
                            ? <ToggleOff color="warning" sx={{fontSize: '25px'}} />
                            : <ToggleOn color="success" sx={{fontSize: '25px'}} />
                        }
                    onClick={() => options.onDelete(params.row)}
                    label="Transactions"
                    showInMenu={false}
                    disabled={isLoading}
                />,
                ],
            },
        ] as GridColDef<Accounts>[];

    return (
        <React.Fragment>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left', my: 1
                }}
            >
                <Typography sx={{fontSize: '2rem', fontWeight: 600}}>
                    Virtual Accounts
                </Typography>
            </Box>
            <Box mb={2}
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'right', mt: 2
                }}
            >
                <RangePicker onChange={handleDateRangeChange}
                    style={{
                        width: '30%',
                        height: '2rem'
                    }}
                />
            </Box>
            <Stack
                direction="column"
                spacing={5}
                justifyContent="center"
                alignItems="center"
                divider={<Divider orientation="horizontal" flexItem />}>
                <Stack direction="row" sx={{ width: '100%' }}>
                <AppDataGrid
                    loading={accounts.loading}
                    rows={accounts.rows}
                    getRowId={(row: any) => row.trackingReference}
                    columns={ isSuperAdmin ?
                                getSuperAdminTableColumn({
                                    onView: handleViewTransactions,
                                    onDelete: handleToggleStatus
                                }) : []
                            }
                    showToolbar
                    sortModel={accounts.sortModel}
                    onSortModel={accounts.setSortModel}
                    checkboxSelection
                    disableSelectionOnClick
                />
                </Stack>
            </Stack>
            {/* {disableAccount && <AppModal
                // fullWidth
                show={disableAccount}
                Content={<DialogContentText>{MESSAGES.disable_kuda_account}</DialogContentText>}
                ActionComponent={
                <DialogActions>
                    <Button onClick={handleToggleStatus}>Yes</Button>
                    <Button onClick={() => setDisableAccount(false)}>No</Button>
                </DialogActions>
                }
                onClose={() => setDisableAccount(false)}
            />} */}
            <AppAlert
                alertType="success"
                show={undefined !== success}
                message={success?.message}
                onClose={() => setSuccess(undefined)}
            />
        </React.Fragment>
    )
}

export default VirtualAccount;