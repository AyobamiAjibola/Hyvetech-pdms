import React from "react";

import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IRideShareDriverSubscription } from "@app-models";

interface IProps {
  rows: IRideShareDriverSubscription[];
}

export default function DriverSubDetailTable(props: IProps) {
  const { rows } = props;
  const [open, setOpen] = React.useState<number>(0);

  const handleToggle = (index: number) => {
    setOpen(index);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>First Name</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            return (
              <React.Fragment key={index}>
                <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleToggle(index)}
                    >
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.planType}
                  </TableCell>
                  <TableCell align="right">{row.planCategory}</TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  <TableCell align="right">{row.paymentPlan}</TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse in={open === index} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Vehicles
                        </Typography>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell>Make</TableCell>
                              <TableCell>Model</TableCell>
                              <TableCell align="right">Year</TableCell>
                              <TableCell align="right">VIN</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.vehicles.map((vehicle) => (
                              <TableRow key={vehicle.id}>
                                <TableCell component="th" scope="row">
                                  {vehicle.make}
                                </TableCell>
                                <TableCell>{vehicle.model}</TableCell>
                                <TableCell align="right">
                                  {vehicle.modelYear}
                                </TableCell>
                                <TableCell align="right">
                                  {vehicle.vin}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
