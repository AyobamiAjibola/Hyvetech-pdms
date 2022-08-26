import { AsyncThunkPayloadCreator } from "@reduxjs/toolkit";

export default function asyncThunkErrorWrapper(handler: any) {
  return async function (
    arg: void,
    thunkAPI: any
  ): Promise<ReturnType<AsyncThunkPayloadCreator<any>>> {
    try {
      return handler(arg, thunkAPI);
    } catch (e: any | unknown) {
      if (e.response) return thunkAPI.rejectWithValue(e.response.data);
      return Promise.reject(e);
    }
  };
}
