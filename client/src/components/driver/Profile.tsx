import React, { useContext, useState } from 'react';
import { Avatar, Box, LinearProgress, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { FileOpen } from '@mui/icons-material';
import AppModal from '../modal/AppModal';
import settings from '../../config/settings';
import axiosClient from '../../config/axiosClient';
import DriverPageContext from '../../context/DriverPageContext';
import { DriverPageContextProps } from '@app-interfaces';

function Profile() {
  const [viewImage, setViewImage] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const { driver } = useContext(DriverPageContext) as DriverPageContextProps;

  const handleViewImage = async (imageUrl: string) => {
    imageUrl = `${settings.api.driverBaseURL}/${imageUrl}`;

    const response = await axiosClient.get(imageUrl, {
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
      <TableContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} component={Box}>
        <Table sx={{ maxWidth: 500 }} aria-label="simple table">
          {driver ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  First Name
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {driver.firstName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Last Name
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {driver.lastName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Phone Number
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {driver.phone}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Driver License (front)
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {driver.frontLicenseImageUrl && (
                    <Avatar
                      onClick={() => handleViewImage(driver.frontLicenseImageUrl)}
                      sx={{ cursor: 'pointer' }}
                      variant="square"
                      src={driver.frontLicenseImageUrl}>
                      <FileOpen />
                    </Avatar>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} component="th" scope="row">
                  Driver License (rear)
                </TableCell>
                <TableCell colSpan={4} align="right">
                  {driver.rearLicenseImageUrl && (
                    <Avatar
                      onClick={() => handleViewImage(driver.rearLicenseImageUrl)}
                      sx={{ cursor: 'pointer' }}
                      variant="square"
                      src={driver.rearLicenseImageUrl}>
                      <FileOpen />
                    </Avatar>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <AppModal
        fullScreen
        show={viewImage}
        title="Driver license"
        size="xl"
        Content={<img width="50%" src={imageUrl} alt="Driver license" crossOrigin="anonymous" />}
        onClose={() => setViewImage(false)}
      />
    </React.Fragment>
  );
}

export default Profile;
