import { CustomHookMessage } from "@app-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import settings from "../config/settings";
import { clearLoginStatus } from "../store/reducers/authenticationReducer";
import cookie from "../utils/cookie";
import useAppDispatch from "./useAppDispatch";
import useAppSelector from "./useAppSelector";

export default function useLogin() {
  const [_timeout, _setTimeout] = useState<any>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();

  const navigate = useNavigate();

  const authReducer = useAppSelector((state) => state.authenticationReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const isLoggedIn = cookie.get(settings.auth.admin);

    if (!isLoggedIn) {
      navigate("/");
    } else navigate("/dashboard");
  }, [navigate]);

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
  }, [authReducer.authToken, authReducer.signingInStatus, authReducer.signingInSuccess, dispatch, navigate]);

  useEffect(() => {
    if (authReducer.signingInStatus === "failed") {
      if (authReducer.signingInError) {
        setError({ message: authReducer.signingInError });
      }
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
