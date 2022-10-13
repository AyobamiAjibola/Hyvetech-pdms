import React, { useEffect, useState } from "react";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getJobAction } from "../../store/actions/jobActions";
import { IJob } from "@app-models";
import { useLocation } from "react-router-dom";
import {
  Avatar,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import settings from "../../config/settings";
import {
  CheckListAnswerType,
  CheckListQuestionType,
  CheckListSectionType,
} from "@app-types";
import checkListVectorImg from "../../assets/images/check-list-vector.png";
import { AccessTime, LocationOn, Today } from "@mui/icons-material";

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

  console.log(answerTypes);
  return null;
};

function JobCheckListReportPage() {
  const [job, setJob] = useState<IJob | null>(null);

  const jobReducer = useAppSelector((state) => state.jobReducer);
  const dispatch = useAppDispatch();

  const location = useLocation();

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
      if (jobReducer.job) {
        setJob(jobReducer.job);
      }
    }
  }, [dispatch, jobReducer.getJobStatus, jobReducer.job]);

  return (
    <React.Fragment>
      {!job ? null : (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={4}>
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
                <Grid item xs>
                  <img
                    src={`${settings.api.baseURL}/${job.partner.logo}`}
                    crossOrigin="anonymous"
                    alt=""
                  />
                </Grid>
                <Grid item xs={9}>
                  <List>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <AccessTime />
                        </ListItemIcon>
                        <ListItemText primary="Time" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <Today />
                        </ListItemIcon>
                        <ListItemText primary="Date" />
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
          <Grid item xs={8} container spacing={1}>
            {job.checkList.sections.map((section, idx1) => {
              return (
                <Grid key={idx1} item xs={6}>
                  <Card>
                    <CardHeader title={section.title} />
                    {section.questions.map((question, idx2) => {
                      return (
                        <CardContent key={idx2}>
                          {getQuestionAnswer(question)}
                        </CardContent>
                      );
                    })}
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default JobCheckListReportPage;
