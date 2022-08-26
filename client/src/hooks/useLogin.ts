import { useEffect, useState } from "react";
import { CustomHookMessage } from "@app-types";
import { useNavigate } from "react-router-dom";
import useAppSelector from "./useAppSelector";
import cookie from "../utils/cookie";
import settings from "../config/settings";
import useAppDispatch from "./useAppDispatch";
import { clearLoginStatus } from "../store/reducers/authenticationReducer";

export default function useLogin() {
  const [_timeout, _setTimeout] = useState<any>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();

  const navigate = useNavigate();

  const authReducer = useAppSelector((state) => state.authenticationReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authReducer.signingInStatus === "completed") {
      setSuccess({ message: authReducer.signingInSuccess });

      cookie.set(settings.auth.admin, authReducer.authToken);

      dispatch(clearLoginStatus());

      _setTimeout(
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000)
      );
    }
  }, [
    authReducer.authToken,
    authReducer.signingInStatus,
    authReducer.signingInSuccess,
    dispatch,
    navigate,
  ]);

  useEffect(() => {
    if (authReducer.signingInStatus === "failed") {
      setError({ message: authReducer.signingInError });
    }
  }, [authReducer.signingInStatus, authReducer.signingInError, navigate]);

  useEffect(() => {
    return () => {
      clearTimeout(_timeout);
    };
  }, [_timeout]);

  const clearError = () => setError(undefined);
  const clearSuccess = () => setSuccess(undefined);

  return {
    success,
    error,
    clearError,
    clearSuccess,
  };
}
