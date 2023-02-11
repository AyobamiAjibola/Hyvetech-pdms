import { CustomHookMessage } from '@app-types';
import { Cancel } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Grid, MenuItem, Modal, Radio, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { STATES } from '../../config/constants';
import AppAlert from '../alerts/AppAlert';
import { ISelectData } from '../forms/fields/SelectField';
import Joi from 'joi'
import { filterPhoneNumber } from '../../utils/generic';

type Props = {
    callback?: any;
    visible: boolean;
    setVisible?: any;
}

export default function CreateCustomerModal(props: Props) {
    const [form, setForm] = useState({
        accountType: 'individual',
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

    const [states, setStates] = useState<ISelectData[]>([]);
    // @ts-ignore
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<CustomHookMessage>();
    const [success, setSuccess] = useState<CustomHookMessage>();

    useEffect(() => {
        const newStates = STATES.map(state => ({
          label: state.name,
          value: state.name,
        }));
    
        setStates(newStates);
    }, []);

    const handleCreate = async ()=>{
        // check if all entry are valid
        const {error} = Joi.object({
            firstName: Joi.string().required().label("First Name"),
            lastName: Joi.string().required().label("Last Name"),
            email: Joi.string().required().label("Email"),
            state: Joi.string().required().label("State"),
            district: Joi.string().required().label("District"),
            phone: Joi.string().required().label("Phone"),
            address: Joi.string().optional().label("Address"),
            creditRating: Joi.string().optional().label("Credit Rating"),
            companyName: Joi.string().optional().label("Company Name"),
            accountType: Joi.string().optional().label("Account Type"),
        }).validate(form)

        // console.log(error)
        if(error){
            setError({message: error.message})
            return
        }

        // filter phone
        const _val = filterPhoneNumber(form.phone)

        if (_val.error) {
            setError({ message: _val?.message || "" })
            return
        }

        const payload = form;

        payload.phone = _val.phone;

        // send payload
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
                
                bgcolor={'black'} 
                sx={{ 
                    // color: 'black'
                    borderColor: 'blue',
                    borderWidth: 1,
                    boxShadow: '1px solid blue'
                }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    // width: 400,
                    width: '60%',
                    padding: 20,
                    borderRadius: 8,
                    borderColor: 'blue',
                    borderWidth: 1
                    // backgroundColor: 'white'
                }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs={5}>
                            <h2>
                                Create Customer
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

                        <Stack direction={"row"} spacing={2}>
                            <TextField
                                label='Company Name'
                                onChange={val => setForm({...form, companyName: val.target.value})}
                                value={form.companyName}
                                fullWidth={true} />
                                
                        </Stack>
                        <br />
                            
                        <TextField
                            label='Email'
                            onChange={val => setForm({...form, email: val.target.value})}
                            value={form.email}
                            fullWidth={true} />
                        <br />
                        <br />

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

                            <TextField
                                label='District'
                                onChange={val => setForm({...form, district: val.target.value})}
                                value={form.district}
                                fullWidth={true} />
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
                                Create
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