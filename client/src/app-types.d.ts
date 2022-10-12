declare module "@app-types" {
  import { IImageButtonData } from "@app-interfaces";
  type IThunkAPIStatus = "idle" | "loading" | "completed" | "failed";
  type CallableFunction = () => void;
  type CustomHookMessage = { message: string };
  type GenericObjectType = { [t: string]: any };
  type CheckListAnswerType = {
    id: string;
    answer: string;
    weight: string;
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
  type CheckListType = {
    sections: Array<CheckListSectionType>;
  };
}
