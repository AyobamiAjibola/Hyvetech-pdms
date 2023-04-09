import React, { useMemo } from 'react';
import moment from 'moment';
import { GridColDef } from '@mui/x-data-grid';
import usePartner from '../../hooks/usePartner';
import useAdmin from '../../hooks/useAdmin';
import { IPartner } from '@app-models';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useEstimate from '../../hooks/useEstimate';
import useInvoice from '../../hooks/useInvoice';

function Workshops() {

  const partners = usePartner();
  const { isSuperAdmin } = useAdmin();
  const estimate = useEstimate()
  const invoice = useInvoice()

  const getWorkshops = useMemo(() => {
    return [
      {
        field: 'createdAt',
        headerName: 'Date Joined',
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
        field: 'id',
        headerName: 'Workshop ID',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 100,
        sortable: true,
      },
      {
        field: 'name',
        headerName: 'Name of workshop',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 150,
        sortable: true,
      },
      {
        field: 'state',
        headerName: 'State',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 150,
        sortable: true,
        valueGetter: params => {
          return params.row.contact ? params.row.contact.state : '';
        },
      },
      {
        field: 'email',
        headerName: 'Email ID',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 150,
        sortable: true,
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
        field: 'estimateCount',
        headerName: 'Estimate Count',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
        valueGetter: param => {
          let count = 0;
          const id = param.row.id;
          estimate.estimates.map((data: any) => {
            if(data.partnerId === id){
              count++
            }
          })
          return count;
        },
      },
      {
        field: 'invoiceCount',
        headerName: 'Invoice Count',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
        valueGetter: param => {
          let count = 0;
          const id = param.row.id;

          invoice.invoices.map((data: any) => {
            if(data.estimate?.partnerId === id){
              count++
            }
          })
          return count;
        },
      },
      {
        field: 'grandTotal',
        headerName: 'Sales volume',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
        valueGetter: param => {
          let amount = 0;
          const id = param.row.id;

          invoice.invoices.map((data: any) => {
            if(data.estimate?.partnerId === id){
              amount = amount + data.grandTotal
            }
          })
          return amount;
        },
      },
    ] as GridColDef<IPartner>[];
  }, [partners, isSuperAdmin, estimate.estimates, invoice.invoices])

  return (
    <Box>
      <Grid container justifyContent="left" alignItems="center">
        <Grid item xs={9}>
          <Typography variant="h4" gutterBottom>
            Workshops
          </Typography>
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
            loading={partners.loading}
            rows={partners.rows}
            columns={ isSuperAdmin ? getWorkshops : []}
            showToolbar
            sortModel={partners.sortModel}
            onSortModel={partners.setSortModel}
            checkboxSelection
            disableSelectionOnClick
          />
        </Stack>
      </Stack>
    </Box>
  );
}

export default Workshops;
