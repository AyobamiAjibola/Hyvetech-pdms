import React, { useContext, useEffect, useState } from 'react';
import { Box, Stack, TextField, Select, MenuItem } from '@mui/material';
import { STATES } from '../../config/constants';
import { ISelectData } from '../forms/fields/SelectField'
import { CustomerPageContext } from '../../pages/customer/CustomerPage';
import { CustomerPageContextProps } from '@app-interfaces';
import { LoadingButton } from '@mui/lab';
import { updateCustomerAction } from '../../store/actions/customerActions';
// import { Send } from '@mui/icons-material';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { clearUpdateCustomerStatus } from '../../store/reducers/customerReducer';
import { CustomHookMessage } from '@app-types';
import AppAlert from '../alerts/AppAlert';
// import { getCustomerVehiclesAction } from '../../store/actions/customerActions';
// import moment from 'moment';
// import { IVehicle } from '@app-models';
// import TextInputField from '../forms/fields/TextInputField';
// import AppDataGrid from '../tables/AppDataGrid';
// import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
// import { Visibility } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

function ProfileNew() {
//   const [_vehicles, _setVehicles] = useState<IVehicle[]>([]);
const [states, setStates] = useState<ISelectData[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError] = useState<CustomHookMessage>();
  const [form, setForm] = useState<any>({
    firstName: "",
    email: "",
    lastName: "",
    companyName: "",
    accountType: "",
    phone: "",
    creditRating: "",
    state: "",
    district: ""
  });

  useEffect(() => {
    const newStates = STATES.map(state => ({
      label: state.name,
      value: state.name,
    }));

    setStates(newStates);
  }, []);

  const { customer } = useContext(CustomerPageContext) as CustomerPageContextProps;

  useEffect(()=>{
    // update customer info

    setForm({
        firstName: customer?.firstName,
        email: customer?.email,
        lastName: customer?.lastName,
        companyName: customer?.companyName,
        accountType: (customer?.companyName != null) ? "Corporate" : "Individual",
        phone: customer?.phone,
        creditRating: customer?.creditRating || "",
        state: customer?.contacts[0]?.state || "",
        district: customer?.contacts[0]?.district || ""
    })

    setIsLoading(false)
  }, [customer])

  const customerReducer = useAppSelector(state => state.customerReducer);

  const dispatch = useAppDispatch();

//   const navigate = useNavigate();

// listen to edit event
useEffect(()=>{
    
    if( customerReducer.updateCustomerStatus == 'idle' ){
        setIsLoading(false)
    }

    if( customerReducer.updateCustomerStatus == 'loading' ){
        setIsLoading(true)
    }

    if( customerReducer.updateCustomerStatus == 'completed' ){
        dispatch(clearUpdateCustomerStatus())
        setIsLoading(false)
        setError({
            message: "Edited Successfully"
        })

        window.location.reload()
    }

    if( customerReducer.updateCustomerStatus == 'failed' ){
        dispatch(clearUpdateCustomerStatus())
        setIsLoading(false)
        setError({
            message: customerReducer?.updateCustomerError || ""
        })
    }

}, [customerReducer.updateCustomerStatus])

const handleEdit = async ()=>{
    setIsLoading(true)
    const _id = customer?.id;
    const payload = {
        id: _id,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        creditRating: form.creditRating,
        state: form.state,
        district: form.district,
    }

    dispatch(updateCustomerAction(payload))
}

  return (
    <Box>
      <Stack spacing={2}>

        <Stack direction={"row"} spacing={2}>
            <TextField
                label='First Name'
                onChange={val => setForm({...form, firstName: val.target.value})}
                value={form.firstName}
                fullWidth={true} />
                
            <TextField
                label='Last Name'
                onChange={val => setForm({...form, lastName: val.target.value})}
                value={form.lastName}
                fullWidth={true} />
        </Stack>

        <Stack direction={"row"} spacing={2}>
            <TextField
                label='Company Name'
                onChange={val => setForm({...form, companyName: val.target.value})}
                value={form.companyName}
                fullWidth={true} />
                
            <TextField
                label='Account Type'
                onChange={val => setForm({...form, accountType: val.target.value})}
                disabled={true}
                value={form.accountType}
                fullWidth={true} />
        </Stack>
            
        <TextField
            label='Email'
            onChange={val => setForm({...form, email: val.target.value})}
            disabled={true}
            value={form.email}
            fullWidth={true} />

        <Stack direction={"row"} spacing={2}>
            <TextField
                label='Phone'
                onChange={val => setForm({...form, phone: val.target.value})}
                value={form.phone}
                fullWidth={true} />
                
            <TextField
                label='Credit Rating'
                onChange={val => setForm({...form, creditRating: val.target.value})}
                value={form.creditRating}
                fullWidth={true} />
        </Stack>

        <Stack direction={"row"} spacing={2}>
            <Select
                onChange={e => {
                console.log(e)
                }}
                value={form.state}
                name={"State"}
                label={"State"}
                fullWidth
                >
                    {states.map((item, index) => {
                        return (
                        <MenuItem
                            onClick={()=>{
                                console.log(item)
                            }}
                            key={index}
                            value={item.value}>
                            {item.label}
                        </MenuItem>
                        );
                    })}
            </Select>

            <TextField
                label='District'
                onChange={val => setForm({...form, district: val.target.value})}
                value={form.district}
                fullWidth={true} />
        </Stack>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LoadingButton
                // sx={{ ml: 2 }}
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                onClick={() => {
                    // 
                    handleEdit()
                }}
                variant="contained"
                color="success"
                // endIcon={<Send />}
                >
                Update
            </LoadingButton>
        </div>
        
      </Stack>

      <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
    </Box>
  );
}

