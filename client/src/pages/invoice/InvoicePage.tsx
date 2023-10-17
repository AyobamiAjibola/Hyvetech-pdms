import React, { useEffect, useMemo, useState } from "react";
import { IBillingInformation, IEstimate, IInvoice } from "@app-models";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import capitalize from "capitalize";
import InsightImg from "../../assets/images/estimate_vector.png";
import { ILabour, IPart } from "../../components/forms/models/estimateModel";
import { formatNumberToIntl } from "../../utils/generic";
import settings from "../../config/settings";
import { INVOICE_STATUS } from "../../config/constants";
import {
  ArrowBackIosNew,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import axiosClient from "../../config/axiosClient";
import AppModal from "../../components/modal/AppModal";
import {
  getInvoicesAction,
  getSingleInvoice,
} from "../../store/actions/invoiceActions";

import AppAlert from "../../components/alerts/AppAlert";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { setInvoiceCode } from "../../store/reducers/expenseReducer";
import { makeStyles } from "@mui/styles";
import useAdmin from "../../hooks/useAdmin";
import { getExpensesAction } from "../../store/actions/expenseAction";
import moment from "moment";

const useStyles = makeStyles({
  select: {
    "&:hover": {
      background: "#F1F0F1",
    },
  },
});

const API_ROOT = settings.api.rest;

function InvoicePage() {
  const classes = useStyles();
  const [estimate, setEstimate] = useState<IEstimate>();
  const [invoice, setInvoice] = useState<IInvoice>();
  const [owner, setOwner] = useState<string>("");
  const [parts, setParts] = useState<IPart[]>([]);
  const [labours, setLabours] = useState<ILabour[]>([]);
  const [_driver, setDriver] = useState<any>(null);
  const [billingInformation, setBillingInformation] =
    useState<IBillingInformation>();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [showReport, setShowReport] = useState<boolean>(false);

  const { isTechAdmin } = useAdmin();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const store = useAppSelector((state) => state.invoiceReducer);
  const expenseReducer = useAppSelector((state) => state.expenseReducer);

  const [showRecordPayment, setShowRecordPayment] = useState<boolean>(false);
  const [recording, setRecording] = useState<any>(false);
  const [recordData, setRecordData] = useState<{
    amount: string | number;
    type: string;
  }>({
    amount: "",
    type: "Cash",
  });

  const generateExpense = () => {
    dispatch(setInvoiceCode(invoice?.code));
    navigate("/expense/create");
  };

  // @ts-ignore
  const [downloading, setDownloading] = useState<any>(false);
  const [_downloading, _setDownloading] = useState<any>(false);
  const [showMessage, setshowMessage] = useState<boolean>(false);
  const [_dueAmt, _setDueAmt] = useState<any>();

  const params = useParams() as unknown as { id: number };

  useEffect(() => {
    dispatch(getSingleInvoice(params.id));
  }, [params]);

  useEffect(() => {
    setInvoice(store.invoice);
    setEstimate(store.invoice?.estimate);
  }, [store.invoice]);

  useEffect(() => {
    if (estimate && invoice) {
      const driver = estimate.rideShareDriver;
      const customer = estimate.customer;

      const _owner = driver
        ? `${driver.firstName} ${driver.lastName}`
        : `${customer.firstName} ${customer.lastName}`;

      let _parts: IPart[];
      let _labours: ILabour[];

      if (
        invoice.edited &&
        invoice.updateStatus === INVOICE_STATUS.update.draft
      ) {
        _parts = !invoice.draftInvoice.parts?.length
          ? []
          : (invoice.draftInvoice.parts as unknown as IPart[]);
        _labours = !invoice.draftInvoice.labours?.length
          ? []
          : (invoice.draftInvoice.labours as unknown as ILabour[]);
      } else if (
        invoice.edited &&
        invoice.updateStatus === INVOICE_STATUS.update.sent
      ) {
        _parts = !invoice.parts?.length
          ? []
          : (invoice.parts as unknown as IPart[]);
        _labours = !invoice.labours?.length
          ? []
          : (invoice.labours as unknown as ILabour[]);
      } else {
        _parts = !estimate.parts?.length
          ? []
          : (estimate.parts as unknown as IPart[]);
        _labours = !estimate.labours?.length
          ? []
          : (estimate.labours as unknown as ILabour[]);
      }

      setParts(_parts);
      setDriver(driver || customer);
      setLabours(_labours);
      setOwner(capitalize.words(_owner));
      setBillingInformation(customer.billingInformation);
    }
  }, [estimate, invoice]);

  const subTotal = useMemo(() => {
    if (invoice && estimate) {
      const laboursTotal = invoice.edited
        ? invoice.updateStatus === INVOICE_STATUS.update.draft
          ? invoice.draftInvoice.laboursTotal
          : invoice.laboursTotal
        : estimate.laboursTotal;
      const partsTotal =
        invoice && invoice.edited
          ? invoice.updateStatus === INVOICE_STATUS.update.draft
            ? invoice.draftInvoice.partsTotal
            : invoice.partsTotal
          : estimate.partsTotal;

      return laboursTotal + partsTotal;
    }
    return 0;
  }, [estimate, invoice]);

  const grandTotal = useMemo(() => {
    if (invoice && estimate) {
      return invoice.edited
        ? invoice.updateStatus === INVOICE_STATUS.update.draft
          ? invoice.draftInvoice.grandTotal
          : invoice.grandTotal
        : estimate.grandTotal; //estimate.partsTotal + estimate.laboursTotal
      // return estimate.partsTotal + estimate.laboursTotal;
    }
    return 0;
  }, [estimate, invoice]);

  const [refundAmount, setRefundable] = useState(0);
  const [balance, setDueBalance] = useState(0);

  useEffect(() => {
    const _depositAmount = invoice?.depositAmount || 0;
    const _dueBalance = grandTotal - _depositAmount;

    setDueBalance(_dueBalance);

    if (_depositAmount > grandTotal) {
      setRefundable(_depositAmount - grandTotal);
      setDueBalance(0);
    } else {
      setRefundable(0);
    }
  }, [grandTotal, invoice]);

  const generateDownload = async () => {
    // const rName = Math.ceil(Math.random() * 999 + 1100) + '.pdf';
    const rName = invoice?.code + ".pdf";
    // @ts-ignore
    const payload = {
      type: "INVOICE",
      id: invoice?.id || -1,
      rName,
    };
    setDownloading(true);

    try {
      const response = await axiosClient.post(
        `${API_ROOT}/request-pdf`,
        payload
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      setDownloading(false);
      window.open(`${settings.api.baseURL}/uploads/pdf/${rName}`);
      setSelectedValue("");
    }, 3000);
  };

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    () => {
      setErrorMessage("");
    };
  }, []);

  const handlePaymentRecord = async () => {
    setRecording(true);
    try {
      const payload = {
        invoiceId: invoice?.id || 0,
        customerId: _driver.id,
        amount: recordData.amount,
        type: recordData.type,
      };

      const response = await axiosClient.post(
        `${API_ROOT}/transactions/update-invoice-payment-manually`,
        payload
      );
      console.log(response.data);
      // @ts-ignore
      dispatch(getInvoicesAction());
      setshowMessage(true);

      setTimeout(() => {
        setshowMessage(false);
        window.history.back();
      }, 3000);
    } catch (e: any) {
      setErrorMessage(
        e.response?.data?.message || "Unable able to process please try again"
      );
      console.log(e);
    }
    setRecording(false);
    setSelectedValue("");
  };

  const calculateDiscount = ({
    total,
    discount,
    discountType,
  }: {
    total: number;
    discount: number | undefined;
    discountType: string | undefined;
  }) => {
    if (!discount) return 0;
    if (!discountType) return 0;

    if (discountType === "exact") {
      return discount;
    }

    return Math.ceil(total * (discount / 100));
  };

  const calculateTaxTotal = (estimate: IInvoice | undefined) => {
    if (!estimate) return 0;

    if (estimate.updateStatus === INVOICE_STATUS.update.draft) {
      if (estimate.draftInvoice.taxPart && estimate.draftInvoice.tax)
        return (
          parseFloat(`${estimate?.draftInvoice?.tax}`.split(",").join("")) +
          parseFloat(`${estimate?.draftInvoice?.taxPart}`.split(",").join(""))
        );

      if (estimate.draftInvoice.tax && !estimate.draftInvoice.taxPart)
        return parseFloat(`${estimate?.draftInvoice?.tax}`.split(",").join(""));

      if (!estimate.draftInvoice.tax && estimate.draftInvoice.taxPart)
        return parseFloat(
          `${estimate?.draftInvoice?.taxPart}`.split(",").join("")
        );
    }

    if (estimate.updateStatus === INVOICE_STATUS.update.sent) {
      if (estimate.taxPart && estimate.tax)
        return (
          parseFloat(`${estimate?.tax}`.split(",").join("")) +
          parseFloat(`${estimate?.taxPart}`.split(",").join(""))
        );

      if (estimate.tax && !estimate.taxPart)
        return parseFloat(`${estimate?.tax}`.split(",").join(""));

      if (!estimate.tax && estimate.taxPart)
        return parseFloat(`${estimate?.taxPart}`.split(",").join(""));
    }

    //calculating tax if updateStatus is null
    if (!estimate.updateStatus) {
      if (estimate.estimate.taxPart && estimate.estimate.tax)
        return (
          parseFloat(`${estimate?.estimate?.tax}`.split(",").join("")) +
          parseFloat(`${estimate?.estimate?.taxPart}`.split(",").join(""))
        );

      if (estimate.estimate.tax && !estimate.estimate.taxPart)
        return parseFloat(`${estimate?.estimate?.tax}`.split(",").join(""));

      if (!estimate.estimate.tax && estimate.estimate.taxPart)
        return parseFloat(`${estimate?.estimate?.taxPart}`.split(",").join(""));
    }

    return 0;
  };

  //share pdf logic --- start
  const _generateDownload = async () => {
    const rName = invoice?.code + ".pdf";
    // @ts-ignore
    const payload = {
      type: "INVOICE",
      id: invoice?.id || -1,
      rName,
    };
    _setDownloading(true);

    try {
      const response = await axiosClient.post(
        `${API_ROOT}/request-pdf`,
        payload
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      _setDownloading(false);
      setSelectedValue("");
    }, 1000);
  };
  const handleShareLink = async () => {
    _generateDownload();

    const fileUrl = `${settings.api.baseURL}/uploads/pdf/${invoice?.code}.pdf`;
    const message =
      `${
        invoice?.estimate?.partner.name
      } has sent you an invoice.\nAmount Paid: NGN${
        invoice?.depositAmount && formatNumberToIntl(invoice?.depositAmount)
      }\n\n` + fileUrl;

    try {
      const shareData = {
        title: "Invoice",
        text: `${message}`,
        // url: fileUrl
      };

      await navigator.share(shareData);

      console.log("File shared successfully");
    } catch (error: any) {
      console.error("Error sharing file:", error);
    }
  };

  const handleShareLinkNoMessage = async () => {
    _generateDownload();

    const fileUrl = `${settings.api.baseURL}/uploads/pdf/${invoice?.code}.pdf`;

    try {
      const shareData = {
        title: "Invoice",
        // text: `${message}`
        url: fileUrl,
      };

      await navigator.share(shareData);

      console.log("File shared successfully");
    } catch (error: any) {
      console.error("Error sharing file:", error);
    }
  };

  const handleSharePdf = async () => {
    _generateDownload();
    const fileUrl = `${settings.api.baseURL}/uploads/pdf/${invoice?.code}.pdf`;
    const message = `${invoice?.estimate?.partner.name} has sent you an invoice.`;

    try {
      const response = await axiosClient.get(fileUrl, { responseType: "blob" });
      const blob = response.data;
      const file = new File(
        [blob],
        `${message} - ${invoice?.code}_invoice.pdf`,
        { type: "application/pdf" }
      );

      const shareData = {
        title: "Invoice",
        text: `${message}`,
        // url: fileUrl
        files: [file],
      };

      await navigator.share(shareData);

      console.log("File shared successfully");
    } catch (error: any) {
      console.error("Error sharing file:", error);
    }
  };

  //share pdf logic --- end
  const data: any = {
    open_modal: "true",
    id: invoice?.id,
  };

  const handleChange = (event: any) => {
    const value = event.target.value as string;
    setSelectedValue(value);
    if (value === "Share unique link") {
      document.documentElement.clientWidth <= 912
        ? handleShareLink()
        : handleShareLinkNoMessage();
    }
    if (value === "Record Payment") {
      setShowRecordPayment(true);
    }
    if (value === "Record Expenses") {
      generateExpense();
    }
    if (value === "Download Pdf") {
      generateDownload();
    }
    if (value === "Share PDF") {
      handleSharePdf();
    }
    if (value === "Reminder") {
      navigate("/reminders");
      Object.entries(data).forEach(([key, value]) => {
        //@ts-ignore
        sessionStorage.setItem(key, value);
      });
    }
  };

  const handleToggleShowReport = () => {
    setShowReport(() => {
      return !showReport;
    });
  };

  useEffect(() => {
    dispatch(getExpensesAction());
  }, [dispatch]);

  const totalExpensesAmount = useMemo(() => {
    if (expenseReducer.getExpensesStatus === "completed") {
      const filteredExpenses = expenseReducer.expenses.filter(
        (expense: any) => expense.invoiceCode === invoice?.code
      );

      const amount = filteredExpenses.reduce(
        (total: any, expense: any) => total + expense.amount,
        0
      );
      return amount;
    }
  }, [
    expenseReducer.getExpensesStatus,
    expenseReducer.expenses,
    invoice?.code,
  ]);

  const expensesNumber = useMemo(() => {
    if (expenseReducer.getExpensesStatus === "completed") {
      const filteredExpenses = expenseReducer.expenses.filter(
        (expense: any) => expense.invoiceCode === invoice?.code
      );

      return filteredExpenses ? filteredExpenses.length : 0;
    }
  }, [
    expenseReducer.getExpensesStatus,
    expenseReducer.expenses,
    invoice?.code,
  ]);

  const totalTransactionAmount = useMemo(() => {
    if (invoice?.transactions) {
      let amount = 0;
      invoice?.transactions.forEach((tranx) => {
        amount += tranx.amount;
      });
      return amount;
    }
    return 0;
  }, [invoice?.transactions]);

  useEffect(() => {
    if (showRecordPayment) {
      invoice?.updateStatus === "Draft"
        ? _setDueAmt(invoice.draftInvoice.dueAmount)
        : _setDueAmt(invoice?.dueAmount);
    }
  }, [showRecordPayment]);

  if (!estimate || !invoice)
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs>
          <Alert severity="warning" variant="outlined">
            <Typography>
              You do not have any invoice. Please contact support
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    );
  else
    return (
      <React.Fragment>
        <Grid>
          <Grid>
            <ArrowBackIosNew
              onClick={() => window.history.back()}
              style={{ position: "absolute", cursor: "pointer" }}
            />
          </Grid>
        </Grid>

        <Typography
          mb={3}
          textAlign="center"
          display="block"
          variant="subtitle1"
        >
          #{invoice.code.split("_")[0]}
        </Typography>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <FormControl sx={{ m: 1, width: { sm: 300, xs: 170 } }}>
            <InputLabel id="demo-simple-select-helper-label">
              Select an action
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={selectedValue}
              label="Select an action"
              onChange={handleChange}
            >
              <MenuItem value="">...</MenuItem>
              <MenuItem
                className={classes.select}
                value={"Record Payment"}
                disabled={invoice.grandTotal === invoice.paidAmount}
              >
                Record Payment
              </MenuItem>
              <MenuItem className={classes.select} value={"Record Expenses"}>
                Record Expenses
              </MenuItem>
              <MenuItem value={"Download Pdf"} className={classes.select}>
                {downloading ? "Downloading..." : "Download Pdf"}
              </MenuItem>
              <MenuItem value={"Share unique link"} className={classes.select}>
                {_downloading ? "Sharing..." : "Share unique link"}
              </MenuItem>
              <MenuItem
                className={classes.select}
                value={"Share PDF"}
                disabled={document.documentElement.clientWidth > 912}
              >
                {_downloading ? "Sharing..." : "Share PDF"}
              </MenuItem>
              <MenuItem value={"Reminder"} className={classes.select}>
                {"Add Service Reminder"}
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        <Grid
          container
          my={3}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "left", sm: "space-between" },
            alignItems: { xs: "left", sm: "center" },
          }}
        >
          <Grid
            item
            xs
            sx={{
              mb: { xs: 2, sm: 0 },
            }}
          >
            <Grid item xs>
              <img
                alt=""
                width="20%"
                crossOrigin="anonymous"
                src={`${settings.api.baseURL}/${estimate?.partner?.logo}`}
              />
            </Grid>
            <Typography
              gutterBottom
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 600,
                mt: { xs: 2, sm: 0 },
              }}
            >
              {estimate?.partner.name}
            </Typography>
            <Stack>
              <Typography
                gutterBottom
                sx={{ fontSize: { xs: "13px", sm: "16px" } }}
              >
                {estimate?.partner?.contact.address}
              </Typography>
              <Typography
                gutterBottom
                sx={{ fontSize: { xs: "13px", sm: "16px" } }}
              >
                {estimate?.partner?.contact?.district}{" "}
                {estimate?.partner?.contact?.state}
              </Typography>
              <Typography
                gutterBottom
                sx={{ fontSize: { xs: "13px", sm: "16px" } }}
              >
                {estimate?.partner.phone}
              </Typography>
              <Typography
                gutterBottom
                sx={{ fontSize: { xs: "13px", sm: "16px" } }}
              >
                {estimate?.partner.email}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs>
            <Typography
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: { xs: "14px", sm: "16px" },
                textAlign: { sm: "right", xs: "left" },
              }}
            >
              Billing Information
            </Typography>
            <Stack>
              <Typography
                variant="body1"
                gutterBottom={
                  document.documentElement.clientWidth <= 375 ? false : true
                }
                sx={{
                  fontSize: { xs: "13px", sm: "16px" },
                  textAlign: { sm: "right", xs: "left" },
                }}
              >
                {owner}
              </Typography>
              {billingInformation ? (
                <Typography
                  variant="body1"
                  gutterBottom={
                    document.documentElement.clientWidth <= 375 ? false : true
                  }
                  sx={{
                    textAlign: { sm: "right", xs: "left" },
                  }}
                >
                  <Typography
                    variant="body2"
                    gutterBottom={
                      document.documentElement.clientWidth <= 375 ? false : true
                    }
                  >
                    {billingInformation.address} {billingInformation.district}{" "}
                    {billingInformation.state}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom={
                      document.documentElement.clientWidth <= 375 ? false : true
                    }
                  >
                    {billingInformation.phone}
                  </Typography>
                </Typography>
              ) : (
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "13px", sm: "16px" },
                    textAlign: { sm: "right", xs: "left" },
                  }}
                >
                  <p>{_driver?.email || ""}</p>
                  <p>{_driver?.phone || ""}</p>
                  {estimate.address}
                  <p>{moment(estimate.createdAt).format("YYYY-MM-DD")}</p>
                </Typography>
              )}
            </Stack>
          </Grid>
          {/* <Grid item>
            <img
              alt=""
              width="20%"
              crossOrigin="anonymous"
              src={`${settings.api.baseURL}/${estimate?.partner?.logo}`}
            />
          </Grid>
          <Grid item>
            <Typography gutterBottom
              sx={{fontSize: {xs: '14px', sm: '16px'}, fontWeight: 600, mt: {xs: 2, sm: 0}}}
            >
              {estimate?.partner.name}
            </Typography>
            <Stack>
              <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                {estimate?.partner?.contact.address}
              </Typography>
              <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                {estimate?.partner?.contact?.district} {estimate?.partner?.contact?.state}
              </Typography>
              <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                {estimate?.partner.phone}
              </Typography>
              <Typography gutterBottom sx={{fontSize: {xs: '13px', sm: '16px'}}}>
                {estimate?.partner.email}
              </Typography>
            </Stack>
          </Grid> */}
        </Grid>

        <Grid container mb={2}>
          <Grid item xs>
            <Divider orientation="horizontal" flexItem />
          </Grid>
        </Grid>

        {isTechAdmin && (
          <Grid
            container
            sx={{
              display: "flex",
              mb: 2,
              justifyContent: "right",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box
              onClick={() => handleToggleShowReport()}
              sx={{
                cursor: "pointer",
                "&:hover": { color: "grey" },
                color: showReport ? "#747bff" : "black",
                width: "100%",
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 16, textShadow: 5 }}>
                {showReport ? "Hide report" : "Show report"}
              </Typography>
              {showReport ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </Box>
            <Collapse
              in={showReport}
              timeout={{ enter: 800, exit: 500 }}
              sx={{ width: "100%", mt: 1 }}
            >
              <Paper
                elevation={3}
                sx={{
                  backgroundColor: "white",
                  width: "100%",
                  p: 4,
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  flexDirection: "column",
                }}
              >
                {/* <Box sx={{backgroundColor: 'yellow', width: '90%', height: '100%'}}> */}
                <Grid container>
                  <Grid item md={4} xs={12}>
                    <Typography sx={{ fontSize: 15, color: "#7F7F7F" }}>
                      Total Sales:&nbsp;&nbsp;
                      <span style={{ fontSize: 16, color: "black" }}>
                        &#x20A6;{formatNumberToIntl(grandTotal)}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Typography sx={{ fontSize: 15, color: "#7F7F7F" }}>
                      Total Amount Paid:&nbsp;&nbsp;
                      <span style={{ fontSize: 16, color: "black" }}>
                        &#x20A6;{formatNumberToIntl(totalTransactionAmount)}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Typography sx={{ fontSize: 15, color: "#7F7F7F" }}>
                      Total Expenses:&nbsp;&nbsp;
                      <span style={{ fontSize: 16, color: "black" }}>
                        &#x20A6;
                        {totalExpensesAmount
                          ? formatNumberToIntl(totalExpensesAmount)
                          : 0.0}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>

                <Grid
                  container
                  sx={{
                    borderBottom: "2px #CCCCCC solid",
                    pb: 5,
                    borderHeight: "2rem",
                  }}
                >
                  <Grid item md={4} xs={12}>
                    <Typography sx={{ fontSize: 15, color: "#7F7F7F" }}>
                      Payments recorded:&nbsp;&nbsp;
                      <span style={{ fontSize: 16, color: "black" }}>
                        {invoice.transactions.length}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item md={4} xs={12} flexDirection="row">
                    <Typography sx={{ fontSize: 15, color: "#7F7F7F" }}>
                      Expenses recorded:&nbsp;&nbsp;
                      <span style={{ fontSize: 16, color: "black" }}>
                        {expensesNumber}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Typography sx={{ fontSize: 15, color: "#7F7F7F" }}>
                      Total Receivable:&nbsp;&nbsp;
                      <span style={{ fontSize: 16, color: "black" }}>
                        &#x20A6;
                        {formatNumberToIntl(
                          grandTotal - totalTransactionAmount
                        )}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container pt={-2}>
                  <Grid item md={4} xs={12}>
                    <Typography sx={{ fontSize: 15, color: "#7F7F7F" }}>
                      Book Profit:&nbsp;&nbsp;
                      <span style={{ fontSize: 16, color: "black" }}>
                        &#x20A6;
                        {formatNumberToIntl(
                          grandTotal -
                            (totalExpensesAmount ? totalExpensesAmount : 0)
                        )}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid md={4} />
                  <Grid item md={4} xs={12}>
                    <Typography sx={{ fontSize: 15, color: "#7F7F7F" }}>
                      Profit/Loss:&nbsp;&nbsp;
                      <span
                        style={{
                          fontSize: 16,
                          color:
                            Math.sign(
                              totalTransactionAmount -
                                (totalExpensesAmount && totalExpensesAmount)
                            ) === -1
                              ? "red"
                              : "black",
                          fontWeight: "bold",
                        }}
                      >
                        &#x20A6;{" "}
                        {formatNumberToIntl(
                          totalTransactionAmount -
                            (totalExpensesAmount ? totalExpensesAmount : 0.0)
                        )}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
                {/* </Box> */}
              </Paper>
            </Collapse>
          </Grid>
        )}

        <Grid container>
          <Grid item xs>
            <Divider orientation="horizontal" flexItem />
          </Grid>
        </Grid>
        <Grid container my={3}>
          <Grid item xs>
            <Typography
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: { xs: "13px", sm: "16px" },
                mr: { xs: 2, sm: 0 },
              }}
            >
              Vehicle
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "13px", sm: "16px" },
                mr: { xs: 2, sm: 0 },
              }}
            >
              {estimate?.vehicle.modelYear} {estimate?.vehicle.make}{" "}
              {estimate?.vehicle.model}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography
              gutterBottom
              sx={{ fontWeight: 600, fontSize: { xs: "13px", sm: "16px" } }}
            >
              Reg. No
            </Typography>
            <Typography sx={{ fontSize: { xs: "13px", sm: "16px" } }}>
              {estimate?.vehicle.plateNumber}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: { xs: "13px", sm: "16px" },
                mr: { xs: 2, sm: 0 },
              }}
            >
              Mileage
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "13px", sm: "16px" },
                mr: { xs: 2, sm: 0 },
              }}
            >
              {estimate?.vehicle.mileageValue} {estimate?.vehicle.mileageUnit}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography
              gutterBottom
              sx={{ fontWeight: 600, fontSize: { xs: "13px", sm: "16px" } }}
            >
              VIN
            </Typography>
            <Typography
              sx={{
                width: "100%",
                wordBreak: "break-all",
                fontSize: { xs: "13px", sm: "16px" },
              }}
            >
              {estimate?.vehicle.vin}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs>
            <Divider orientation="horizontal" flexItem />
          </Grid>
        </Grid>

        <Grid
          container
          my={3}
          sx={{ pb: 1.5 }}
          borderBottom="3px solid"
          borderColor={(theme) =>
            theme.palette.mode === "dark" ? "#676767" : "#000000"
          }
          justifyContent="center"
          alignItems="center"
          columns={14}
          item
        >
          <Grid item xs={1} sx={{ display: { xs: "none", sm: "block" } }}>
            <Avatar src={InsightImg} sx={{ width: 20, height: 20 }} />
          </Grid>
          <Grid
            item
            xs={5}
            sm={3}
            alignItems="left"
            sx={{
              width: "100%",
              wordBreak: "break-word",
              fontWeight: 600,
              fontSize: { xs: "13px", sm: "16px" },
            }}
          >
            {document.documentElement.clientWidth <= 375
              ? "Item Desc"
              : "Item Description"}
          </Grid>
          <Grid
            item
            xs={4}
            sm={3}
            sx={{
              fontWeight: 600,
              textAlign: { md: "center", lg: "left", sm: "center" },
              fontSize: { xs: "13px", sm: "16px" },
              display: { xs: "none", sm: "block" },
            }}
          >
            Warranty
          </Grid>
          <Grid
            item
            xs={4}
            sm={3}
            sx={{
              wordBreak: "break-word",
              fontWeight: 600,
              fontSize: { xs: "13px", sm: "16px" },
            }}
          >
            Unit Cost x Qty
          </Grid>
          <Grid
            item
            xs={5}
            sm={4}
            sx={{
              textAlign: { xs: "right" },
              fontWeight: 600,
              fontSize: { xs: "13px", sm: "16px" },
            }}
          >
            Amount
          </Grid>
        </Grid>
        <Grid container item>
          {!parts.length
            ? null
            : parts.map((part, idx1) => {
                const amount = formatNumberToIntl(+part.amount);

                return (
                  <Grid
                    key={idx1}
                    item
                    container
                    justifyContent="center"
                    alignItems="center"
                    columns={14}
                    sx={{ pb: 2.5 }}
                    borderBottom="0.01px solid"
                    borderColor="#676767"
                  >
                    <Grid
                      item
                      xs={1}
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                    <Grid
                      item
                      xs={5}
                      sm={3}
                      sx={{
                        fontSize: { xs: "13px", sm: "16px" },
                        wordBreak: "break-word",
                        width: "100%",
                      }}
                    >
                      {part && part.name}
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      sx={{
                        fontSize: { xs: "13px", sm: "16px" },
                        textAlign: "center",
                        display: { xs: "none", md: "block" },
                      }}
                    >
                      {part?.warranty?.warranty} {part?.warranty?.interval}
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      sm={3}
                      sx={{
                        textAlign: { xs: "left" },
                        fontSize: { xs: "13px", sm: "16px" },
                      }}
                    >
                      {formatNumberToIntl(+part.price)} x{" "}
                      {part?.quantity?.quantity || ""}{" "}
                      {part?.quantity?.unit || 0}
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{
                        textAlign: { xs: "right" },
                        fontSize: { xs: "13px", sm: "16px" },
                      }}
                    >
                      {amount}
                    </Grid>
                  </Grid>
                );
              })}
          {!labours.length
            ? null
            : labours.map((labour, idx1) => {
                return (
                  <Grid
                    key={idx1}
                    item
                    container
                    justifyContent="center"
                    alignItems="center"
                    columns={14}
                    sx={{ pb: 2.5 }}
                    borderBottom="0.01px solid"
                    borderColor="#676767"
                  >
                    <Grid
                      item
                      xs={1}
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                    <Grid
                      item
                      xs={5}
                      sm={3}
                      sx={{ fontSize: { xs: "13px", sm: "16px" } }}
                    >
                      {labour?.title}
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      sx={{
                        fontSize: { xs: "13px", sm: "16px" },
                        textAlign: "center",
                        display: { xs: "none", md: "block" },
                      }}
                    >
                      -
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      sm={3}
                      sx={{
                        textAlign: { xs: "left" },
                        fontSize: { xs: "13px", sm: "16px" },
                      }}
                    >
                      {formatNumberToIntl(+labour.cost)} x 1
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{
                        textAlign: { xs: "right" },
                        fontSize: { xs: "13px", sm: "16px" },
                      }}
                    >
                      {formatNumberToIntl(+labour.cost)}
                    </Grid>
                  </Grid>
                );
              })}
        </Grid>
        <Grid
          item
          xs={12}
          my={3}
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Grid item xs>
            <TextField
              value={estimate?.note}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              // fullWidth
              multiline
              rows={4}
              name="note"
              label="Note/Remarks"
              sx={{
                width: "50%",
              }}
            />
            <br /> <br />
            <TextField
              value={estimate?.internalNote}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              // fullWidth
              multiline
              rows={4}
              name="internalNote"
              label="Internal Note"
              sx={{
                width: "50%",
              }}
            />
          </Grid>
          <Grid item xs>
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              my={3}
            >
              <Grid item xs={10} />
              <Grid
                item
                flexGrow={1}
                sx={{ pb: 2.5 }}
                textAlign="right"
                borderBottom="0.01px solid"
                borderColor="#676767"
              >
                <Typography
                  gutterBottom
                  sx={{ fontSize: { xs: "13px", sm: "16px" }, fontWeight: 600 }}
                >
                  Subtotal: {formatNumberToIntl(subTotal)}
                </Typography>
                {/* @ts-ignore */}
                <Typography
                  gutterBottom
                  sx={{ fontSize: { xs: "13px", sm: "16px" }, fontWeight: 600 }}
                >
                  VAT(7.5%):{" "}
                  {
                    // @ts-ignore
                    formatNumberToIntl(calculateTaxTotal(invoice))
                  }
                </Typography>
                <Typography
                  gutterBottom
                  sx={{ fontSize: { xs: "13px", sm: "16px" }, fontWeight: 600 }}
                >
                  Discount:{" "}
                  {
                    // @ts-ignore
                    `(${formatNumberToIntl(
                      calculateDiscount({
                        total: !invoice.updateStatus
                          ? estimate.laboursTotal + estimate.partsTotal
                          : subTotal, //grandTotal
                        discount: invoice.edited
                          ? invoice.updateStatus === INVOICE_STATUS.update.draft
                            ? invoice.draftInvoice.discount
                            : invoice.discount
                          : estimate.discount,
                        discountType: invoice.edited
                          ? invoice.updateStatus === INVOICE_STATUS.update.draft
                            ? invoice.draftInvoice.discountType
                            : invoice.discountType
                          : estimate.discountType,
                      })
                    )})`
                  }
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" my={3}>
          <Grid item xs={10} />
          <Grid
            item
            flexGrow={1}
            sx={{ pb: 2.5 }}
            textAlign="right"
            borderBottom="0.01px solid"
            borderColor="#676767"
          >
            <Typography
              gutterBottom
              sx={{ fontSize: { xs: "13px", sm: "16px" }, fontWeight: 600 }}
            >
              TOTAL: {formatNumberToIntl(grandTotal)}
              {/* {formatNumberToIntl(
                  calculateDiscount({
                    total: grandTotal,
                    discount: invoice.discount,
                    discountType: invoice.discountType,
                  }) -
                  calculateTaxTotal(invoice),
                )} */}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          mt={1}
          mb={2}
        >
          <Grid item xs={10} />
          <Grid item flexGrow={1} sx={{ pb: 2.5 }} textAlign="right">
            <Typography
              gutterBottom
              fontStyle="italic"
              color={(theme) =>
                theme.palette.mode === "dark" ? "#ededed" : "#263238"
              }
            >
              Job Duration: {invoice.jobDurationValue} {invoice.jobDurationUnit}
              (s)
            </Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          xs={12}
        >
          <Grid item xs={8} />
          <Grid item flexGrow={1} xs>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "#ededed" : "#263238",
              }}
            >
              <Typography
                sx={{ fontSize: { xs: "13px", sm: "16px" }, fontWeight: 600 }}
              >
                Paid
              </Typography>
              <Typography sx={{ ml: 7 }} />
              <Typography
                sx={{ fontSize: { xs: "13px", sm: "16px" }, fontWeight: 600 }}
              >
                ₦{formatNumberToIntl(invoice.depositAmount)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center">
          <Grid item xs={8} />
          <Grid item flexGrow={1} xs>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "#ededed" : "#263238",
              }}
            >
              <Typography
                sx={{ fontSize: { xs: "13px", sm: "16px" }, fontWeight: 600 }}
              >
                Balance Due:
              </Typography>
              <Typography sx={{ mr: 7 }} />
              <Typography
                sx={{ fontSize: { xs: "13px", sm: "16px" }, fontWeight: 600 }}
              >
                {/* ₦{Math.sign(invoice.dueAmount) === -1 ? '0.00' : formatNumberToIntl(invoice.dueAmount)} */}
                ₦
                {Math.sign(balance) === -1
                  ? "0.00"
                  : formatNumberToIntl(balance)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center">
          <Grid item xs={8} />
          <Grid item flexGrow={1} xs>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "#ededed" : "#263238",
              }}
            >
              <Typography
                sx={{ fontSize: { xs: "13px", sm: "16px" }, fontWeight: 600 }}
              >
                Refund Due:
              </Typography>
              <Typography sx={{ mr: 7 }} />
              {/* <Typography>₦{formatNumberToIntl(invoice.refundable)}</Typography> */}
              <Typography
                sx={{ fontSize: { xs: "13px", sm: "16px" }, fontWeight: 600 }}
              >
                ₦{formatNumberToIntl(refundAmount)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <AppModal
          show={showRecordPayment}
          onClose={() => {
            setShowRecordPayment(false), setSelectedValue("");
          }}
          title="Record Payment"
          size="md"
          ActionComponent={
            <Button onClick={() => handlePaymentRecord()}>
              {recording ? "Recording" : "Record"}
            </Button>
          }
          // fullWidth
          Content={
            <Box sx={{ width: { sm: 300, xs: 250 } }}>
              <Input
                value={recordData.amount}
                type="numeric"
                fullWidth
                placeholder={
                  "Amount to Record Max: " + formatNumberToIntl(_dueAmt)
                }
                onChange={(e) => {
                  // process entry
                  if (parseInt(e.target.value) > invoice.dueAmount) {
                    alert(
                      "Recording above due amount, a refund might be considered"
                    );
                  } else {
                    setRecordData({ ...recordData, amount: e.target.value });
                  }
                }}
              />
              <br />
              &nbsp;
              <br />
              <Typography>Select Method</Typography>
              <br />
              <Select
                onChange={(e) =>
                  setRecordData({ ...recordData, type: e.target.value })
                }
                value={recordData.type}
                native
                fullWidth
                placeholder="Select Payment Mode"
              >
                <option value={"Cash"}>Cash</option>
                <option value={"Transfer"}>Transfer</option>
                <option value={"Check"}>Check</option>
                <option value={"POS"}>POS</option>
              </Select>
              <br />
            </Box>
          }
        />

        <AppAlert
          alertType="success"
          show={showMessage}
          message={"record recieved, re-open invoice to see changes"}
          onClose={() => setshowMessage(false)}
        />
        <AppAlert
          alertType="error"
          show={errorMessage !== ""}
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      </React.Fragment>
    );
}

export default InvoicePage;
