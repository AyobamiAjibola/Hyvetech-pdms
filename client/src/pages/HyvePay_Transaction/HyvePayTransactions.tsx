import React from 'react';
import useMainTransactionLogs from '../../hooks/useMainTransactionLogs';
import useAdmin from '../../hooks/useAdmin';
import moment from 'moment';
import { GridColDef } from '@mui/x-data-grid';
import { Util, postingType } from '../../utils/generic';
import { Box, Divider, Stack, Typography } from '@mui/material';
import Card from '../../utils/Card';
import { DatePicker } from 'antd';
import AppDataGrid from '../../components/tables/AppDataGrid';

const { RangePicker } = DatePicker;

function HyvePayTransactions (){

    const {
        rows,
        _setStartDate,
        _setEndDate,
        setReloadTable,
        totalRecordInStore,
        loading,
        sortModel,
        setSortModel,
    } = useMainTransactionLogs();
    const { isSuperAdmin } = useAdmin();

    const handleDateRangeChange = (dates: any) => {
        if(dates) {
            _setStartDate(moment(dates[0].$d).format('YYYY/MM/DD'))
            _setEndDate(moment(dates[1].$d).format('YYYY/MM/DD'))
        } else {
            setReloadTable(true)
        }
    };

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
                field: 'accountNumber',
                headerName: 'Account Number',
                headerAlign: 'center',
                align: 'center',
                width: 150,
                type: 'string',
                sortable: true,
            },
            {
                field: 'merchant',
                headerName: 'Merchant',
                headerAlign: 'center',
                align: 'center',
                width: 150,
                type: 'string',
                sortable: true,
                valueFormatter: ({value}: any) => {
                    return value ? value : ''
                }
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
                field: 'beneficiaryName',
                headerName: 'Beneficiary Name',
                headerAlign: 'center',
                align: 'center',
                width: 150,
                type: 'string',
                sortable: true,
                valueFormatter: ({value}: any) => {
                    return value ? value : ''
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
                width: 150,
                type: 'string',
                sortable: true,
                valueFormatter: ({value}: any) => {
                    return value ? value : ''
                }
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
        ] as GridColDef<any>[]

    const uniqueRows = rows.map((row, index) => ({
        ...row,
        uniqueKey: `${index}-${row.referenceNumber}`
    }));

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
                    Transactions
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
                            rows
                                ? Util.formAmount(rows
                                    .filter(item => item.postingRecordType === postingType.credit)
                                    .reduce((total, item) => {
                                        const amountInCurrency = item.amount / 100
                                        const result = total + amountInCurrency;
                                        return result
                                      }, 0), false)
                                : 0
                        }
                        qty={
                            rows
                                ? rows.filter(
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
                            rows
                                ? Util.formAmount(rows
                                    .filter(item => item.postingRecordType === postingType.debit)
                                    .reduce((total, item) => {
                                        const amountInCurrency = item.amount / 100
                                        const result = total + amountInCurrency;
                                        return result
                                    }, 0), false)
                                : 0
                        }
                        qty={
                            rows
                                ? rows.filter(
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
                        price={`${totalRecordInStore} Transactions`}
                        color={"#FFEDED"}
                        cardName={"Transactions"}
                        eyeD={false}
                    />
                </Box>
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
                    loading={loading}
                    rows={uniqueRows}
                    getRowId={(row: any) => row.uniqueKey}
                    columns={ isSuperAdmin ?
                                getSuperAdminTableColumn() : []
                            }
                    showToolbar
                    sortModel={sortModel}
                    onSortModel={setSortModel}
                    checkboxSelection
                    disableSelectionOnClick
                />
                </Stack>
            </Stack>
        </React.Fragment>
    )
}

export default HyvePayTransactions;