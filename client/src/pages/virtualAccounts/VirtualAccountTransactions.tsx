import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAccountTransactions from '../../hooks/useAccountTransactions';
import { Box, Divider, Stack, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAdmin from '../../hooks/useAdmin';
import moment from 'moment';
import { Util, postingType } from '../../utils/generic';
import { GridColDef } from '@mui/x-data-grid';
import { DatePicker } from 'antd';
import Card from '../../utils/Card';

const { RangePicker } = DatePicker;

function VirtualAccountTransactions () {
    const params = useParams();

    const transactions = useAccountTransactions();
    const { isSuperAdmin } = useAdmin();
    
    const handleDateRangeChange = (dates: any) => {
        if(dates) {
            transactions._setStartDate(moment(dates[0].$d).format('YYYY/MM/DD'))
            transactions._setEndDate(moment(dates[1].$d).format('YYYY/MM/DD'))
        } else {
            transactions.setReloadTable(true)
        }
    };

    const uniqueRows = transactions.rows.map((row, index) => ({
        ...row,
        uniqueKey: `${index}-${row.referenceNumber}`
    }));

    const getSuperAdminTableColumn = () =>
        [
            {
                field: 'realDate',
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
                field: 'beneficiaryName',
                headerName: 'Account Name',
                headerAlign: 'center',
                align: 'center',
                width: 150,
                type: 'string',
                sortable: true
            },
            {
                field: 'amount',
                headerName: 'Amount',
                headerAlign: 'center',
                align: 'center',
                width: 150,
                type: 'number',
                sortable: true,
                renderCell: params => {
                    return params.row.postingRecordType === postingType.credit ? (
                        <span style={{color: 'green'}}> {Util.formAmount(params.row.amount, true)}</span>
                      ) : (
                        <span style={{color: 'red'}}> {Util.formAmount(params.row.amount, true)}</span>
                      )
                }
            },
            {
                field: 'balanceAfter',
                headerName: 'Balance',
                headerAlign: 'center',
                align: 'center',
                width: 250,
                type: 'number',
                sortable: true,
                valueFormatter: ({ value }: any) => {
                    return Util.formAmount(value, true)
                },
            },
            {
                field: 'narration',
                headerName: 'Narration',
                headerAlign: 'center',
                align: 'center',
                width: 250,
                type: 'string',
                sortable: true,
                valueFormatter: ({ value }: any) => {
                    return value ? value : "N/A"
                },
            },
            {
                field: 'type',
                headerName: 'Type',
                headerAlign: 'center',
                align: 'center',
                width: 150,
                type: 'string',
                sortable: true,
                renderCell: params => {
                    return params.row.postingRecordType === postingType.credit
                            ?   ( <span style={{color: 'green'}}> Credit</span>)
                            :   (<span style={{color: 'red'}}> Debit</span>)
                    }
            },
            // {
            //     field: 'status',
            //     headerName: 'Status',
            //     headerAlign: 'center',
            //     align: 'center',
            //     width: 150,
            //     type: 'string',
            //     sortable: true,
            // },
            // {
            //     field: 'actions',
            //     type: 'actions',
            //     headerAlign: 'center',
            //     align: 'center',
            //     getActions: (params: any) => [
            //     <GridActionsCellItem
            //         key={0}
            //         icon={<Visibility sx={{ color: 'dodgerblue' }} />}
            //         onClick={() => options.onView(params.row)}
            //         label="Transactions"
            //         showInMenu={false}
            //     />,
            //     ],
            // },
        ] as GridColDef<any>[];
    
    useEffect(() => {
        if(params) {
            transactions._setAccountRef(params.id)
        }
    },[params]);

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
                    Transaction History
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    width: '100%', gap: 4,
                    my: 4
                }}
            >
                <Box
                    sx={{
                        width: '35%'
                    }}
                >
                    <Card
                        name={"Total Credit"}
                        price={
                            transactions.rows
                                ? Util.formAmount(transactions.rows
                                    .filter(item => item.postingRecordType === postingType.credit)
                                    .reduce((total, item) => {
                                        const amountInCurrency = item.amount / 100
                                        const result = total + amountInCurrency;
                                        return result
                                      }, 0), false)
                                : 0
                        }
                        qty={
                            transactions.rows
                                ? transactions.rows.filter(
                                    (item) => item.postingRecordType === postingType.credit
                                    ).length
                                : 0
                        }
                        color={"#F1F3FF"}
                        cardName={"Credit"}
                        eyeD={true}
                    />
                </Box>
                <Box
                    sx={{
                        width: '35%'
                    }}
                >
                    <Card
                        name={"Total Debit"}
                        price={
                            transactions.rows
                                ? Util.formAmount(transactions.rows
                                    .filter(item => item.postingRecordType === postingType.debit)
                                    .reduce((total, item) => {
                                        const amountInCurrency = item.amount / 100
                                        const result = total + amountInCurrency;
                                        return result
                                    }, 0), false)
                                : 0
                        }
                        qty={
                            transactions.rows
                                ? transactions.rows.filter(
                                    (item) => item.postingRecordType === postingType.debit
                                    ).length
                                : 0
                        }
                        color={"#FFF2DD"}
                        cardName={"Debit"}
                        eyeD={true}
                    />
                </Box>
                <Box
                    sx={{
                        width: '30%'
                    }}
                >
                    <Card
                        name={"Count"}
                        price={`${transactions.totalRecordInStore} Transactions`}
                        color={"#FFEDED"}
                        cardName={"Transactions"}
                        eyeD={false}
                    />
                </Box>
                {/* <Box
                    sx={{
                        width: '25%'
                    }}
                >
                    <Card
                        name={"Available Balance"}
                        price={
                            transactions.rows
                                ? Util.formAmount(transactions.rows
                                    .filter(item => item.postingRecordType === postingType.credit)
                                    .reduce((total, item) => {
                                        const amountInCurrency = item.amount / 100
                                        const result = total + amountInCurrency;
                                        return result
                                      }, 0), false)
                                : 0
                        }
                        qty={
                            transactions.rows
                                ? transactions.rows.filter(
                                    (item) => item.postingRecordType === postingType.credit
                                    ).length
                                : 0
                        }
                        color={"#F1F3FF"}
                        cardName={"Credit"}
                        eyeD={true}
                    />
                </Box> */}
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
                    loading={transactions.loading}
                    rows={uniqueRows}
                    getRowId={(row: any) => row.uniqueKey}
                    columns={ isSuperAdmin ?
                                getSuperAdminTableColumn() : []
                            }
                    showToolbar
                    sortModel={transactions.sortModel}
                    onSortModel={transactions.setSortModel}
                    checkboxSelection
                    disableSelectionOnClick
                />
                </Stack>
            </Stack>
        </React.Fragment>
    )
}

export default VirtualAccountTransactions;