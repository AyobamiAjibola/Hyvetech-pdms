import React, { useContext, useEffect, useMemo, useState } from "react";
import { ITransaction } from "@app-models";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
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
import { AppContext } from "../../context/AppContextProvider";
import { AppContextProps } from "@app-interfaces";
import BookingModal from "../../components/modal/BookingModal";
import useTimeslot from "../../hooks/useTimeslot";
import {
  DRIVE_IN_PLAN,
  FAF_SUB,
  HOUSE_HOLD_SUB,
  HYBRID_PLAN,
  MOBILE_PLAN,
  ONE_TIME_SUB,
  PICK_ME_UP_SUB,
} from "../../config/constants";
import { getCustomerVehiclesAction } from "../../store/actions/customerActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import BookForCustomerForm from "../../components/forms/booking/BookForCustomerForm";

interface ILocationState {
  transaction: ITransaction;
}

function TransactionPage() {
  const [transaction, setTransaction] = useState<ITransaction>();

  const {
    showBooking,
    setShowBooking,
    customer,
    setVehicles,
    setShowVehicles,
  } = useContext(AppContext) as AppContextProps;

  const customerReducer = useAppSelector((state) => state.customerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (customer) {
      dispatch(getCustomerVehiclesAction(customer.id));
    }
  }, [customer, dispatch]);

  useEffect(() => {
    if (customerReducer.getCustomerVehiclesStatus === "completed") {
      setVehicles(customerReducer.vehicles);
    }
  }, [
    customerReducer.getCustomerVehiclesStatus,
    customerReducer.vehicles,
    setVehicles,
  ]);

  useTimeslot();
  const location = useLocation();

  const planCategory = useMemo(() => {
    let planCategory;

    switch (transaction?.purpose) {
      case transaction?.purpose.match(DRIVE_IN_PLAN)?.input:
        {
          const match = transaction?.purpose.match(DRIVE_IN_PLAN);
          if (match) planCategory = match[0];
        }
        break;
      case transaction?.purpose.match(MOBILE_PLAN)?.input:
        {
          const match = transaction?.purpose.match(MOBILE_PLAN);
          if (match) planCategory = match[0];
        }
        break;
      case transaction?.purpose.match(HYBRID_PLAN)?.input:
        {
          const match = transaction?.purpose.match(HYBRID_PLAN);
          if (match) planCategory = match[0];
        }
        break;
      default:
    }

    return planCategory;
  }, [transaction]);

  const subscriptionName = useMemo(() => {
    let subName;

    switch (transaction?.purpose) {
      case transaction?.purpose.match(ONE_TIME_SUB)?.input:
        {
          const match = transaction?.purpose.match(ONE_TIME_SUB);
          if (match) subName = match[0];
        }
        break;
      case transaction?.purpose.match(HOUSE_HOLD_SUB)?.input:
        {
          const match = transaction?.purpose.match(HOUSE_HOLD_SUB);
          if (match) subName = match[0];
        }
        break;
      case transaction?.purpose.match(FAF_SUB)?.input:
        {
          const match = transaction?.purpose.match(FAF_SUB);
          if (match) subName = match[0];
        }
        break;
      case transaction?.purpose.match(PICK_ME_UP_SUB)?.input:
        {
          const match = transaction?.purpose.match(PICK_ME_UP_SUB);
          if (match) subName = match[0];
        }
        break;
      default:
    }

    return subName;
  }, [transaction]);

  const handleShowBooking = () => {
    setShowBooking(true);
    setShowVehicles(true);
  };

  const handleCloseBooking = () => {
    setShowVehicles(false);
    setShowBooking(false);
  };

  useEffect(() => {
    const state = location.state as ILocationState;

    setTransaction(state.transaction);
  }, [location.state]);

  return (
    <React.Fragment>
      <Box>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={9}>
            <Box mb={2}>
              <span className={styles.title}>Transaction</span> -{" "}
              <span className={styles.subtitle}>
                {transaction?.serviceStatus}
                {" on "}
                {moment(transaction?.createdAt).format("LLL")}
                {", for "}
                {transaction?.purpose}
              </span>
            </Box>
          </Grid>
          {transaction?.status !== "success" &&
            transaction?.serviceStatus === "unprocessed" && (
              <Grid item xs={12} md={3}>
                <Button
                  size="small"
                  onClick={handleShowBooking}
                  fullWidth
                  variant="outlined"
                  color="primary"
                  sx={{ textTransform: "capitalize" }}
                >
                  Schedule {transaction.purpose}
                </Button>
              </Grid>
            )}
        </Grid>
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
      <BookingModal
        fullScreen
        open={showBooking}
        Content={
          <BookForCustomerForm
            planCategory={planCategory}
            subscriptionName={subscriptionName}
            amount={transaction?.amount}
            paymentReference={transaction?.reference}
          />
        }
        onClose={handleCloseBooking}
      />
    </React.Fragment>
  );
}

export default TransactionPage;
