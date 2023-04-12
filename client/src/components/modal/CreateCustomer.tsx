import { CustomHookMessage } from '@app-types';
import { Cancel } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Grid, MenuItem, Modal, Radio, Select, Stack, Typography, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { STATES } from '../../config/constants';
import AppAlert from '../alerts/AppAlert';
import { ISelectData } from '../forms/fields/SelectField';
import Joi from 'joi'
import { filterPhoneNumber } from '../../utils/generic';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { addCustomerAction } from '../../store/actions/customerActions';
import { clearAddCustomerStatus } from '../../store/reducers/customerReducer';
import useNewCustomer from '../../hooks/useNewCustomer';

type Props = {
    callback?: any;
    data?: any;
    visible: boolean;
    setVisible?: any;
}

export default function CreateCustomerModal(props: Props) {
    const [form, setForm] = useState({
        accountType: 'individual',
        title: "",
        firstName: "",
        email: "",
        lastName: "",
        companyName: "",
        phone: "",
        creditRating: "N/A",
        state: "Abuja (FCT)",
        district: "",
        address: ""
    })

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const [__payload, __setpayload] = useState<any>([]);
    const [states, setStates] = useState<ISelectData[]>([]);
    const [district, setDistrict] = useState<ISelectData[]>([]);
    // @ts-ignore
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<CustomHookMessage>();
    const [success, setSuccess] = useState<CustomHookMessage>();

    const customer = useNewCustomer();

    useEffect(()=>{
        if((props.data == null) || (props.data == undefined)){
            setForm({
                accountType: 'individual',
                title: "",
                firstName: "",
                email: "",
                lastName: "",
                companyName: "",
                phone: "",
                creditRating: "N/A",
                state: "Abuja (FCT)",
                district: "",
                address: ""
            })
        }
    }, [props.visible, props.data])

    useEffect(()=>{
        if((props.data != null) && (props.data != undefined)){
            setTimeout(()=>{
                setForm({
                    accountType: props.data?.accountType || "individual",
                    title: props.data?.title || "",
                    firstName: props.data?.firstName || "",
                    email: props.data?.email || "",
                    lastName: props.data?.lastName || "",
                    companyName: props.data?.companyName || "",
                    phone: props.data?.phone || "",
                    creditRating: props.data?.creditRating || "N/A",
                    state: props.data?.state || "Abuja (FCT)",
                    district: props.data?.district || "",
                    address: props.data?.address || ""
                })
            }, 500)
        }
    }, [props.data])

    const dispatch = useAppDispatch()
    const customerReducer = useAppSelector(state => state.customerReducer);

    useEffect(() => {
        const newStates = STATES.map(state => ({
          label: state.name,
          value: state.name,
        }));
    
        setStates(newStates);
    }, []);

    // listen to get district
    useEffect(() => {
        // find state
        const _temp = (STATES.filter( v => (v.name == form.state) ))[0];



        const newDistrict = _temp.districts.map(district => ({
          label: district.name,
          value: district.name,
        }));
    
        setDistrict(newDistrict);
    }, [form.state]);
    

    // listen
    // listen to edit event
    useEffect(()=>{
    
        if( customerReducer.addCustomerStatus == 'idle' ){
            setIsLoading(false)
        }

        if( customerReducer.addCustomerStatus == 'loading' ){
            setIsLoading(true)
        }

        if( customerReducer.addCustomerStatus == 'completed' ){
            dispatch(clearAddCustomerStatus())
            setIsLoading(false)
            setSuccess({
                message: ( props.data !== null ? "Updated" : "Created" )+" Successfully"
            })

            props.callback(__payload)
            props.setVisible(false)
        }

        if( customerReducer.addCustomerStatus == 'failed' ){
            dispatch(clearAddCustomerStatus())
            setIsLoading(false)
            setError({
                message: customerReducer?.addCustomerError || ""
            })
        }

    }, [customerReducer.addCustomerStatus, dispatch])

    const handleCreate = async ()=>{
        // check if all entry are valid
        const {error} = Joi.object({
            firstName: Joi.string().required().label("First Name"),
            lastName: Joi.string().required().label("Last Name"),
            title: Joi.string().optional().label("Title"),
            email: Joi.string().required().label("Email"),
            state: Joi.string().required().label("State"),
            district: Joi.string().required().label("District"),
            phone: Joi.string().required().label("Phone"),
            address: Joi.string().optional().label("Address"),
            creditRating: Joi.string().optional().label("Credit Rating"),
            companyName: Joi.any().allow().label("Company Name"),
            accountType: Joi.string().optional().label("Account Type"),
        }).validate(form)

        // console.log(error)
        if(error){
            setError({message: error.message})
            return
        }

        // check if corporate n company name isset
        if( (form.accountType === 'corporate') && ((form.companyName).length < 1) ){
            setError({message: "Company Name is required"})
            return
        }

        const customer_email = customer.rows.find(data => data.email === form.email)
        const customer_phone = customer.rows.find(data => data.phone === form.phone)
        if(customer_email || customer_phone) {
            setError({message: "Customer with this phone number or email already exists"})
            return
        }
        // filter phone
        const _val = filterPhoneNumber(form.phone)

        if (_val.error) {
            setError({ message: _val?.message || "" })
            return
        }

        // check if phone number isn't valid
        if( _val.phone.length !== 11 ){
            setError({ message: "Phone number must be of 11 digit" })
            return
        }

        const payload = form;

        payload.title = payload.title.trim();
        payload.firstName = payload.firstName.trim();
        payload.lastName = payload.lastName.trim();

        payload.phone = _val.phone;
        // @ts-ignore
        payload.isEditing = (props.data !== null);

        // send payload
        __setpayload(payload)
        dispatch(addCustomerAction(payload))
    }

    return (
        <>
            <Modal
                open={props.visible}
                onClose={()=>{
                    props.setVisible(false)
                }}
                sx={{
                    // color: 'black'
                }}
                >
                <Box
                
                // bgcolor={'black'} 
                sx={{ 
                    // color: 'black'
                    borderColor: 'blue',
                    borderWidth: 1,
                    boxShadow: '1px solid blue',
                    width: {sm: '60%', xs: '100%'}
                }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    // width: 400,
                    padding: 20,
                    borderRadius: 8,
                    borderColor: 'blue',
                    borderWidth: 1,
                    // backgroundColor: 'grey'
                    backgroundColor: prefersDark ? 'black' : 'white',
                    overflow: 'auto',
                    maxHeight: window.screen.availHeight * 0.9
                }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs={5}>
                            {/* @ts-ignore */}
                            <h2>
                                {
                                    (props.data == null) ? "Create " : "Edit "
                                }
                                 Customer
                            </h2>
                        </Grid>
                        
                        <Grid container xs={6}>
                            <div style={{ cursor: 'pointer' }} onClick={()=>{
                                setForm({...form, accountType: 'corporate'})
                            }}>
                                Corporate
                                <Radio name='account' checked={form.accountType === 'corporate'} />
                            </div>

                            <div />

                            <div style={{ cursor: 'pointer' }} onClick={()=>{
                                setForm({...form, accountType: 'individual'})
                            }}>
                                Individual
                                <Radio name='account' checked={form.accountType === 'individual'} />
                            </div>
                        </Grid>

                        <Grid item xs={1}>
                            <Cancel style={{ cursor: 'pointer' }} onClick={()=> props.setVisible(false)} />
                        </Grid>
                    </Grid>

                    <Box sx={{ 
                        
                    }}>
                        <Stack direction={"row"} spacing={2}>
                            <TextField
                                label='Title'
                                onChange={val => setForm({...form, title: val.target.value})}
                                value={form.title}
                                style={{ width: '49%' }} />
                            
                        </Stack>
                        <br />

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
                        <br />

                        {( (form.accountType === 'corporate') && (
                        <Stack direction={"row"} spacing={2}>
                            <TextField
                                label='Company Name'
                                onChange={val => setForm({...form, companyName: val.target.value})}
                                value={form.companyName}
                                fullWidth={true} />
                            <br />
                            <br />
                        </Stack>
                        ))}

                        <TextField
                            label='Email'
                            onChange={val => setForm({...form, email: val.target.value.trim()})}
                            value={form.email}
                            type="email"
                            fullWidth={true}
                        />
                        <br />
                        <br />

                        <Stack direction={"row"} spacing={2}>
                            <TextField
                                label='Phone'
                                onChange={val => {
                                    // check length
                                    if((val.target.value).length > 11){
                                        setError({
                                            message: "phone number can't be more than 11"
                                        })
                                        return
                                    }

                                    // check alphabet
                                    if( /[A-Za-z]/g.test(val.target.value) ){
                                        setError({
                                            message: "phone number can't be alphabetical"
                                        })
                                        return
                                    }

                                    const _val = filterPhoneNumber(val.target.value)
                                    if(_val.error){
                                        setError({
                                            message: _val.message
                                        })
                                    }
                                    setForm({...form, phone: _val.phone})
                                }}
                                type="tel"
                                value={form.phone}
                                fullWidth={true} />
                                
                            <TextField
                                label='Credit Rating'
                                onChange={val => setForm({...form, creditRating: val.target.value})}
                                value={form.creditRating}
                                fullWidth={true} />
                        </Stack>
                        <br />

                        <TextField
                            label='Address'
                            onChange={val => setForm({...form, address: val.target.value})}
                            value={form.address}
                            fullWidth={true} />
                        <br />
                        <br />

                        <Stack direction={"row"} spacing={2}>
                            <Select
                                onChange={e => {
                                console.log(e, ' e')
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
                                                console.log(item, "item")
                                                setForm({
                                                    ...form,
                                                    state: item.value
                                                })
                                            }}
                                            key={index}
                                            value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                        );
                                    })}
                            </Select>

                            <Select
                                onChange={e => {
                                console.log(e, ' e')
                                }}
                                value={form.district}
                                name={"District"}
                                label={"District"}
                                fullWidth
                                >
                                    {district.map((item, index) => {
                                        return (
                                        <MenuItem
                                            onClick={()=>{
                                                console.log(item, "item")
                                                setForm({
                                                    ...form,
                                                    district: item.value
                                                })
                                            }}
                                            key={index}
                                            value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                        );
                                    })}
                            </Select>

                            {/* <TextField
                                label='District'
                                onChange={val => setForm({...form, district: val.target.value})}
                                value={form.district}
                                fullWidth={true} /> */}
                        </Stack>
                        <br />

                        <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%' }}>
                            <LoadingButton
                                // sx={{ ml: 2 }}
                                type="submit"
                                loading={isLoading}
                                disabled={isLoading}
                                onClick={() => {
                                    handleCreate()
                                }}
                                variant="contained"
                                color="success"
                                // endIcon={<Send />}
                                >
                                    {
                                        (props.data != null) ? "Edit" : "Create"
                                    }
                                
                            </LoadingButton>
                            <Typography style={{ width: '50%' }}>
                                Customer should sign in on AutoHyve App with email and phone number as password
                            </Typography>
                        </div>
                    </Box>
                    
                </Box>
            </Modal>

            <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />

      <AppAlert
        alertType="success"
        show={undefined !== success}
        message={success?.message}
        onClose={() => setSuccess(undefined)}
      />
        </>
    )
}

// const style = ;