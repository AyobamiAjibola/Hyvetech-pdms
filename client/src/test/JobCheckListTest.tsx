import React, { ChangeEvent, createContext, FormEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ClickAwayListener,
  Divider,
  Grid,
  Grow,
  IconButton,
  Paper,
  Popper,
  Slide,
  Step,
  StepButton,
  Stepper,
  TextField,
  useTheme,
} from '@mui/material';

import { CheckListQuestionType, CheckListSectionType, CheckListType, CustomHookMessage } from '@app-types';
import { IImageButtonData, IJobCheckListPageContextProps } from '@app-interfaces';
import AppAlert from '../components/alerts/AppAlert';
import { getJobAction } from '../store/actions/jobActions';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import TabPanel from '../components/tabs/TabPanel';
import { CssVarsProvider, Radio, RadioGroup, Sheet } from '@mui/joy';
import CustomRadioIconField from '../components/forms/fields/CustomRadioIconField';
import { CameraAlt, CheckCircleRounded, Close } from '@mui/icons-material';
import { v4 } from 'uuid';
import { createJobCheckListAction } from '../store/actions/checkListActions';

const COLORS = ['#E14B5A', '#F2994A', '#009A49', '#E6E6E6'];

const JobCheckListPageContext = createContext<IJobCheckListPageContextProps | null>(null);

interface FormProps {
  onChangeTextArea: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  question: CheckListQuestionType;
  onChangeRadioBtn: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeImage: (e: ChangeEvent<HTMLInputElement>, questionId?: any) => void;
  onRemoveImage: (id: any, questionId?: any) => void;
}

