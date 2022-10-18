import React, { useEffect, useRef, useState } from "react";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import {
  approveJobCheckListAction,
  getJobAction,
} from "../../store/actions/jobActions";
import { IJob } from "@app-models";
import { useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import settings from "../../config/settings";
import {
  CheckListAnswerType,
  CheckListQuestionType,
  CheckListSectionType,
  CustomHookMessage,
} from "@app-types";
import checkListVectorImg from "../../assets/images/check-list-vector.png";
import { AccessTime, LocationOn, Print, Today } from "@mui/icons-material";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import useAdmin from "../../hooks/useAdmin";
import AppLoader from "../../components/loader/AppLoader";
import AppAlert from "../../components/alerts/AppAlert";
import { clearApproveJobCheckListStatus } from "../../store/reducers/jobReducer";

interface ILocationState {
  job: IJob;
}

const computeScore = (sections: CheckListSectionType[]) => {
  let totalScore = 0;
  const _answers: CheckListAnswerType[] = [];
  for (const section of sections) {
    const questions = section.questions;

    for (const question of questions) {
      const answers = question.answers;
      for (const answer of answers) {
        totalScore += +answer.weight;
        _answers.push(answer);
      }
    }
  }

  return (totalScore * 100) / _answers.length;
};

const getQuestionAnswer = (question: CheckListQuestionType) => {
  const answerTypes = question.answers.filter((value) => value.selected);

  return { color: answerTypes[0].color, answer: answerTypes[0].answer };
};

function JobCheckListReportPage() {
  const [job, setJob] = useState<IJob | null>(null);
  const [approved, setApproved] = useState<boolean>(false);
  const [error, setError] = useState<CustomHookMessage>();
  const [success, setSuccess] = useState<CustomHookMessage>();

  const jobReducer = useAppSelector((state) => state.jobReducer);
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { isSuperAdmin, isTechAdmin } = useAdmin();

  useEffect(() => {
    if (jobReducer.getJobStatus === "idle") {
      if (location.state) {
        const state = location.state as ILocationState;

        const jobId = state.job.id;
        dispatch(getJobAction(jobId));
      }
    }
  }, [dispatch, jobReducer.getJobStatus, location.state]);

  useEffect(() => {
    if (jobReducer.getJobStatus === "completed") {
      const _job = jobReducer.job;
      if (_job) {
        setJob(_job);

        if (_job.checkList) {
          const _checkList = _job.checkList;

          setApproved(_checkList.approvedByGarageAdmin as boolean);
        }
      }
    }
  }, [dispatch, jobReducer.getJobStatus, jobReducer.job]);

  useEffect(() => {
    if (jobReducer.approveJobCheckListStatus === "completed") {
      setSuccess({ message: jobReducer.approveJobCheckListSuccess });
    }
  }, [
    jobReducer.approveJobCheckListStatus,
    jobReducer.approveJobCheckListSuccess,
  ]);

  useEffect(() => {
    if (jobReducer.approveJobCheckListStatus === "failed") {
      if (jobReducer.approveJobCheckListError)
        setError({ message: jobReducer.approveJobCheckListError });
    }
  }, [
    jobReducer.approveJobCheckListStatus,
    jobReducer.approveJobCheckListError,
  ]);

  useEffect(() => {
    return () => {
      dispatch(clearApproveJobCheckListStatus());
    };
  }, [dispatch]);

  const handlePrint = useReactToPrint({
    content: () => containerRef.current,
  });

  const handleApproveReport = (jobId: number, approved: boolean) => {
    setApproved(approved);
    dispatch(approveJobCheckListAction({ jobId, approved }));
  };

  return (
    <React.Fragment>
      {!job ? null : (
        <React.Fragment>
          <Grid
            container
            mb={1}
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item hidden={!isSuperAdmin}>
              <Button
                onClick={handlePrint}
                variant="outlined"
                color="error"
                endIcon={<Print />}
              >
                Print
              </Button>
            </Grid>
            <Grid
              item
              hidden={isTechAdmin && job.checkList.approvedByGarageAdmin}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={approved}
                    onChange={(event, checked) =>
                      handleApproveReport(job.id, checked)
                    }
                  />
                }
                label="Approve"
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={{ xs: 0.5, md: 0.5 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            ref={containerRef}
          >
            {/* <style type="text/css" media="print">*/}
            {/*   {"\*/}
            {/*    @page { size: portrait; }\*/}
            {/*"}*/}
            {/* </style>*/}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }} elevation={7}>
                <Grid item container xs={12} spacing={2}>
                  <Grid item xs={7}>
                    Logo
                  </Grid>
                  <Grid item xs>
                    Programme
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body1" component="div" gutterBottom>
                      {job.vehicle.modelYear} {job.vehicle.make}{" "}
                      {job.vehicle.model}
                    </Typography>
                    <Typography variant="caption" component="div" gutterBottom>
                      VIN: {job.vehicle.vin}
                    </Typography>
                    <Typography variant="caption" component="div" gutterBottom>
                      License Plate: {job.vehicle.plateNumber}
                    </Typography>
                    <Typography variant="caption" component="div" gutterBottom>
                      Mileage:
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <ButtonBase>
                      <img
                        width="100%"
                        height="110px"
                        crossOrigin="anonymous"
                        alt=""
                        src={`${settings.api.driverBaseURL}/${job.vehicle.imageUrl}`}
                      />
                    </ButtonBase>
                  </Grid>
                </Grid>
                <Paper
                  sx={{
                    mt: 4,
                    bgcolor: "#FFEAAB",
                    color: (theme) =>
                      theme.palette.mode === "dark" ? "#263238" : "#000000",
                  }}
                >
                  <Grid item container xs={12} spacing={1}>
                    <Grid item xs={2}>
                      <Avatar
                        sx={{ width: 24, height: 24 }}
                        src={checkListVectorImg}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" component="p">
                        {job.checkList.description}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">
                        {computeScore(job.checkList.sections)}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                <Divider flexItem orientation="horizontal" sx={{ mt: 4 }} />
                <Grid item container xs={12} spacing={1}>
                  <Grid item xs alignSelf="center">
                    <ButtonBase>
                      <img
                        src={`${settings.api.baseURL}/${job.partner.logo}`}
                        crossOrigin="anonymous"
                        alt=""
                        width="100%"
                      />
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={9}>
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <AccessTime />
                          </ListItemIcon>
                          <ListItemText
                            primary={moment(job.jobDate).format("LT")}
                          />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <Today />
                          </ListItemIcon>
                          <ListItemText
                            primary={moment(job.jobDate).format("LL")}
                          />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <LocationOn />
                          </ListItemIcon>
                          <ListItemText primary={job.partner.contact.address} />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
                <Divider flexItem orientation="horizontal" sx={{ mb: 4 }} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} container spacing={0.5}>
              {job.checkList.sections.map((section, idx1) => {
                return (
                  <Grid key={idx1} item xs={12} md={6}>
                    <Card>
                      <CardHeader title={section.title} />
                      {section.questions.map((question, idx2) => {
                        const { color, answer } = getQuestionAnswer(question);
                        return (
                          <React.Fragment key={idx2}>
                            <CardContent
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Stack>
                                <Typography>{question.question}</Typography>
                                {question.note && (
                                  <Typography
                                    gutterBottom
                                    variant="caption"
                                    sx={{ color: "#F80000" }}
                                  >
                                    {question.text}
                                  </Typography>
                                )}
                                <Stack direction="row">
                                  {!question.images
                                    ? null
                                    : question.images
                                        .filter(
                                          (img) =>
                                            img.questionId === question.id
                                        )
                                        .map((image, index) => {
                                          return (
                                            <img
                                              key={index}
                                              alt={image.title}
                                              src={`${settings.api.baseURL}/${image.url}`}
                                              crossOrigin="anonymous"
                                              width="10%"
                                            />
                                          );
                                        })}
                                </Stack>
                              </Stack>
                              <Chip
                                label={answer}
                                sx={{ bgcolor: color, color: "white" }}
                              />
                            </CardContent>
                            <Divider flexItem orientation="horizontal" />
                          </React.Fragment>
                        );
                      })}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </React.Fragment>
      )}
      <AppAlert
        alertType="success"
        show={undefined !== success}
        message={success?.message}
        onClose={() => setSuccess(undefined)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
      <AppLoader show={jobReducer.approveJobCheckListStatus === "loading"} />
    </React.Fragment>
  );
}

export default JobCheckListReportPage;
