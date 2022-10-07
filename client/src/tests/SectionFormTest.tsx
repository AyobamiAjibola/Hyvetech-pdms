import React, { useEffect } from "react";
import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  useFormikContext,
} from "formik";
import { CheckListTestType } from "./AppTest";
import {
  Button,
  ButtonGroup,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

function SectionFormTest() {
  const { values } = useFormikContext<CheckListTestType>();

  useEffect(() => {
    console.log(values);
  }, [values]);

  const handleAddSection = (sectionProps: FieldArrayRenderProps) => {
    sectionProps.push({
      title: "",
      questions: [
        {
          answers: [{ answer: "", weight: "" }],
          media: false,
          note: false,
          question: "",
        },
      ],
    });
  };

  const handleAddQuestion = (
    sectionProps: FieldArrayRenderProps,
    questionIndex: number,
    sectionIndex: number
  ) => {
    const tempSections = [...values.sections];
    const questions = tempSections[sectionIndex].questions;

    sectionProps.push(tempSections);
  };

  return (
    <Form>
      <FieldArray
        name="sections"
        render={(sectionProps) =>
          values.sections &&
          values.sections.map((section, idx1) => {
            return (
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{ p: 3 }}
                key={idx1}
              >
                <Grid item xs={8}>
                  <TextField
                    size="small"
                    label={`Section ${idx1 + 1}`}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} alignSelf="center">
                  <ButtonGroup fullWidth>
                    <Button
                      onClick={() => sectionProps.remove(idx1)}
                      variant="contained"
                      color="error"
                      sx={{ fontSize: 11 }}
                      endIcon={<Delete />}
                    >
                      Remove Section
                    </Button>
                    <Button
                      onClick={() => handleAddSection(sectionProps)}
                      variant="contained"
                      color="success"
                      sx={{ fontSize: 11 }}
                      endIcon={<Add />}
                    >
                      Add Section
                    </Button>
                  </ButtonGroup>
                </Grid>
                {section.questions &&
                  section.questions.map((question, idx2) => {
                    return (
                      <React.Fragment key={idx2}>
                        <Grid item xs={5}>
                          <TextField
                            size="small"
                            label={`Question ${idx2 + 1}`}
                            fullWidth
                          />
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          container
                          justifyContent="space-around"
                        >
                          <FormControlLabel
                            label="Media"
                            control={<Switch size="small" />}
                          />
                          <FormControlLabel
                            label="Note"
                            control={<Switch size="small" />}
                          />
                        </Grid>
                        <Grid item xs={4} alignSelf="center">
                          <ButtonGroup fullWidth>
                            <Button
                              variant="contained"
                              color="error"
                              sx={{ fontSize: 11 }}
                              endIcon={<Delete />}
                            >
                              Remove Question
                            </Button>
                            <Button
                              onClick={() =>
                                handleAddQuestion(sectionProps, idx2, idx1)
                              }
                              variant="contained"
                              color="success"
                              sx={{ fontSize: 11 }}
                              endIcon={<Add />}
                            >
                              Add Question
                            </Button>
                          </ButtonGroup>
                        </Grid>
                        {question.answers &&
                          question.answers.map((answer, idx3) => {
                            return (
                              <React.Fragment key={idx3}>
                                <Grid item xs={4}>
                                  <TextField
                                    size="small"
                                    label={`Answer ${idx3 + 1}`}
                                    fullWidth
                                  />
                                </Grid>
                                <Grid item xs={4}>
                                  <TextField
                                    size="small"
                                    label={`Weight ${idx3 + 1}`}
                                    fullWidth
                                  />
                                </Grid>
                                <Grid item xs={4} alignSelf="center">
                                  <ButtonGroup fullWidth>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      sx={{ fontSize: 11 }}
                                      endIcon={<Delete />}
                                    >
                                      Remove Answer
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="success"
                                      sx={{ fontSize: 11 }}
                                      endIcon={<Add />}
                                    >
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
              </Grid>
            );
          })
        }
      />
    </Form>
  );
}

export default SectionFormTest;