// const columns = (options?: any) =>
//   [
//     {
//       field: 'id',
//       headerName: 'ID',
//       headerAlign: 'center',
//       align: 'center',
//       sortable: true,
//       type: 'number',
//     },
//     {
//       field: 'plateNumber',
//       headerName: 'Plate Number',
//       headerAlign: 'center',
//       width: 160,
//       align: 'center',
//       type: 'string',
//       sortable: true,
//     },
//     {
//       field: 'make',
//       headerName: 'Make',
//       headerAlign: 'center',
//       width: 160,
//       align: 'center',
//       type: 'string',
//       sortable: true,
//     },
//     {
//       field: 'model',
//       headerName: 'Model',
//       headerAlign: 'center',
//       width: 160,
//       align: 'center',
//       type: 'string',
//       sortable: true,
//     },
//     {
//       field: 'modelYear',
//       headerName: 'Year',
//       headerAlign: 'center',
//       align: 'center',
//       type: 'string',
//       sortable: true,
//     },
//     {
//       field: 'isBooked',
//       headerName: 'Booked',
//       headerAlign: 'center',
//       align: 'center',
//       type: 'string',
//       sortable: true,
//       renderCell: params => {
//         const status = params.row.isBooked;

//         return status ? (
//           <Chip label="Yes" color="success" size="small" />
//         ) : (
//           <Chip label="No" color="error" size="small" />
//         );
//       },
//     },

//     {
//       field: 'createdAt',
//       headerName: 'Created At',
//       headerAlign: 'center',
//       align: 'center',
//       type: 'dateTime',
//       sortable: true,
//       width: 160,
//       valueFormatter: params => {
//         return moment(params.value).utc(true).format('LLL');
//       },
//     },
//     {
//       field: 'updatedAt',
//       headerName: 'Modified At',
//       headerAlign: 'center',
//       align: 'center',
//       type: 'dateTime',
//       sortable: true,
//       width: 160,
//       valueFormatter: params => {
//         return moment(params.value).utc(true).format('LLL');
//       },
//     },
//     {
//       field: 'actions',
//       type: 'actions',
//       align: 'center',
//       headerAlign: 'center',
//       getActions: (params: any) => [
//         <GridActionsCellItem
//           key={0}
//           icon={<Visibility sx={{ color: 'dodgerblue' }} />}
//           onClick={() => options.onView(params.row)}
//           label="View"
//           showInMenu={false}
//         />,
//       ],
//     },
//   ] as GridColDef<IVehicle>[];

export default ProfileNew;
