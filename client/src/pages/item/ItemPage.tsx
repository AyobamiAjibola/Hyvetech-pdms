import { IItem } from "@app-models";
import { CustomHookMessage } from "@app-types";
import { ArrowBackIosNew, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Divider, Grid, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import AppAlert from "../../components/alerts/AppAlert";
import itemModel from "../../components/forms/models/itemModel";
import AppModal from "../../components/modal/AppModal";
import useAppSelector from "../../hooks/useAppSelector";
import useItemStock from "../../hooks/useItemStock";

interface ILocationState {
    item?: IItem;
}

const { fields } = itemModel;

function ItemPage() {
    const [item, setItem] = useState<IItem>();
    const location = useLocation();
    const [addQty, setAddQty] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<string>();
    const itemReducer = useAppSelector(state => state.itemStockReducer);
    const [successAlert, setSuccessAlert] = useState<CustomHookMessage>();
    const [error, setError] = useState<CustomHookMessage>();
    const Items = useItemStock();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state) {
          const state = location.state as ILocationState;

          setItem(state.item);
        }
    }, [location]);

    const edit = useMemo(() => {
        return itemReducer.addStockStatus === 'loading';
    }, [ itemReducer.addStockStatus]);

    useEffect(() => {
      if(itemReducer.addStockStatus === 'completed') {
        setSuccessAlert({message: itemReducer.addStockSuccess})
      }
    }, [itemReducer.addStockStatus])

    useEffect(() => {
        if(itemReducer.addStockStatus === 'failed') {
          setError({message: itemReducer.addStockError})
        }
      }, [itemReducer.addStockStatus])

    return (
      <React.Fragment>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center', width: '100%'
          }}
        >
          <Box
            sx={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', width: {lg: '80%', xs: '100%'},
                flexDirection: 'column', border: '0.5px solid whitesmoke',
                p: {md: 4, xs: 2}
            }}
          >
            <Box
              sx={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'left', ml: 5, mb: 2
              }}
            >
              <ArrowBackIosNew
                onClick={() => window.history.back()}
                style={{ cursor: 'pointer' }}
              />
              <Typography
                sx={{
                  fontSize: {sm: 30, xs: 20},
                  fontWeight: 500, ml: 4
                }}
              >Item Detail</Typography>
            </Box>
            <Box
                sx={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 4, m: 2,
                    flexDirection: {md: 'row', xs: 'column'}
                }}
            >
                <Box sx={{width: {md: '45%', xs: '100%'}}}>
                  <TextField
                    value={item?.name}
                    fullWidth
                    type='string'
                    name={fields.name.name}
                    label={fields.name.label}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    InputProps={{
                    readOnly: true
                    }}
                  />
                </Box>
                <Box sx={{width: {md: '45%', xs: '100%'}}}>
                  <TextField
                    value={item?.sellingPrice}
                    fullWidth
                    type='string'
                    name={fields.sellingPrice.name}
                    label={fields.sellingPrice.label}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    InputProps={{
                    readOnly: true
                    }}
                  />
                </Box>
            </Box>
            <Box
                sx={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 4, m: 2,
                    flexDirection: {md: 'row', xs: 'column'}
                }}
            >
                <Box sx={{width: {md: '45%', xs: '100%'}}}>
                  <TextField
                    value={item?.type}
                    fullWidth
                    type='string'
                    name={fields.type.name}
                    label={fields.type.label}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    InputProps={{
                    readOnly: true
                    }}
                  />
                </Box>
                <Box sx={{width: {md: '45%', xs: '100%'}}}>
                  <TextField
                    value={item?.buyingPrice}
                    fullWidth
                    type='string'
                    name={fields.buyingPrice.name}
                    label={fields.buyingPrice.label}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    InputProps={{
                    readOnly: true
                    }}
                  />
                </Box>
            </Box>
            <Box
                sx={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 4, m: 2,
                    flexDirection: {md: 'row', xs: 'column'}
                }}
            >
              <Box sx={{width: {md: '45%', xs: '100%'}, mt: {md: -3, xs: 0}}}>
                <TextField
                    value={item?.unit}
                    fullWidth
                    type='string'
                    name={fields.unit.name}
                    label={fields.unit.label}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    InputProps={{
                    readOnly: true
                    }}
                />
              </Box>
              <Box sx={{width: {md: '45%', xs: '100%'}}}>
                <>
                  <TextField
                    value={item?.quantity}
                    fullWidth
                    type='string'
                    name={fields.quantity.name}
                    label={fields.quantity.label}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    InputProps={{
                    readOnly: true
                    }}
                  />
                  <Typography
                    onClick={() => setAddQty(true)}
                    color={'skyblue'}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer', fontSize: 14, mt: 1
                    }}>
                    <FaPlus style={{ marginRight: 8 }} />
                    Add Quantity
                  </Typography>
                </>
              </Box>
            </Box>
            <Box
                sx={{
                    width: '100%', display: 'flex',
                    justifyContent: 'center', gap: 4, m: 2,
                    flexDirection: {md: 'row', xs: 'column'}
                }}
            >
              <Box sx={{width: {md: '45%', xs: '100%'}}}>
                <TextField
                    value={item?.description}
                    fullWidth
                    multiline
                    rows={4}
                    type='string'
                    name={fields.description.name}
                    label={fields.description.label}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    InputProps={{
                    readOnly: true
                    }}
                />
              </Box>
              <Box sx={{width: {md: '45%', xs: '100%'}}}>
                <TextField
                    value={item?.partNumber?.toUpperCase()}
                    fullWidth
                    type='string'
                    name={fields.partNumber.name}
                    label={fields.partNumber.label}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    InputProps={{
                    readOnly: true
                    }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        {addQty && (
          <AppModal
            fullWidth
            size="sm"
            show={addQty}
            Content={
              <Formik
                initialValues={{}}
                onSubmit={(values, formikHelpers) => {
                  console.log(values, formikHelpers);
                }}
                enableReinitialize
                validateOnChange
                >
                <div style={{ marginTop: 20, marginBottom: 20 }}>
                    <Typography
                      style={{
                        marginBottom: 20,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                    <FaPlus style={{ marginRight: 8 }} />
                      Add Quantity
                    </Typography>
                    <Grid spacing={document.documentElement.clientWidth <= 375 ? 4 : 10}
                    container
                    >
                    <Grid item md={12} xs={12}>
                      <TextField
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        fullWidth
                        variant="outlined"
                        name={`quantity`}
                        label="Quantity"
                      />
                    </Grid>
                    </Grid>
                    <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                    <LoadingButton
                      type="submit"
                      loading={edit}
                      onClick={() => {
                        //@ts-ignore
                        Items.handleAddStock({quantity: +quantity, id: item?.id})
                        navigate('/items')
                      }}
                      variant="contained"
                      color="secondary"
                      endIcon={<Save />}
                    >
                      {'Save'}
                    </LoadingButton>
                </div>
                </Formik>
            }
            onClose={() => setAddQty(false)}
          />
      )}
      <AppAlert
        alertType="success"
        show={undefined !== successAlert}
        message={successAlert?.message}
        onClose={() => setSuccessAlert(undefined)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
      </React.Fragment>
    )
}

export default ItemPage;