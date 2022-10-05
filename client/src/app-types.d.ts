declare module "@app-types" {
  type IThunkAPIStatus = "idle" | "loading" | "completed" | "failed";
  type CallableFunction = () => void;
  type CustomHookMessage = { message: string };
  type GenericObjectType = { [t: string]: any };
  type ICheckListAnswer = { label: string; weight: string };
}
