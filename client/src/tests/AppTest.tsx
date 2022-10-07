import React, { useState } from "react";
import { Container } from "@mui/material";
import { Formik } from "formik";
import SectionFormTest from "./SectionFormTest";

export type AnswerTestType = { answer: string; weight: string };
export type QuestionTestType = {
  question: string;
  media: boolean;
  note?: boolean;
  answers: Array<AnswerTestType>;
};
export type SectionTestType = {
  title: string;
  questions: Array<QuestionTestType>;
};
export type CheckListTestType = {
  sections: Array<SectionTestType>;
};

const initialValues: CheckListTestType = {
  sections: [
    {
      title: "",
      questions: [
        {
          answers: [{ answer: "", weight: "" }],
          media: false,
          note: false,
          question: "",
        },
      ],
    },
  ],
};

function AppTest() {
  const [currentValues, setCurrentValues] =
    useState<CheckListTestType>(initialValues);

  const handleSubmit = (values: CheckListTestType) => {
    console.log(values);
  };

  return (
    <Container>
      <Formik initialValues={currentValues} onSubmit={handleSubmit}>
        <SectionFormTest />
      </Formik>
    </Container>
  );
}

export default AppTest;
