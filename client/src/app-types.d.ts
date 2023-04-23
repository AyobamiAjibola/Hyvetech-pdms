declare module '@app-types' {
  import { IImageButtonData } from '@app-interfaces';
  import { ICheckList } from '@app-models';
  type IThunkAPIStatus = 'idle' | 'loading' | 'completed' | 'failed';
  type CallableFunction = () => void;
  type CustomHookMessage = { message: string | undefined };
  type AnyObjectType = { [t: string]: any };
  type CheckListAnswerType = {
    id: string;
    answer: string;
    weight: string;
    color: string;
    selected?: boolean;
  };
  type CheckListQuestionType = {
    id: string;
    question: string;
    media: boolean;
    note?: boolean;
    images?: Array<IImageButtonData>;
    text?: string;
    answers: Array<CheckListAnswerType>;
  };
  type CheckListSectionType = {
    id: string;
    title: string;
    questions: Array<CheckListQuestionType>;
  };
  type CheckListType = Partial<Omit<ICheckList, 'sections'>> & {
    sections: Array<CheckListSectionType>;
  };
}