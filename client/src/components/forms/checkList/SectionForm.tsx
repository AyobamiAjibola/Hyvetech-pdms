import React, { useMemo } from 'react';
import { FieldArray, FieldArrayRenderProps, Form, useFormikContext } from 'formik';

import { Button, ButtonGroup, Divider, FormControlLabel, Grid, Switch, TextField } from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { CheckListType } from '@app-types';
import checkListSectionModel from '../models/checkListSectionModel';
import { v4 } from 'uuid';
import { MuiColorInput } from 'mui-color-input';

interface IProps {
  isSubmitting?: boolean;
}

const { initialValues, fields } = checkListSectionModel;

export default function SectionForm(props: IProps) {
  const { values, setFieldValue, handleChange } = useFormikContext<CheckListType>();

  const isEmpty = useMemo(() => values.sections.length === 0, [values]);

  const handleAddSection = (sectionProps: FieldArrayRenderProps) => {
    sectionProps.push(initialValues.sections[0]);
  };

  const handleAddQuestion = (questionIndex: number, sectionIndex: number) => {
    const tempSections = [...values.sections];

    const questions = tempSections[sectionIndex].questions;

    questions.push({
      id: v4(),
      answers: [{ id: v4(), answer: '', weight: '', color: '' }],
      media: false,
      note: false,
      question: '',
    });

    setFieldValue(fields.sections.name, tempSections);
  };

  const handleRemoveQuestion = (questionIndex: number, sectionIndex: number) => {
    const tempSections = [...values.sections];

    tempSections[sectionIndex].questions.splice(questionIndex, 1);

    setFieldValue(fields.sections.name, tempSections);
  };

  const handleAddAnswer = (answerIndex: number, questionIndex: number, sectionIndex: number) => {
    const tempSections = [...values.sections];

    tempSections[sectionIndex].questions[questionIndex].answers.push({
      id: v4(),
      answer: '',
      weight: '',
      color: '',
    });

    setFieldValue(fields.sections.name, tempSections);
  };

  const handleRemoveAnswer = (answerIndex: number, questionIndex: number, sectionIndex: number) => {
    const tempSections = [...values.sections];

    tempSections[sectionIndex].questions[questionIndex].answers.splice(answerIndex, 1);

    setFieldValue(fields.sections.name, tempSections);
  };

  return (
    <Form>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ p: 3 }}>
        <FieldArray
          name="sections"
          render={sectionProps =>
            values.sections &&
            values.sections.map((section, idx1) => {
              return (
                <React.Fragment key={idx1}>
                  <Grid item xs={8}>
                    <TextField
                      size="small"
                      label={`Section ${idx1 + 1}`}
                      fullWidth
                      name={`sections.${idx1}.title`}
                      value={values.sections[idx1].title}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} alignSelf="center">
                    <ButtonGroup fullWidth>
                      <Button
                        onClick={() => sectionProps.remove(idx1)}
                        variant="contained"
                        color="error"
                        sx={{ fontSize: 11 }}
                        endIcon={<Delete />}>
                        Remove Section
                      </Button>
                      <Button
                        onClick={() => handleAddSection(sectionProps)}
                        variant="contained"
                        color="success"
                        sx={{ fontSize: 11 }}
                        endIcon={<Add />}>
                        Add Section
                      </Button>
                    </ButtonGroup>
                  </Grid>
                  {section.questions &&
                    section.questions.map((question, idx2) => {
                      return (
                        <React.Fragment key={idx2}>
                          <Grid item xs />
                          <Grid item xs={4}>
                            <TextField
                              size="small"
                              label={`Question ${idx2 + 1}`}
                              fullWidth
                              value={values.sections[idx1].questions[idx2].question}
                              name={`sections.${idx1}.questions.${idx2}.question`}
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={3} container justifyContent="space-around">
                            <FormControlLabel
                              label="Media"
                              control={
                                <Switch
                                  size="small"
                                  checked={values.sections[idx1].questions[idx2].media}
                                  name={`sections.${idx1}.questions.${idx2}.media`}
                                  onChange={handleChange}
                                />
                              }
                            />
                            <FormControlLabel
                              label="Note"
                              control={
                                <Switch
                                  size="small"
                                  checked={values.sections[idx1].questions[idx2].note}
                                  name={`sections.${idx1}.questions.${idx2}.note`}
                                  onChange={handleChange}
                                />
                              }
                            />
                          </Grid>
                          <Grid item xs={4} alignSelf="center">
                            <ButtonGroup fullWidth>
                              <Button
                                onClick={() => handleRemoveQuestion(idx2, idx1)}
                                variant="contained"
                                color="error"
                                sx={{ fontSize: 11 }}
                                endIcon={<Delete />}>
                                Remove Question
                              </Button>
                              <Button
                                onClick={() => handleAddQuestion(idx2, idx1)}
                                variant="contained"
                                color="success"
                                sx={{ fontSize: 11 }}
                                endIcon={<Add />}>
                                Add Question
                              </Button>
                            </ButtonGroup>
                          </Grid>
                          {question.answers &&
                            question.answers.map((answer, idx3) => {
                              return (
                                <React.Fragment key={idx3}>
                                  <Grid item xs={2} />
                                  <Grid item xs={2}>
                                    <TextField
                                      size="small"
                                      label={`Answer ${idx3 + 1}`}
                                      fullWidth
                                      name={`sections.${idx1}.questions.${idx2}.answers.${idx3}.answer`}
                                      value={values.sections[idx1].questions[idx2].answers[idx3].answer}
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <TextField
                                      size="small"
                                      label={`Weight ${idx3 + 1}`}
                                      fullWidth
                                      name={`sections.${idx1}.questions.${idx2}.answers.${idx3}.weight`}
                                      value={values.sections[idx1].questions[idx2].answers[idx3].weight}
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <MuiColorInput
                                      size="small"
                                      label={`Color ${idx3 + 1}`}
                                      fullWidth
                                      format="hex"
                                      name={`sections.${idx1}.questions.${idx2}.answers.${idx3}.color`}
                                      value={values.sections[idx1].questions[idx2].answers[idx3].color}
                                      onChange={value => {
                                        setFieldValue(
                                          `sections.${idx1}.questions.${idx2}.answers.${idx3}.color`,
                                          value,
                                        );
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={4} alignSelf="center">
                                    <ButtonGroup fullWidth>
                                      <Button
                                        onClick={() => handleRemoveAnswer(idx3, idx2, idx1)}
                                        variant="contained"
                                        color="error"
                                        sx={{ fontSize: 11 }}
                                        endIcon={<Delete />}>
                                        Remove Answer
                                      </Button>
                                      <Button
                                        onClick={() => handleAddAnswer(idx3, idx2, idx1)}
                                        variant="contained"
                                        color="success"
                                        sx={{ fontSize: 11 }}
                                        endIcon={<Add />}>
                                        Add Answer
                                      </Button>
                                    </ButtonGroup>
                                  </Grid>
                                </React.Fragment>
                              );
                            })}
                        </React.Fragment>
                      );
                    })}
                  <Grid item xs={12}>
                    <Divider orientation="horizontal" />
                  </Grid>
                </React.Fragment>
              );
            })
          }
        />
        <Grid item xs={12} md={6}>
          {isEmpty ? (
            <Button
              onClick={() => setFieldValue(fields.sections.name, initialValues.sections)}
              type="button"
              variant="outlined"
              color="success"
              size="small"
              endIcon={<Add />}>
              Add Section
            </Button>
          ) : (
            <LoadingButton
              loading={props.isSubmitting}
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
              endIcon={<Save />}>
              Save
            </LoadingButton>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}
