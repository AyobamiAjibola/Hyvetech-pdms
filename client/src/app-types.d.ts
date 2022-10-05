declare module "@app-types" {
  type IThunkAPIStatus = "idle" | "loading" | "completed" | "failed";
  type CallableFunction = () => void;
  type CustomHookMessage = { message: string };
  type GenericObjectType = { [t: string]: any };
  type ICheckListAnswer = { answer: string; weight: string };
  type ICheckListQuestion = {
    question: string;
    requireMedia: boolean;
    note?: string;
    answers: ICheckListAnswer[];
  };
  type ICheckListSection = {
    title: string;
    questions: ICheckListQuestion[];
  };
}
