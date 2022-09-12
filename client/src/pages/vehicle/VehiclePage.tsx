import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IVehicle } from "@app-models";
import {
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
} from "@mui/material";

import carImg from "../../assets/images/vehicle/car1.jpg";
import moment from "moment";

interface ILocationState {
  vehicle: IVehicle;
}

function VehiclePage() {
  const [vehicle, setVehicle] = useState<IVehicle>();

  const location = useLocation();

  useEffect(() => {
    const state = location.state as ILocationState;

    setVehicle(state.vehicle);
  }, [location.state]);

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 2, sm: 8, md: 12 }}
    >
      <Grid item xs={12} sm={3} md={3}>
        <Card>
          <CardMedia
            component="img"
            alt="green iguana"
            height="140"
            image={carImg}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {vehicle?.modelYear} {vehicle?.make} {vehicle?.model}
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
                <Typography variant="caption">{vehicle?.make}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Model Year</Typography>
                <Typography variant="caption">{vehicle?.modelYear}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Engine Type</Typography>
                <Typography variant="caption">
                  {vehicle?.engineCylinders}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Vehicle Ownership</Typography>
                <Typography variant="caption">
                  {vehicle?.isOwner ? "Owner" : "-"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Date Added</Typography>
                <Typography variant="caption">
                  {moment(vehicle?.createdAt).format("LL")}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={{ xs: 11, sm: 11, md: 16 }}>
              <Box>
                <Typography variant="subtitle2">Model</Typography>
                <Typography variant="caption">{vehicle?.model}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Engine Model</Typography>
                <Typography variant="caption">
                  {vehicle?.engineModel}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">VIN</Typography>
                <Typography variant="caption">{vehicle?.vin}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Vehicle Type</Typography>
                <Typography variant="caption">{vehicle?.type}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Plate Number</Typography>
                <Typography variant="caption">
                  {vehicle?.plateNumber}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Typography sx={{ my: 2 }}>Service History</Typography>
      </Grid>
    </Grid>
  );
}

export default VehiclePage;
