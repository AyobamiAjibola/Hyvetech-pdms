import { CustomHookMessage } from '@app-types';
import { Cancel } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, Modal, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
// import { STATES } from '../../config/constants';
import AppAlert from '../alerts/AppAlert';
// import { ISelectData } from '../forms/fields/SelectField';
import Joi from 'joi'
import { filterPhoneNumber } from '../../utils/generic';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
// import { addCustomerAction } from '../../store/actions/customerActions';
import { clearImportCustomerStatus } from '../../store/reducers/customerReducer';
import { importCustomerAction } from '../../store/actions/customerActions';

type Props = {
    callback?: any;
    visible: boolean;
    setVisible?: any;
}

export default function ImportCustomerModal(props: Props) {
    const [form, setForm] = useState<any>({
        accounts: [],
    })

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // @ts-ignore
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<CustomHookMessage>();
    const [success, setSuccess] = useState<CustomHookMessage>();

    useEffect(()=>{
        setForm({
            accounts: []
        })
    }, [props.visible])

    const dispatch = useAppDispatch()
    const customerReducer = useAppSelector(state => state.customerReducer);    

    // listen
    // listen to edit event
    useEffect(()=>{
    
        if( customerReducer.importCustomerStatus == 'idle' ){
            setIsLoading(false)
        }

        if( customerReducer.importCustomerStatus == 'loading' ){
            setIsLoading(true)
        }

        if( customerReducer.importCustomerStatus == 'completed' ){
            dispatch(clearImportCustomerStatus())
            setIsLoading(false)
            setSuccess({
                message: "Created Successfully"
            })

            props.callback(form)
            props.setVisible(false)
        }

        if( customerReducer.importCustomerStatus == 'failed' ){
            dispatch(clearImportCustomerStatus())
            setIsLoading(false)
            setError({
                message: customerReducer?.addCustomerError || ""
            })
        }

    }, [customerReducer.importCustomerStatus, dispatch])

    const handleCreate = async ()=>{
        console.log(form, "form")
        // check if all entry are valid
        const {error} = Joi.object({
            accounts: Joi.array().required().label("Account File")
        }).validate(form)

        // console.log(error)
        if(error){
            setError({message: error.message})
            return
        }

        // @ts-ignore
        dispatch(importCustomerAction(form))

        
    }

    const handleFile = async (e: any)=>{
        const file = (e.target.files[0]);
        setIsLoading(true)

        const fileReader = new FileReader(); 
        fileReader.readAsText(file); 
        fileReader.onload = function() {
            const _item = (fileReader?.result?.toString() || '').split("\n");
            // const temp = [];

            try{
                const _temp = _item.map((_res)=>{
                    const _object = _res.split(',');
                    return {
                        firstName: _object[0],
                        lastName: _object[1],
                        email: _object[2],
                        phone: filterPhoneNumber(_object[3]).phone,
                        companyName: _object[4],
                        state: _object[5],
                        district: _object[6],
                    }
                })
    
                console.log(_temp);
                setForm({...form, accounts: _temp})
            }catch(e){
                setError({message: "CSV file not supported"})
            }

            setIsLoading(false)
        }; 
        fileReader.onerror = function() {
            setIsLoading(false)
            alert(fileReader.error);
        };
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
                    borderWidth: 1,
                    // backgroundColor: 'grey'
                    backgroundColor: prefersDark ? 'black' : 'white',
                    overflow: 'auto',
                    maxHeight: window.screen.availHeight * 0.9
                }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs={11}>
                            <h2>
                                Import Customer
                            </h2>
                        </Grid>
                        

                        <Grid item xs={1}>
                            <Cancel style={{ cursor: 'pointer' }} onClick={()=> props.setVisible(false)} />
                        </Grid>
                    </Grid>

                    <Box sx={{ 
                        
                    }}>
                        <Stack direction={"row"} spacing={2}>
                            <Typography>
                                We advise our template be downloaded as a guide on what is required.
                            </Typography>
                            <a download href={require("../../assets/template11.csv")}>
                                <Button type='button'>
                                    DOWNLOAD TEMPLATE
                                </Button>
                            </a>
                        </Stack>
                        <br />

                        <Stack style={{ 
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex'
                         }} direction={"row"} spacing={2}>
                            <br />
                            <input onChange={e => handleFile(e)} type={"file"} accept={".csv"} required />
                            <br />
                        </Stack>

                        {
                            (((form.accounts).length > 0) &&
                            <Typography>
                                <br />
                                <br />
                                Sending ({form.accounts.length}) customer(s) for registration
                                <br />
                                <br />
                            </Typography>
                            )
                        }
                    
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