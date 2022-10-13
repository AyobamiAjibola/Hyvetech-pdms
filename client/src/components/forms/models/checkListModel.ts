import * as Yup from "yup";

export interface ICheckListValues {
  checkList: string;
  description: string;
  partner: string;
}

const fields = {
  checkList: {
    name: "checkList",
    label: "Check List*",
    error: {
      invalid: "Check List name is invalid",
      require: "Check List name is required",
    },
  },
  partner: {
    name: "partner",
    label: "Partner*",
    error: {
      invalid: "Partner is invalid",
      require: "Partner is required",
    },
  },
  description: {
    name: "description",
    label: "Description*",
    error: {
      invalid: "Description is invalid",
      require: "Description is required",
    },
  },
  sections: {
    name: "sections",
    label: "Section Title*",
    error: {
      invalid: "Section Title is invalid",
      require: "Section Title is required",
    },
  },
  questions: {
    name: "questions",
    label: "Question*",
    error: {
      invalid: "Question is invalid",
      require: "Question is required",
    },
  },
  answers: {
    name: "answers",
    label: "Answer*",
    error: {
      invalid: "Answer is invalid",
      require: "Answer is required",
    },
  },
};

const initialValues: ICheckListValues = {
  checkList: "",
  partner: "",
  description: "",
};

const schema = Yup.object().shape({
  checkList: Yup.string().required().label("Check List name"),
  description: Yup.string().required().label("Check List Description"),
  partner: Yup.string().required().label("Partner"),
});

const checkListModel = {
  fields,
  initialValues,
  schema,
};

export default checkListModel;
