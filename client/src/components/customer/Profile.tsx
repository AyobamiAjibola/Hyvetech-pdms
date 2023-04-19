import React, { useContext, useEffect, useState } from 'react';
import { Box, Stack, TextField, Select, MenuItem, Grid, Typography, Button, DialogActions, DialogContentText } from '@mui/material';
import { MESSAGES, STATES } from '../../config/constants';
import { ISelectData } from '../forms/fields/SelectField'
import { CustomerPageContext } from '../../pages/customer/CustomerPage';
import { CustomerPageContextProps } from '@app-interfaces';
import { LoadingButton } from '@mui/lab';
import { getCustomerAction, updateCustomerAction } from '../../store/actions/customerActions';
// import { Send } from '@mui/icons-material';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { clearUpdateCustomerStatus } from '../../store/reducers/customerReducer';
import { CustomHookMessage } from '@app-types';
import AppAlert from '../alerts/AppAlert';
import EstimateForm from '../forms/estimate/EstimateForm';
import useEstimate from '../../hooks/useEstimate';
import AppModal from '../modal/AppModal';
import { Formik } from 'formik';
import estimateModel from '../forms/models/estimateModel';
import capitalize from 'capitalize';
import { filterPhoneNumber } from '../../utils/generic';

function ProfileNew() {
const [states, setStates] = useState<ISelectData[]>([]);
const [district, setDistrict] = useState<ISelectData[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [isEditing, setIsEditing] = useState<boolean>(false);
const [error, setError] = useState<CustomHookMessage>();
const [success, setSuccess] = useState<CustomHookMessage>();
const [closeEstimateModal, setCloseEstimateModal] = useState<boolean>(false);
const [form, setForm] = useState<any>({
    firstName: "",
    email: "",
    lastName: "",
    companyName: "",
    accountType: "",
    phone: "",
    creditRating: "",
    state: "",
    district: "",
    address: "",
  });

const estimate = useEstimate();

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
    try{
        const _temp = (STATES.filter( v => (v.name == form.state) ))[0];

        if(_temp == undefined){
            return
        }

        // @ts-ignore
        const newDistrict = (_temp.districts).map(district => ({
        label: district.name,
        value: district.name,
        }));

        console.log(newDistrict)

        setDistrict(newDistrict);
    }catch(e){
        console.log(e)
    }
}, [form.state]);

  const { customer } = useContext(CustomerPageContext) as CustomerPageContextProps;

  useEffect(()=>{
    // update customer info

    setForm({
        firstName: customer?.firstName,
        email: customer?.email,
        lastName: customer?.lastName,
        companyName: customer?.companyName,
        accountType: ((customer?.companyName || '').length > 2) ? "Corporate" : "Individual",
        phone: customer?.phone,
        creditRating: customer?.creditRating || "",
        state: customer?.contacts[0]?.state || "",
        district: customer?.contacts[0]?.district || "",
        address: customer?.contacts[0]?.address || ""
    })

    setIsLoading(false)
  }, [customer])

  const customerReducer = useAppSelector(state => state.customerReducer);
  const estimateReducer = useAppSelector(state => state.estimateReducer);

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
        setSuccess({
            message: "Edited Successfully"
        })

        setTimeout(()=>{
            window.history.back()
        }, 1000)
    }

    if( customerReducer.updateCustomerStatus == 'failed' ){
        dispatch(clearUpdateCustomerStatus())
        setIsLoading(false)
        setError({
            message: customerReducer?.updateCustomerError || ""
        })
    }

}, [customerReducer.updateCustomerStatus, dispatch])