function NoteAnswerForm(props: FormProps) {
  const [openNote, setOpenNote] = useState<boolean>(false);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(openNote);

  const { question } = props;

  const { imageRef } = useContext(JobCheckListPageContext) as IJobCheckListPageContextProps;

  useEffect(() => {
    if (prevOpen.current && !openNote) {
      anchorRef.current?.focus();
    }

    prevOpen.current = openNote;
  }, [openNote]);

  const handleToggle = () => {
    setOpenNote(prevOpen => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) return;

    setOpenNote(false);
  };

  return (
    <Card sx={{ width: '100%' }} variant="outlined">
      <CardHeader title={question.question} />
      <CardContent>
        <CssVarsProvider>
          <RadioGroup name="answer" size="lg" sx={{ gap: 1.5 }}>
            {question.answers.map((answer, idx2) => {
              const weight = Math.floor(+answer.weight);
              const bgColor = answer.color ? answer.color : COLORS[weight];

              return (
                <Sheet key={idx2} sx={{ p: 2, borderRadius: 'md' }}>
                  <Radio
                    component={props1 => <Button {...props1} />}
                    label={answer.answer}
                    overlay
                    disableIcon
                    id={answer.id}
                    value={answer.id}
                    checked={answer.selected}
                    onChange={props.onChangeRadioBtn}
                    componentsProps={{
                      label: (checked: boolean) => ({
                        sx: {
                          fontWeight: 'lg',
                          fontSize: 'md',
                          color: checked ? 'text.primary' : 'text.secondary',
                        },
                      }),
                      action: (checked: boolean) => ({
                        sx: () => ({
                          ...(checked && {
                            '--variant-borderWidth': '1px',
                            '&&': {
                              // && to increase the specificity to win the base :hover styles
                              // borderColor: theme.vars.palette.primary[500],
                              backgroundColor: bgColor,
                            },
                          }),
                        }),
                      }),
                    }}
                  />
                </Sheet>
              );
            })}
          </RadioGroup>
        </CssVarsProvider>
      </CardContent>
      {question.images ? (
        <CardContent sx={{ overflowX: 'scroll' }}>
          <CustomRadioIconField questionId={question.id} options={question.images} onDelete={props.onRemoveImage} />
        </CardContent>
      ) : null}
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {question.note && (
          <React.Fragment>
            <Button
              ref={anchorRef}
              id="composition-button"
              aria-controls={openNote ? 'composition-menu' : undefined}
              aria-expanded={openNote ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              sx={{ textTransform: 'capitalize' }}>
              add note..
            </Button>
            <Popper
              open={openNote}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
              sx={{ width: '100%', maxWidth: 440, zIndex: 999 }}>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                  }}>
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <Card>
                        <CardActions
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <IconButton onClick={handleClose}>
                            <Close />
                          </IconButton>
                          <IconButton onClick={handleClose}>
                            <CheckCircleRounded />
                          </IconButton>
                        </CardActions>
                        <Divider flexItem orientation="horizontal" />
                        <CardContent>
                          <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={5}
                            name={question.id}
                            id={question.id}
                            value={question.text}
                            onChange={props.onChangeTextArea}
                          />
                        </CardContent>
                      </Card>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </React.Fragment>
        )}
        {question.media && (
          <Button component="label" sx={{ textTransform: 'capitalize' }} startIcon={<CameraAlt />}>
            media
            <input
              onChange={e => props.onChangeImage(e, question.id)}
              hidden
              ref={imageRef}
              id={question.id}
              accept="image/*"
              type="file"
            />
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default function JobCheckListTest() {
  const [sections, setSections] = useState<CheckListSectionType[]>([]);
  const [checkList, setCheckList] = useState<CheckListType | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState<IImageButtonData[]>([]);
  const [error, setError] = useState<CustomHookMessage>();

  const containerRef = useRef(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const lastStep = useMemo(() => sections.length - 1, [sections]);

  const isLastStep = useMemo(() => activeStep === lastStep, [activeStep, lastStep]);

  const jobReducer = useAppSelector(state => state.jobReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (jobReducer.getJobStatus === 'idle') {
      dispatch(getJobAction(1));
    }
  }, [dispatch, jobReducer.getJobStatus]);

  useEffect(() => {
    if (jobReducer.getJobStatus === 'completed') {
      if (jobReducer.job) {
        const sections = jobReducer.job.checkList.sections;
        setCheckList(jobReducer.job.checkList);
        setSections(sections);
      }
    }
  }, [dispatch, jobReducer.getJobStatus, jobReducer.job]);

  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLastStep) {
      const _checkList = {
        ...checkList,
        sections,
        isSubmitted: true,
      };

      dispatch(createJobCheckListAction({ jobId: 1, checkList: _checkList }));
    } else setActiveStep(activeStep + 1);
  };

  const handleBack = () => setActiveStep(activeStep - 1);

  const handleChangeRadioBtn = (e: ChangeEvent<HTMLInputElement>) => {
    const tempSections = JSON.parse(JSON.stringify([...sections])) as Array<CheckListSectionType>;

    const id = e.target.id;

    for (let i = 0; i < tempSections.length; i++) {
      const questions = tempSections[i].questions;

      for (let j = 0; j < questions.length; j++) {
        const answer = questions[j].answers.find(answer => answer.id == id);

        if (answer) {
          const isChecked = questions[j].answers.find(value => value.selected);

          if (isChecked) isChecked.selected = false;

          answer.selected = e.target.checked;
          break;
        }
      }
    }

    setSections(tempSections);
  };

  const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const tempSections = JSON.parse(JSON.stringify([...sections])) as Array<CheckListSectionType>;

    const id = e.target.id;

    for (let i = 0; i < tempSections.length; i++) {
      const question = tempSections[i].questions.find(question => question.id === id);

      if (question) {
        question.text = e.target.value;
        break;
      }
    }

    setSections(tempSections);
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>, questionId: any) => {
    const files = e.target.files;

    const tempSections = JSON.parse(JSON.stringify([...sections])) as Array<CheckListSectionType>;

    for (let i = 0; i < tempSections.length; i++) {
      const question = tempSections[i].questions.find(question => question.id === questionId);

      if (question && files) {
        const file = files[0];
        const id = v4();

        if (question.images) {
          question.images = [
            ...question.images,
            {
              id,
              questionId,
              url: URL.createObjectURL(file),
              title: file.name,
              width: '',
            },
          ];
        } else
          question.images = [
            {
              id,
              questionId,
              url: URL.createObjectURL(file),
              title: file.name,
              width: '',
            },
          ];
        break;
      }
    }

    setSections(tempSections);
  };

  const handleRemoveImage = (id: any, questionId?: any) => {
    const tempSections = JSON.parse(JSON.stringify([...sections])) as Array<CheckListSectionType>;

    for (let i = 0; i < tempSections.length; i++) {
      const question = tempSections[i].questions.find(question => question.id === questionId);

      if (question && question.images) {
        const tempImages = [...question.images];

        const image = tempImages.find(image => image.id === id);

        if (image) {
          const index = tempImages.indexOf(image);
          tempImages.splice(index, 1);
          question.images = tempImages;
        }

        break;
      }
    }

    setSections(tempSections);
  };

  return (
    <JobCheckListPageContext.Provider value={{ imageRef, images, setImages }}>
      <Stepper nonLinear activeStep={activeStep}>
        {sections.map((label, index) => (
          <Step key={index}>
            <StepButton color="inherit">{label.title}</StepButton>
          </Step>
        ))}
      </Stepper>

      <form autoComplete="off" onSubmit={handleNext}>
        {sections.map((tab, index) => {
          return (
            <Slide key={index} direction="left" in={activeStep === index} container={containerRef.current}>
              <div>
                <TabPanel value={activeStep} index={index} dir={theme.direction}>
                  <Box sx={{ pt: 6 }}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                      {tab.questions.map((question, idx1) => {
                        return (
                          <Grid item xs={4} key={idx1}>
                            <NoteAnswerForm
                              key={idx1}
                              onChangeRadioBtn={handleChangeRadioBtn}
                              onChangeTextArea={handleChangeTextArea}
                              onChangeImage={handleChangeImage}
                              onRemoveImage={handleRemoveImage}
                              question={question}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </TabPanel>
              </div>
            </Slide>
          );
        })}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button type="submit">{isLastStep ? 'Submit' : 'Next'}</Button>
        </Box>
      </form>
      <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
    </JobCheckListPageContext.Provider>
  );
}
