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
import {
  getCustomerTransactionsAction,
  getCustomerVehiclesAction,
} from "../../store/actions/customerActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import BookForCustomerForm from "../../components/forms/booking/BookForCustomerForm";
import { CustomHookMessage } from "@app-types";
import AppAlert from "../../components/alerts/AppAlert";

interface ILocationState {
  transaction: ITransaction;
}

function TransactionPage() {
  const [transaction, setTransaction] = useState<ITransaction>();
  const [success, setSuccess] = useState<CustomHookMessage>();

  const {
    showBooking,
    setShowBooking,
    customer,
    setVehicles,
    setShowVehicles,
  } = useContext(AppContext) as AppContextProps;

  const customerReducer = useAppSelector((state) => state.customerReducer);
  const appointmentReducer = useAppSelector(
    (state) => state.appointmentReducer
  );
  const dispatch = useAppDispatch();

  useTimeslot();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as ILocationState;

    setTransaction(state.transaction);
  }, [location.state]);

  useEffect(() => {
    if (
      appointmentReducer.createAppointmentStatus === "completed" &&
      customer
    ) {
      setSuccess({ message: "Successfully scheduled appointment" });
      dispatch(getCustomerTransactionsAction(customer.id));
    }
  }, [dispatch, customer, appointmentReducer.createAppointmentStatus]);

  useEffect(() => {
    if (customerReducer.getCustomerTransactionsStatus === "completed") {
      const _transaction = customerReducer.transactions.find(
        (value) => value.id === transaction?.id
      );

      if (_transaction) setTransaction(_transaction);
    }
  }, [
    customerReducer.getCustomerTransactionsStatus,
    customerReducer.transactions,
    transaction?.id,
  ]);

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

  const isProcessed = useMemo(() => {
    let result = true;

    if (
      transaction?.status === "success" &&
      transaction?.serviceStatus === "unprocessed"
    ) {
      result = false;
    }

    if (
      transaction?.status !== "success" &&
      transaction?.serviceStatus === "unprocessed"
    ) {
      result = false;
    }

    return result;
  }, [transaction]);

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
          {!isProcessed && (
            <Grid item xs={12} md={3}>
              <Button
                size="small"
                onClick={handleShowBooking}
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ textTransform: "capitalize" }}
              >
                Schedule {transaction?.purpose}
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
      <AppAlert
        alertType="success"
        show={success !== undefined}
        message={success?.message}
        onClose={() => setSuccess(undefined)}
      />
    </React.Fragment>
  );
}

export default TransactionPage;
