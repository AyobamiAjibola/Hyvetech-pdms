import * as Yup from 'yup';
import { CheckListType } from '@app-types';
import { v4 } from 'uuid';

const fields = {
  sections: {
    name: 'sections',
    label: 'Section Title*',
    error: {
      invalid: 'Section Title is invalid',
      require: 'Section Title is required',
    },
  },
  questions: {
    name: 'questions',
    label: 'Question*',
    error: {
      invalid: 'Question is invalid',
      require: 'Question is required',
    },
  },
  answers: {
    name: 'answers',
    label: 'Answer*',
    error: {
      invalid: 'Answer is invalid',
      require: 'Answer is required',
    },
  },
};

const initialValues: CheckListType = {
  sections: [
    {
      id: v4(),
      title: '',
      questions: [
        {
          id: v4(),
          answers: [{ id: v4(), answer: '', weight: '', color: '' }],
          media: false,
          note: false,
          question: '',
        },
      ],
    },
  ],
};

const schema = Yup.object().shape({
  checkList: Yup.string().required().label('Check List name'),
  partner: Yup.string().required().label('Partner'),
});

const checkListSectionModel = {
  fields,
  initialValues,
  schema,
};

export default checkListSectionModel;
