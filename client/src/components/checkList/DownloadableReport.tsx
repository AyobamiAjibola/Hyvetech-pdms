import { IJob } from '@app-models';
import { CheckListQuestionType, CheckListSectionType } from '@app-types';
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import settings from '../../config/settings';
import checkListVectorImg from '../../assets/images/check-list-vector.png';
import { AccessTime, LocationOn, Today } from '@mui/icons-material';
import moment from 'moment';
import React from 'react';

interface IDownloadableReport {
  job: IJob;
  computeScore: (sections: CheckListSectionType[]) => string;
  hidden: boolean;
  getQuestionAnswer: (question: CheckListQuestionType) => { color: string; answer: string };
}

export default function DownloadableReport({ job, computeScore, hidden, getQuestionAnswer }: IDownloadableReport) {
  return (
    <Box id="_report" sx={{ mt: 10, maxWidth: 768 }} hidden={hidden}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} direction="column">
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
                  {job.vehicle.modelYear} {job.vehicle.make} {job.vehicle.model}
                </Typography>
                <Typography variant="caption" component="div" gutterBottom>
                  VIN: {job.vehicle.vin}
                </Typography>
                <Typography variant="caption" component="div" gutterBottom>
                  License Plate: {job.vehicle.plateNumber}
                </Typography>
                <Typography variant="caption" component="div" gutterBottom>
                  Mileage: {job.mileageValue}/{job.mileageUnit}
                </Typography>
              </Grid>
              <Grid item xs>
                <ButtonBase>
                  <img
                    width="100%"
                    height="100%"
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
                p: 2,
                bgcolor: '#FFEAAB',
                color: theme => (theme.palette.mode === 'dark' ? '#263238' : '#000000'),
              }}>
              <Grid item container xs={12} spacing={1}>
                <Grid item xs={2} alignSelf="center">
                  <Avatar sx={{ width: 24, height: 24 }} src={checkListVectorImg} />
                </Grid>
                <Grid item xs={6} alignSelf="center">
                  <Typography variant="subtitle2" component="p">
                    {job.checkList.description}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h4">{computeScore(job.checkList.sections)}%</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Grid item xs>
              <Divider flexItem orientation="horizontal" sx={{ my: 2 }} />
            </Grid>
            <Grid item container xs={12} spacing={1}>
              <Grid item xs={3} alignSelf="center">
                <ButtonBase>
                  <img
                    src={`${settings.api.baseURL}/${job.partner.logo}`}
                    crossOrigin="anonymous"
                    alt="logo"
                    width="100%"
                  />
                </ButtonBase>
              </Grid>
              <Grid item>
                <List>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <AccessTime />
                      </ListItemIcon>
                      <ListItemText primary={moment(job.jobDate).format('LT')} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Today />
                      </ListItemIcon>
                      <ListItemText primary={moment(job.jobDate).format('LL')} />
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
            <Grid item xs>
              <Divider flexItem orientation="horizontal" sx={{ my: 2 }} />
            </Grid>

            {!job.vehicle ? null : (
              <Grid item xs={12} container spacing={1}>
                <Grid item xs={4}>
                  <ButtonBase>
                    <img
                      alt="front"
                      src={`${settings.api.baseURL}/${job.frontImageUrl}`}
                      crossOrigin="anonymous"
                      width="100%"
                    />
                  </ButtonBase>
                  <Typography variant="caption">Front</Typography>
                </Grid>
                <Grid item xs={4}>
                  <ButtonBase>
                    <img
                      alt="rear"
                      src={`${settings.api.baseURL}/${job.rearImageUrl}`}
                      crossOrigin="anonymous"
                      width="100%"
                    />
                  </ButtonBase>
                  <Typography variant="caption">Rear</Typography>
                </Grid>
                <Grid item xs={4}>
                  <ButtonBase>
                    <img
                      alt="right"
                      src={`${settings.api.baseURL}/${job.rightSideImageUrl}`}
                      crossOrigin="anonymous"
                      width="100%"
                    />
                  </ButtonBase>
                  <Typography variant="caption">Right</Typography>
                </Grid>
                <Grid item xs={4}>
                  <ButtonBase>
                    <img
                      alt="left"
                      src={`${settings.api.baseURL}/${job.leftSideImageUrl}`}
                      crossOrigin="anonymous"
                      width="100%"
                    />
                  </ButtonBase>
                  <Typography variant="caption">Left</Typography>
                </Grid>
                <Grid item xs={4}>
                  <ButtonBase>
                    <img
                      alt="engine bay"
                      src={`${settings.api.baseURL}/${job.engineBayImageUrl}`}
                      crossOrigin="anonymous"
                      width="100%"
                    />
                  </ButtonBase>
                  <Typography variant="caption">Engine Bay</Typography>
                </Grid>
                <Grid item xs={4}>
                  <ButtonBase>
                    <img
                      alt="instrument cluster"
                      src={`${settings.api.baseURL}/${job.instrumentClusterImageUrl}`}
                      crossOrigin="anonymous"
                      width="100%"
                    />
                  </ButtonBase>
                  <Typography variant="caption">Instrument Cluster</Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} container spacing={0.5}>
          {job.checkList.sections.map((section, idx1) => {
            return (
              <Grid key={idx1} item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader title={section.title} />
                  {section.questions.map((question, idx2) => {
                    const { color, answer } = getQuestionAnswer(question);
                    return (
                      <React.Fragment key={idx2}>
                        <CardContent
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Stack>
                            <Typography>{question.question}</Typography>
                            {question.note && (
                              <Typography gutterBottom variant="caption" sx={{ color: '#F80000' }}>
                                {question.text}
                              </Typography>
                            )}
                            <Stack direction="row">
                              {!question.images
                                ? null
                                : question.images
                                    .filter(img => img.questionId === question.id)
                                    .map((image, index) => {
                                      return (
                                        <Box sx={{ cursor: 'pointer' }} key={index}>
                                          <img
                                            alt={image.title}
                                            src={`${settings.api.baseURL}/${image.url}`}
                                            crossOrigin="anonymous"
                                            width="25%"
                                          />
                                        </Box>
                                      );
                                    })}
                            </Stack>
                          </Stack>
                          <Chip label={answer} sx={{ bgcolor: color, color: 'white' }} />
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
    </Box>
  );
}
