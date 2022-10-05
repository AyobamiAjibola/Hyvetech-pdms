import {
  Avatar,
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useAppSelector from "../../../hooks/useAppSelector";
import settings from "../../../config/settings";
import AppModal from "../../modal/AppModal";
import { FileOpen } from "@mui/icons-material";
import { IRideShareDriver } from "@app-models";
import axiosClient from "../../../config/axiosClient";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import generatePageNumbers from "../../../utils/generic";

function DriverProfile() {
  const [viewImage, setViewImage] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [driver, setDriver] = useState<IRideShareDriver | null>(null);

  const rideShareReducer = useAppSelector((state) => state.rideShareReducer);

  useEffect(() => {
    setDriver(rideShareReducer.driver);
  }, [rideShareReducer.driver]);

  const handleViewImage = async (imageUrl: string) => {
    imageUrl = `${settings.api.baseURL}/${imageUrl}`;

    const response = await axiosClient.get(imageUrl, {
      responseType: "blob",
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
      <TableContainer
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        component={Box}
      >
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
                      onClick={() =>
                        handleViewImage(driver.frontLicenseImageUrl)
                      }
                      sx={{ cursor: "pointer" }}
                      variant="square"
                      src={driver.frontLicenseImageUrl}
                    >
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
                      onClick={() =>
                        handleViewImage(driver.rearLicenseImageUrl)
                      }
                      sx={{ cursor: "pointer" }}
                      variant="square"
                      src={driver.rearLicenseImageUrl}
                    >
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
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <AppModal
        show={viewImage}
        title="Driver license"
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

export default DriverProfile;
