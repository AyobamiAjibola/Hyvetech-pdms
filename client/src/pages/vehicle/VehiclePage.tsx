import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import moment from 'moment';
import { FileOpen } from '@mui/icons-material';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
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
  Stack,
  Typography,
} from '@mui/material';

import { IVehicle } from '@app-models';
import carImg from '../../assets/images/vehicle/car1.jpg';
import useAppDispatch from '../../hooks/useAppDispatch';
import settings from '../../config/settings';
import axiosClient from '../../config/axiosClient';
import AppModal from '../../components/modal/AppModal';
import generatePageNumbers from '../../utils/generic';
import { DriverVehiclesContextProps } from '@app-interfaces';

interface ILocationState {
  vehicle?: IVehicle;
  isDriver?: boolean;
  isCustomer?: boolean;
}

export const VehiclePageContext = createContext<DriverVehiclesContextProps | null>(null);

function VehiclePage(props: ILocationState) {
  const [vehicle, setVehicle] = useState<IVehicle>();
  const [viewImage, setViewImage] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const dispatch = useAppDispatch();

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const state = location.state as ILocationState;

      if (state.vehicle) {
        setVehicle(state.vehicle);
      }
    }

    if (props.vehicle) {
      setVehicle(props.vehicle);
    }
  }, [dispatch, location.state, props.vehicle]);

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
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ my: 1 }}>Subscriptions</Typography>
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
        size="sm"
        Content={
          <Document file={imageUrl}>
            {generatePageNumbers(10).map((value, index) => (
              <Page key={index} pageNumber={value} />
            ))}
          </Document>
        }
        onClose={() => setViewImage(false)}
      />
    </React.Fragment>
  );
}

export default VehiclePage;
