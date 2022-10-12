import React, {
  ChangeEvent,
  createContext,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getJobAction } from "../../store/actions/jobActions";
import {
  Box,
  Button,
  Slide,
  Step,
  StepButton,
  Stepper,
  useTheme,
} from "@mui/material";
import TabPanel from "../../components/tabs/TabPanel";
import { CheckListSectionType, CustomHookMessage } from "@app-types";
import {
  IImageButtonData,
  IJobCheckListPageContextProps,
} from "@app-interfaces";
import AppAlert from "../../components/alerts/AppAlert";
import NoteAnswerForm from "../../components/forms/checkList/NoteAnswerForm";
import { IJob } from "@app-models";
import { useLocation } from "react-router-dom";

interface ILocationState {
  job: IJob;
}

export const JobCheckListPageContext =
  createContext<IJobCheckListPageContextProps | null>(null);

function JobCheckListPage() {
  const [sections, setSections] = useState<CheckListSectionType[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState<IImageButtonData[]>([]);
  const [error, setError] = useState<CustomHookMessage>();

  const containerRef = useRef(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const location = useLocation();

  const lastStep = useMemo(() => sections.length - 1, [sections]);

  const isLastStep = useMemo(
    () => activeStep === lastStep,
    [activeStep, lastStep]
  );

  const jobReducer = useAppSelector((state) => state.jobReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (jobReducer.getJobStatus === "idle") {
      if (location.state) {
        const state = location.state as ILocationState;

        const jobId = state.job.id;
        dispatch(getJobAction(jobId));
      }

      //dispatch(getJobAction(1));
    }
  }, [dispatch, jobReducer.getJobStatus, location.state]);

  useEffect(() => {
    if (jobReducer.getJobStatus === "completed") {
      if (jobReducer.job) {
        const sections = jobReducer.job.checkList.sections;
        setSections(sections);
      }
    }
  }, [dispatch, jobReducer.getJobStatus, jobReducer.job]);

  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLastStep) {
      sections.forEach((section) => {
        const questions = section.questions;

        questions.forEach((question) => {
          const answers = question.answers;

          const someSelected = answers.some((answer) => answer.selected);

          if (!someSelected)
            return setError({
              message:
                "You must select one answer from the options in the check list",
            });

          if (question.note && !question.text) {
            //throw an error - you must add a note
            return setError({
              message:
                "It appears one of the questions, requires you to add a note. Please check.",
            });
          }

          if (question.media && !question.images) {
            //throw an error - you must add at least one image
            return setError({
              message:
                "It appears one of the questions, requires you to upload an image. Please check.",
            });
          }
        });
      });

      return console.log(sections);
    }

    setActiveStep(activeStep + 1);
  };

  const handleBack = () => setActiveStep(activeStep - 1);

  const handleReset = () => setActiveStep(0);

  const handleChangeRadioBtn = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const tempSections = JSON.parse(
        JSON.stringify([...sections])
      ) as Array<CheckListSectionType>;

      const id = e.target.id;

      for (let i = 0; i < tempSections.length; i++) {
        const questions = tempSections[i].questions;

        for (let j = 0; j < questions.length; j++) {
          const answer = questions[j].answers.find((answer) => answer.id == id);

          if (answer) {
            const isChecked = questions[j].answers.find(
              (value) => value.selected
            );

            if (isChecked) isChecked.selected = false;

            answer.selected = e.target.checked;
            break;
          }
        }
      }

      setSections(tempSections);
    },
    [sections]
  );

  const handleChangeTextArea = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const tempSections = JSON.parse(
        JSON.stringify([...sections])
      ) as Array<CheckListSectionType>;

      const id = e.target.id;

      for (let i = 0; i < tempSections.length; i++) {
        const question = tempSections[i].questions.find(
          (question) => question.id === id
        );

        if (question) {
          question.text = e.target.value;
          break;
        }
      }

      setSections(tempSections);
    },
    [sections]
  );

  const handleChangeImage = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      const id = e.target.id;

      const tempSections = JSON.parse(
        JSON.stringify([...sections])
      ) as Array<CheckListSectionType>;

      for (let i = 0; i < tempSections.length; i++) {
        const question = tempSections[i].questions.find(
          (question) => question.id === id
        );

        if (question && files) {
          const file = files[0];

          if (question.images) {
            question.images = [
              ...question.images,
              {
                id: question.id,
                url: URL.createObjectURL(file),
                title: file.name,
                width: "",
                file,
              },
            ];
          } else
            question.images = [
              {
                id: question.id,
                url: URL.createObjectURL(file),
                title: file.name,
                width: "",
                file,
              },
            ];
          break;
        }
      }

      setSections(tempSections);
    },
    [sections]
  );

  const handleRemoveImage = useCallback(
    (id: any) => {
      const tempSections = JSON.parse(
        JSON.stringify([...sections])
      ) as Array<CheckListSectionType>;

      for (let i = 0; i < tempSections.length; i++) {
        const question = tempSections[i].questions.find(
          (question) => question.id === id
        );

        if (question && question.images) {
          const tempImages = [...question.images];
          const image = tempImages.find((image) => image.id === id);
          if (image) {
            const index = tempImages.indexOf(image);
            tempImages.splice(index, 1);
            question.images = tempImages;
          }

          if (imageRef.current) imageRef.current.value = "";

          break;
        }
      }

      setSections(tempSections);
    },
    [sections]
  );

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
            <Slide
              key={index}
              direction="left"
              in={activeStep === index}
              container={containerRef.current}
            >
              <div>
                <TabPanel
                  value={activeStep}
                  index={index}
                  dir={theme.direction}
                >
                  <Box sx={{ pt: 6 }}>
                    {tab.questions.map((question, idx1) => {
                      return (
                        <NoteAnswerForm
                          key={idx1}
                          onChangeRadioBtn={handleChangeRadioBtn}
                          onChangeTextArea={handleChangeTextArea}
                          onChangeImage={handleChangeImage}
                          onRemoveImage={handleRemoveImage}
                          question={question}
                        />
                      );
                    })}
                  </Box>
                </TabPanel>
              </div>
            </Slide>
          );
        })}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button type="submit">{isLastStep ? "Submit" : "Next"}</Button>
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

export default JobCheckListPage;