const handleEdit = async ()=>{
    setIsLoading(true)
    const _id = customer?.id;

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

    const payload = {
        id: _id,
        firstName: form.firstName.trim(),
        email: form.email,
        lastName: form.lastName.trim(),
        phone: _val.phone,
        creditRating: form.creditRating,
        companyName: form.companyName,
        state: form.state,
        district: form.district,
        address: form.address,
    }

    dispatch(updateCustomerAction(payload))
}

  return (
    <Box>
      <Stack spacing={2}>

      <Button variant="outlined" color="success" size="small" onClick={() => {
        if (customer?.id) {
            dispatch(getCustomerAction(customer?.id));
            estimate.setShowCreate(true)
        }
      }}
      style={{
        position: 'absolute',
        top: '15%',
        right: '7%',
       }}>
            Generate Estimate
      </Button>

        {
            (
                (!isEditing) && 

                (
                    <>
                        <Grid item xs={11}>
                            <Grid xs={12} container>
                            <Typography>
                                {capitalize.words(form?.firstName) || 'First Name & '}&nbsp;{capitalize.words(form?.lastName) || 'Last Name'}
                            </Typography>{' '}
                            <br />
                            </Grid>

                            {(form?.companyName || '').length != 0 && (
                            <Grid xs={12} container>
                                <Typography>{capitalize.words(form?.companyName) || 'First Name & '}</Typography> <br />
                            </Grid>
                            )}

                            <Grid xs={12} container>
                            <Typography>{form?.email || 'Email'}</Typography> <br />
                            </Grid>

                            <Grid xs={12} container>
                            <Typography>{form?.phone || 'Phone'}</Typography> <br />
                            </Grid>

                            <Grid xs={12} container>
                            <Typography>{capitalize.words(form?.address) || 'Address'}</Typography> <br />
                            </Grid>

                            <Grid xs={12} container>
                            <Typography>{form?.state || 'State'}</Typography> <br />
                            </Grid>
                        </Grid>
                    </>
                )
            )
        }

        {( isEditing && (
        <>
        <Stack direction={"row"} spacing={2}>
            <TextField
                label='First Name'
                onChange={val => setForm({...form, firstName: val.target.value})}
                value={form.firstName}
                disabled={!isEditing}
                fullWidth={true} />

            <TextField
                label='Last Name'
                onChange={val => setForm({...form, lastName: val.target.value})}
                value={form.lastName}
                disabled={!isEditing}
                fullWidth={true} />
        </Stack>

        <Stack direction={"row"} spacing={2}>
            <TextField
                label='Company Name'
                onChange={val => setForm({...form, companyName: val.target.value})}
                value={form.companyName}
                disabled={!isEditing}
                fullWidth={true} />
                
            <TextField
                label='Account Type'
                onChange={val => setForm({...form, accountType: val.target.value})}
                disabled={true && !isEditing}
                value={form.accountType}
                fullWidth={true} />
        </Stack>
            
        <TextField
            label='Email'
            onChange={val => setForm({...form, email: val.target.value.trim()})}
            disabled={true && !isEditing}
            value={form.email}
            fullWidth={true} />

        <Stack direction={"row"} spacing={2}>
            <TextField
                label='Phone'
                // onChange={val => setForm({...form, phone: val.target.value})}
                value={form.phone}
                disabled={!isEditing}
                fullWidth={true}
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
            />
                
            <TextField
                label='Credit Rating'
                onChange={val => setForm({...form, creditRating: val.target.value})}
                value={form.creditRating}
                disabled={!isEditing}
                fullWidth={true} />
        </Stack>

        <TextField
            label='Address'
            onChange={val => setForm({...form, address: val.target.value})}
            disabled={!isEditing}
            value={form.address}
            fullWidth={true} />

        <Stack direction={"row"} spacing={2}>
            <Select
                onChange={e => {
                console.log(e, ' e')
                }}
                value={form.state}
                name={"State"}
                disabled={!isEditing}
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
                disabled={!isEditing}
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

        </Stack>
        </>
        ))}
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {( isEditing && (<LoadingButton
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
            </LoadingButton>))}

            {
                (!isEditing && (
                    <LoadingButton
                        // sx={{ ml: 2 }}
                        type="button"
                        onClick={() => {
                            // 
                            setIsEditing(true)
                        }}
                        variant="contained"
                        color="success"
                        >
                        Edit
                    </LoadingButton>
                ))
            }
        </div>
        
      </Stack>

      {estimate.showCreate && (
        <AppModal
          fullWidth
          size={document.documentElement.clientWidth > 375 ? "xl" : undefined}
          fullScreen={true}
          show={estimate.showCreate}
          Content={
            <Formik
              initialValues={estimate.initialValues}
              validationSchema={estimateModel.schema}
              validateOnChange
              onSubmit={(values, formikHelpers) => {
                if (estimate.save) {
                  estimate.handleSaveEstimate(values, formikHelpers);
                } else estimate.handleCreateEstimate(values, formikHelpers);
              }}>
              <EstimateForm
                showCreate={estimate.showCreate}
                isPopUp={true}
                setLabourTotal={estimate.setLabourTotal}
                setPartTotal={estimate.setPartTotal}
                setGrandTotal={estimate.setGrandTotal}
                setDiscount={estimate.setDiscount}
                setDiscountType={estimate.setDiscountType}
                labourTotal={estimate.labourTotal}
                partTotal={estimate.partTotal}
                grandTotal={estimate.grandTotal}
                isSubmitting={
                  estimateReducer.createEstimateStatus === 'loading' || estimateReducer.saveEstimateStatus === 'loading'
                }
                setSave={estimate.setSave}
              />
            </Formik>
          }
        //   onClose={() => estimate.setShowCreate(false)}
          onClose={() => setCloseEstimateModal(true)}
        />
      )}

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

      {closeEstimateModal && <AppModal
        fullWidth
        show={closeEstimateModal}
        Content={<DialogContentText>{MESSAGES.closeEstimateModal}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button onClick={() => {setCloseEstimateModal(false), estimate.setShowCreate(false)}}>Yes</Button>
            <Button onClick={() => setCloseEstimateModal(false)}>No</Button>
          </DialogActions>
        }
        onClose={() => setCloseEstimateModal(false)}
      />}
    </Box>
  );
}

export default ProfileNew;
