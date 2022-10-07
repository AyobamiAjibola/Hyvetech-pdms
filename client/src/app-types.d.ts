declare module "@app-types" {
  type IThunkAPIStatus = "idle" | "loading" | "completed" | "failed";
  type CallableFunction = () => void;
  type CustomHookMessage = { message: string };
  type GenericObjectType = { [t: string]: any };
  type CheckListAnswerType = { answer: string; weight: string };
  type CheckListQuestionType = {
    question: string;
    media: boolean;
    note?: boolean;
    answers: Array<CheckListAnswerType>;
  };
  type CheckListSectionType = {
    title: string;
    questions: Array<CheckListQuestionType>;
  };
  type CheckListType = {
    sections: Array<CheckListSectionType>;
  };
}
