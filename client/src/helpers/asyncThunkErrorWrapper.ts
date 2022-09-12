export default function asyncThunkErrorWrapper(handler: any) {
  return async function (arg: any, thunkAPI: any) {
    try {
      return handler(arg, thunkAPI);
    } catch (e: any | unknown) {
      if (e.response) return thunkAPI.rejectWithValue(e.response.data);
      return Promise.reject(e);
    }
  };
}
