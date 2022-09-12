import React, { useEffect, useState } from "react";
import { ITransaction } from "@app-models";
import { useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import styles from "../appointment/appointmentPage.module.css";
import moment from "moment";

interface ILocationState {
  transaction: ITransaction;
}

function TransactionPage() {
  const [transaction, setTransaction] = useState<ITransaction>();

  const location = useLocation();

  useEffect(() => {
    const state = location.state as ILocationState;

    setTransaction(state.transaction);
  }, [location.state]);
  return (
    <Box>
      <Box mb={2}>
        <span className={styles.title}>Transaction</span> -{" "}
        <span className={styles.subtitle}>
          {transaction?.serviceStatus}
          {" on "}
          {moment(transaction?.paidAt).format("LLL")}
          {", for "}
          {transaction?.purpose}
        </span>
      </Box>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Channel
                  </TableCell>
                  <TableCell align="left">{transaction?.channel}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Card Number
                  </TableCell>
                  <TableCell align="left">
                    ************{transaction?.last4}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Bank
                  </TableCell>
                  <TableCell align="left">{transaction?.bank}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Card Type
                  </TableCell>
                  <TableCell align="left">{transaction?.cardType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Card Expiry
                  </TableCell>
                  <TableCell align="left">
                    {transaction?.expMonth}/{transaction?.expYear}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Amount
                  </TableCell>
                  <TableCell align="left">{transaction?.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Currency
                  </TableCell>
                  <TableCell align="left">{transaction?.currency}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Reference
                  </TableCell>
                  <TableCell align="left">{transaction?.reference}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Plan Code
                  </TableCell>
                  <TableCell align="left">{transaction?.planCode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Status
                  </TableCell>
                  <TableCell align="left">{transaction?.status}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TransactionPage;
