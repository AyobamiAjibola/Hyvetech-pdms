import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import moment from 'moment';
import { FileOpen } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import { ICustomerSubscription, IVehicle } from '@app-models';
import carImg from '../../../assets/images/vehicle/car1.jpg';
import { FaExpandAlt, FaGift } from 'react-icons/fa';
import useAppSelector from '../../../hooks/useAppSelector';
import useAppDispatch from '../../../hooks/useAppDispatch';
import { getJobsAction } from '../../../store/actions/jobActions';
import { getDriverVehicleSubscriptionAction } from '../../../store/actions/vehicleActions';
import settings from '../../../config/settings';
import axiosClient from '../../../config/axiosClient';
import AppModal from '../../modal/AppModal';
import { DriverVehiclesContext } from './DriverVehicles';
import { DriverVehiclesContextProps } from '@app-interfaces';
import { APPOINTMENT_STATUS } from '../../../config/constants';
import CustomerSubscription from './CustomerSubscription';

interface ILocationState {
  vehicle?: IVehicle;
  isDriver?: boolean;
  isCustomer?: boolean;
}

export default function CustomerVehicle(props: ILocationState) {
  const [viewImage, setViewImage] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const { setCustomerSub, vehicle, setVehicle, viewSub, setViewSub } = useContext(
    DriverVehiclesContext,
  ) as DriverVehiclesContextProps;

  const params = useParams();

  const vehicleReducer = useAppSelector(state => state.vehicleReducer);
  const jobReducer = useAppSelector(state => state.jobReducer);
  const dispatch = useAppDispatch();

  const location = useLocation();

  useEffect(() => {
    const partnerId = params.id as string;

    if (jobReducer.getJobsStatus === 'idle') {
      dispatch(getJobsAction(+partnerId));
    }
  }, [dispatch, jobReducer.getJobsStatus, params.id]);

  useEffect(() => {
    if (vehicleReducer.getDriverVehicleSubscriptionStatus === 'completed') {
      // console.log(vehicleReducer.driverSubscriptions);
    }
  }, [vehicleReducer.driverSubscriptions, vehicleReducer.getDriverVehicleSubscriptionStatus]);

  useEffect(() => {
    if (location.state) {
      const state = location.state as ILocationState;

      if (state.vehicle) {
        setVehicle(state.vehicle);
        dispatch(getDriverVehicleSubscriptionAction(state.vehicle.id));
      }
    }

    if (vehicle) {
      dispatch(getDriverVehicleSubscriptionAction(vehicle.id));
    }
  }, [dispatch, location.state, props.isCustomer, props.isDriver, setVehicle, vehicle]);

  const handleViewImage = async (file: string) => {
    file = `${settings.api.driverBaseURL}/${file}`;

    const response = await axiosClient.get(file, {
      responseType: 'blob',
    });

    const reader = new FileReader();
    reader.readAsDataURL(response.data);

    reader.onloadend = function () {
      const base64data = reader.result as string;
      setImageUrl(base64data);
    };

    setTimeout(() => setViewImage(true), 500);
  };

  const handleViewSubscription = (sub: ICustomerSubscription) => {
    setCustomerSub(sub);
    setViewSub(true);
  };

  return (
    <React.Fragment>
      {vehicle ? (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
          <Grid item xs={12} sm={3} md={3}>
            <Card>
              <CardMedia component="img" alt="green iguana" height="140" image={carImg} />
              <CardContent>
                <Typography variant="h5" component="div">
                  {vehicle.modelYear} {vehicle.make} {vehicle.model}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="secondary" size="small">
                  Book Inspection
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={9} md={9}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={{ xs: 11, sm: 11, md: 16 }}>
                  <Box>
                    <Typography variant="subtitle2">Make</Typography>
                    <Typography variant="caption">{vehicle.make}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Model Year</Typography>
                    <Typography variant="caption">{vehicle.modelYear}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Engine Type</Typography>
                    <Typography variant="caption">{vehicle.engineCylinders}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Vehicle Ownership</Typography>
                    <Typography variant="caption">{vehicle.isOwner ? 'Owner' : '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Date Added</Typography>
                    <Typography variant="caption">{moment(vehicle.createdAt).format('LL')}</Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={{ xs: 11, sm: 11, md: 16 }}>
                  <Box>
                    <Typography variant="subtitle2">Model</Typography>
                    <Typography variant="caption">{vehicle.model}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Engine Model</Typography>
                    <Typography variant="caption">{vehicle.engineModel}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">VIN</Typography>
                    <Typography variant="caption">{vehicle.vin}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Vehicle Type</Typography>
                    <Typography variant="caption">{vehicle.type}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Plate Number</Typography>
                    <Typography variant="caption">{vehicle.plateNumber}</Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1">Vehicle Papers</Typography>
                <Stack direction="row" spacing={1}>
                  <Box sx={{ minWidth: 160 }}>
                    <Typography variant="caption">Vehicle Inspection</Typography>
                    {vehicle.vehicleInspectionFileUrl && (
                      <Avatar
                        style={{ minWidth: '100%' }}
                        onClick={() => handleViewImage(vehicle.vehicleInspectionFileUrl)}
                        sx={{ cursor: 'pointer' }}
                        variant="square"
                        src={vehicle.vehicleInspectionFileUrl}>
                        <FileOpen />
                      </Avatar>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 160 }}>
                    <Typography variant="caption">Motor Receipt</Typography>
                    {vehicle.motorReceiptFileUrl && (
                      <Avatar
                        style={{ minWidth: '100%' }}
                        onClick={() => handleViewImage(vehicle.motorReceiptFileUrl)}
                        sx={{ cursor: 'pointer' }}
                        variant="square"
                        src={vehicle.motorReceiptFileUrl}>
                        <FileOpen />
                      </Avatar>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 160 }}>
                    <Typography variant="caption">Proof Of Ownership</Typography>
                    {vehicle.proofOfOwnershipFileUrl && (
                      <Avatar
                        style={{ minWidth: '100%' }}
                        onClick={() => handleViewImage(vehicle.proofOfOwnershipFileUrl)}
                        sx={{ cursor: 'pointer' }}
                        variant="square"
                        src={vehicle.proofOfOwnershipFileUrl}>
                        <FileOpen />
                      </Avatar>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 160 }}>
                    <Typography variant="caption">Road Worthiness</Typography>
                    {vehicle.roadWorthinessFileUrl && (
                      <Avatar
                        style={{ minWidth: '100%' }}
                        onClick={() => handleViewImage(vehicle.roadWorthinessFileUrl)}
                        sx={{ cursor: 'pointer' }}
                        variant="square"
                        src={vehicle.roadWorthinessFileUrl}>
                        <FileOpen />
                      </Avatar>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 160 }}>
                    <Typography variant="caption">Registration Number</Typography>
                    {vehicle.registrationNumberFileUrl && (
                      <Avatar
                        style={{ minWidth: '100%' }}
                        onClick={() => handleViewImage(vehicle.registrationNumberFileUrl)}
                        sx={{ cursor: 'pointer' }}
                        variant="square"
                        src={vehicle.registrationNumberFileUrl}>
                        <FileOpen />
                      </Avatar>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 160 }}>
                    <Typography variant="caption">Third Party Insurance</Typography>
                    {vehicle.thirdPartyInsuranceFileUrl && (
                      <Avatar
                        style={{ minWidth: '100%' }}
                        onClick={() => handleViewImage(vehicle.thirdPartyInsuranceFileUrl)}
                        sx={{ cursor: 'pointer' }}
                        variant="square"
                        src={vehicle.thirdPartyInsuranceFileUrl}>
                        <FileOpen />
                      </Avatar>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
            <Grid item container xs={12} spacing={{ xs: 2, md: 2 }}>
              <Grid item xs={6}>
                <Typography sx={{ my: 1 }}>Estimates</Typography>
                <Stack>
                  <Card>
                    <CardContent />
                  </Card>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ my: 1 }}>Subscriptions</Typography>
                <Stack>
                  <Card>
                    <CardContent>
                      <List>
                        {vehicleReducer.customerSubscriptions.length ? (
                          vehicleReducer.customerSubscriptions
                            .filter(sub => sub.status !== APPOINTMENT_STATUS.cancel)
                            .map((sub, index) => {
                              return (
                                <ListItem
                                  key={index}
                                  secondaryAction={
                                    <IconButton
                                      onClick={() => handleViewSubscription(sub)}
                                      edge="end"
                                      aria-label="view">
                                      <FaExpandAlt />
                                    </IconButton>
                                  }>
                                  <ListItemAvatar>
                                    <Avatar>
                                      <FaGift />
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={`${sub.planType}`}
                                    secondary={`(${sub.status}) ${sub.planCategory} ${sub.paymentPlan}`}
                                  />
                                </ListItem>
                              );
                            })
                        ) : (
                          <ListItem>
                            <ListItemText primary="No Subscriptions" />
                          </ListItem>
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
          <Grid item xs={12}>
            <Typography>No Data</Typography>
          </Grid>
        </Grid>
      )}

      <AppModal
        show={viewImage}
        title="Vehicle paper"
        fullScreen
        Content={<img width="50%" src={imageUrl} alt="Vehicle paper" crossOrigin="anonymous" />}
        onClose={() => setViewImage(false)}
      />
      <AppModal
        fullWidth
        size="xs"
        show={viewSub}
        Content={<CustomerSubscription />}
        onClose={() => setViewSub(false)}
      />
    </React.Fragment>
  );
}
