import React, {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  Chip,
  DialogActions,
  DialogContentText,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { IAppointment } from "@app-models";

import car1 from "../../assets/images/vehicle/car1.jpg";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import generatePageNumbers, { formatNumberToIntl } from "../../utils/generic";
import { Assignment, Delete, Download, UploadFile } from "@mui/icons-material";

import pdfImg from "../../assets/images/pdf4.jpg";
import styles from "./appointmentPage.module.css";
import {
  cancelInspectionAction,
  getAppointmentAction,
  IAppointmentUpdate,
  updateAppointmentAction,
} from "../../store/actions/appointmentActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import settings from "../../config/settings";
import axiosClient from "../../config/axiosClient";
import useAppSelector from "../../hooks/useAppSelector";
import AppModal from "../../components/modal/AppModal";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { AppContext } from "../../context/AppContextProvider";
import { AppContextProperties } from "@app-interfaces";
import {
  APPOINTMENT_STATUS,
  ESTIMATE,
  INVENTORY,
  REPORT,
} from "../../config/constants";
import BookingModal from "../../components/modal/BookingModal";
import BookingForm from "../../components/forms/booking/BookingForm";
import useTimeslot from "../../hooks/useTimeslot";

interface IImageListProps {
  img: string;
  title: string;
  showDeleteIcon?: boolean;
}

function AppointmentPage() {
  const [appointment, setAppointment] = useState<IAppointment | null>();
  const [imageList, setImageList] = useState<IImageListProps[]>([]);
  const [inventoryFile, setInventoryFile] = useState<File>();
  const [reportFile, setReportFile] = useState<File>();
  const [estimateFile, setEstimateFile] = useState<File>();
  const [$status, $setStatus] = useState<string>("");
  const [viewFile, setViewFile] = useState<boolean>(false);
  const [viewImage, setViewImage] = useState<boolean>(false);
  const [pdfFile, setPdfFile] = useState<any>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [pdfFilename, setPdfFilename] = useState<string>("");
  const [_timeout, _setTimeout] = useState<any>();
  const [cancel, setCancel] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const inventoryRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLInputElement>(null);
  const estimateRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const urlParams = useParams();
  useTimeslot();

  const { showBooking, setShowBooking } = useContext(
    AppContext
  ) as AppContextProperties;

  const appointmentReducer = useAppSelector(
    (state) => state.appointmentReducer
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    //@ts-ignore
    dispatch(getAppointmentAction(+urlParams.id));
  }, [location.state, dispatch, urlParams.id]);

  useEffect(() => {
    if (appointmentReducer.getAppointmentStatus === "completed") {
      setAppointment(appointmentReducer.appointment);
    }
  }, [appointmentReducer.getAppointmentStatus, appointmentReducer.appointment]);

  useEffect(() => {
    if (appointmentReducer.updateAppointmentStatus === "completed") {
      setImageList([]);

      setAppointment(appointmentReducer.appointment);
    }
  }, [
    appointmentReducer.appointment,
    appointmentReducer.updateAppointmentStatus,
  ]);

  const downloadFile = async (
    evt: MouseEvent<HTMLButtonElement>,
    url: string
  ) => {
    evt.preventDefault();

    url = `${settings.api.baseURL}/${url}`;
    const filename = url.split("/docs/")[1].trim();

    const response = await axiosClient({
      url,
      method: "GET",
      responseType: "blob",
    });

    const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  };

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files?.length) return;

    const name = e.target.name;
    const file = files[0];

    const tempImageList = [...imageList];

    if (tempImageList.length) {
      const img = tempImageList.find((value) => value.title === name);

      if (img) {
        const index = tempImageList.indexOf(img);

        tempImageList[index].img = pdfImg;

        setImageList(tempImageList);
      } else
        setImageList((prevState) => [
          ...prevState,
          { img: pdfImg, title: file.name, showDeleteIcon: true },
        ]);
    } else
      setImageList([{ img: pdfImg, title: file.name, showDeleteIcon: true }]);

    if (name === INVENTORY) setInventoryFile(file);
    if (name === REPORT) setReportFile(file);
    if (name === ESTIMATE) setEstimateFile(file);
  };

  const handleResetImage = (title?: string) => {
    if (inventoryRef.current) {
      inventoryRef.current.value = "";
    }

    if (reportRef.current) {
      reportRef.current.value = "";
    }

    if (estimateRef.current) {
      estimateRef.current.value = "";
    }

    const tempImageList = [...imageList];
    let img;

    if (title) {
      img = tempImageList.find((value) => value.title === title);
      if (img) {
        const index = tempImageList.indexOf(img);
        tempImageList.splice(index, 1);
      }
      setImageList(tempImageList);
    }
  };

  const handleUpdate = () => {
    const data: Partial<IAppointmentUpdate> = {};

    if (appointment) {
      data.appointmentId = appointment.id;

      if (inventoryFile) data.inventory = inventoryFile;
      if (reportFile) data.report = reportFile;
      if (estimateFile) data.estimate = estimateFile;
      if ($status.length) data.status = $status;
    }

    //@ts-ignore
    dispatch(updateAppointmentAction(data));
  };

  const handleViewFile = () => {
    if (inventoryFile) {
      setPdfFilename(inventoryFile.name);
      setPdfFile(inventoryFile);
    }
    if (reportFile) {
      setPdfFilename(reportFile.name);
      setPdfFile(reportFile);
    }
    if (estimateFile) {
      setPdfFilename(estimateFile.name);
      setPdfFile(estimateFile);
    }

    _setTimeout(
      setTimeout(() => {
        setViewFile(true);
      }, 100)
    );
  };

  const handleCloseViewFile = () => {
    clearTimeout(_timeout);
    setViewFile(false);
  };

  const handleViewImage = (imageUrl: string) => {
    imageUrl = `${settings.api.customerBaseURL}/${imageUrl}`;

    setImageUrl(imageUrl);
    setViewImage(true);
  };

  const handleShowCancel = () => {
    setMessage(`By cancelling this appointments, you will not be able to undo this action. 
      Are you sure you want to cancel?.`);
    setCancel(true);
  };

  const handleHideCancel = () => setCancel(false);

  const handleConfirmCancel = () => {
    const data = { id: appointment?.id, customerId: appointment?.customerId };

    //@ts-ignore
    dispatch(cancelInspectionAction(data));
    setCancel(false);
  };

  const handleReschedule = () => {
    if (!showBooking) setShowBooking(true);
  };

  return (
    <React.Fragment>
      <Box>
        <Grid container justifyContent="space-between" marginBottom={2}>
          <Grid item>
            <div>
              <span className={styles.title}>Appointment</span> -{" "}
              <span className={styles.subtitle}>
                {appointment?.customer.firstName}{" "}
                {appointment?.customer.lastName} | {appointment?.customer.email}{" "}
                | {appointment?.customer.phone}
              </span>
            </div>
          </Grid>
          <Grid item>
            {imageList.length ||
            ($status.length && $status !== appointment?.status) ? (
              <Button onClick={handleUpdate} variant="outlined">
                Update
              </Button>
            ) : null}
          </Grid>
        </Grid>
        <Box sx={{ flexGrow: 1 }}>
          {!appointment ? (
            <Skeleton variant="rectangular">
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              />
            </Skeleton>
          ) : (
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={5}
                  sx={{
                    p: 2,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#1A2027" : "#fff",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item>
                      <ButtonBase>
                        <Img alt="complex" src={car1} />
                      </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography
                            gutterBottom
                            variant="subtitle1"
                            component="div"
                          >
                            {appointment.vehicle?.modelYear}{" "}
                            {appointment.vehicle?.model} (
                            {appointment.vehicle?.plateNumber})
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" component="div">
                          {appointment.vehicle?.isBooked && (
                            <Chip size="small" label="Booked" color="success" />
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} md={8}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 2, md: 2 }}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Item elevation={5}>
                    <Typography>Programme</Typography>
                    <Typography variant="caption">
                      {appointment.programme}
                    </Typography>
                  </Item>
                  <Item elevation={5}>
                    <Typography>Service Mode</Typography>
                    <Typography variant="caption">
                      {appointment.modeOfService}
                    </Typography>
                  </Item>
                  <Item elevation={5}>
                    <Typography>Status</Typography>
                    <Typography variant="caption">
                      {$status.length ? $status : appointment.status}
                    </Typography>
                  </Item>
                  <Item elevation={5}>
                    <Typography>Service Cost</Typography>
                    <Typography variant="caption">
                      ₦{formatNumberToIntl(+appointment.serviceCost)}
                    </Typography>
                  </Item>
                </Stack>
                <Box sx={{ my: { xs: 1, sm: 2, md: 2 } }} />
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 2, md: 2 }}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Item elevation={5}>
                    <Typography>Date & Time</Typography>
                    <Typography variant="caption">
                      {moment(appointment.appointmentDate).format("LLL")}
                      <br />
                      {appointment.timeSlot}
                    </Typography>
                  </Item>
                  <Item elevation={5}>
                    <Typography>Service Location</Typography>
                    <Typography variant="caption">
                      {appointment.serviceLocation}
                    </Typography>
                  </Item>
                  <Item elevation={5}>
                    <Grid container>
                      {appointment.vehicleFault.imagePath && (
                        <Grid item xs={4}>
                          <Avatar
                            onClick={() =>
                              handleViewImage(
                                appointment.vehicleFault.imagePath
                              )
                            }
                            sx={{ cursor: "pointer" }}
                            variant="square"
                            src={appointment.vehicleFault.imagePath}
                          >
                            <Assignment />
                          </Avatar>
                        </Grid>
                      )}
                      <Grid item xs>
                        <Typography>Complaint</Typography>
                        <Typography variant="caption">
                          {appointment.vehicleFault.description}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Item>
                </Stack>
                <Divider
                  orientation="horizontal"
                  sx={{ my: { xs: 2, sm: 4, md: 6 } }}
                />
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs>
                    <Button
                      disabled={
                        appointment.status === APPOINTMENT_STATUS.cancel ||
                        appointment.status === APPOINTMENT_STATUS.complete
                      }
                      onClick={handleReschedule}
                      size="small"
                      variant="outlined"
                      color="info"
                    >
                      Reschedule
                    </Button>
                    <Button
                      disabled={
                        appointment.status === APPOINTMENT_STATUS.cancel ||
                        appointment.status === APPOINTMENT_STATUS.complete
                      }
                      onClick={handleShowCancel}
                      size="small"
                      sx={{ ml: 1 }}
                      variant="outlined"
                      color="error"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid
                    item
                    container
                    xs
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs>
                      <Stack direction="row" spacing={1}>
                        <FormControl
                          size="small"
                          sx={{ maxWidth: 100, width: "100%" }}
                        >
                          <InputLabel id="demo-select-small">Status</InputLabel>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={$status}
                            label="Status"
                            onChange={(e) => $setStatus(e.target.value)}
                          >
                            <MenuItem value="">
                              <em>...</em>
                            </MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="In-Progress">In-Progress</MenuItem>
                            <MenuItem value="Complete">Complete</MenuItem>
                          </Select>
                        </FormControl>
                        {appointment.inventoryFile ? (
                          <Button
                            variant="outlined"
                            onClick={(evt) =>
                              downloadFile(evt, appointment?.inventoryFile)
                            }
                            startIcon={<Download />}
                          >
                            {INVENTORY}
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            startIcon={<UploadFile />}
                            component="label"
                          >
                            {INVENTORY}
                            <input
                              hidden
                              onClick={() => handleResetImage()}
                              onChange={handleUploadFile}
                              name={INVENTORY}
                              //@ts-ignore
                              ref={inventoryRef}
                              accept="application/pdf"
                              type="file"
                            />
                          </Button>
                        )}
                        {appointment.reportFile ? (
                          <Button
                            variant="outlined"
                            onClick={(evt) =>
                              downloadFile(evt, appointment?.reportFile)
                            }
                            startIcon={<Download />}
                          >
                            {REPORT}
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            startIcon={<UploadFile />}
                            component="label"
                          >
                            {REPORT}
                            <input
                              name={REPORT}
                              onClick={() => handleResetImage()}
                              onChange={handleUploadFile}
                              //@ts-ignore
                              ref={reportRef}
                              hidden
                              accept="application/pdf"
                              type="file"
                            />
                          </Button>
                        )}
                        {appointment.estimateFile ? (
                          <Button
                            variant="outlined"
                            onClick={(evt) =>
                              downloadFile(evt, appointment?.estimateFile)
                            }
                            startIcon={<Download />}
                          >
                            {ESTIMATE}
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            startIcon={<UploadFile />}
                            component="label"
                          >
                            {ESTIMATE}
                            <input
                              name={ESTIMATE}
                              onClick={() => handleResetImage()}
                              onChange={handleUploadFile}
                              //@ts-ignore
                              ref={estimateRef}
                              hidden
                              accept="application/pdf"
                              type="file"
                            />
                          </Button>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs />
                  <Grid item xs>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: { xs: 2, md: 3 } }}
                    >
                      {imageList.length > 0 ? (
                        <React.Fragment>
                          {imageList.map((item, index) => (
                            <Card
                              key={index}
                              sx={{
                                minWidth: 150,
                                maxHeight: 250,
                              }}
                            >
                              <CardActionArea>
                                <CardMedia
                                  onClick={handleViewFile}
                                  component="img"
                                  height="140"
                                  image={item.img}
                                  alt="green iguana"
                                />
                              </CardActionArea>
                              <CardActions>
                                {item.showDeleteIcon && (
                                  <IconButton
                                    onClick={() => handleResetImage(item.title)}
                                    sx={{ color: "red" }}
                                    aria-label={`info about ${item.title}`}
                                  >
                                    <Delete />
                                  </IconButton>
                                )}
                              </CardActions>
                            </Card>
                          ))}
                        </React.Fragment>
                      ) : null}
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
      <AppModal
        show={viewFile}
        title={pdfFilename}
        size="md"
        Content={
          <Document file={pdfFile}>
            {generatePageNumbers(10).map((value, index) => (
              <Page key={index} pageNumber={value} />
            ))}
          </Document>
        }
        onClose={handleCloseViewFile}
      />
      <AppModal
        show={viewImage}
        title="Complaint"
        size="sm"
        Content={<img width="100%" src={imageUrl} alt="complaint" />}
        onClose={() => setViewImage(false)}
      />
      <AppModal
        show={cancel}
        title="Cancel Appointment"
        size="sm"
        Content={<DialogContentText>{message}</DialogContentText>}
        onClose={handleHideCancel}
        ActionComponent={
          <DialogActions>
            <Button onClick={handleHideCancel}>Disagree</Button>
            <Button onClick={handleConfirmCancel}>Agree</Button>
          </DialogActions>
        }
      />
      <BookingModal
        fullScreen
        open={showBooking}
        Content={<BookingForm appointment={appointment} />}
        onClose={() => setShowBooking(false)}
      />
    </React.Fragment>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 80,
  width: 250,
  flexGrow: 1,
}));

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
  borderRadius: 10,
});

export default AppointmentPage;
