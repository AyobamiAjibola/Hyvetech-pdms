import { CustomHookMessage } from '@app-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearLoginStatus } from '../store/reducers/authenticationReducer';
import useAppDispatch from './useAppDispatch';
import useAppSelector from './useAppSelector';
import settings from '../config/settings';

export default function useLogin() {
  const [_timeout, _setTimeout] = useState<any>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();

  const navigate = useNavigate();

  const authReducer = useAppSelector(state => state.authenticationReducer);
  const dispatch = useAppDispatch();

  // const isLoggedIn = sessionStorage.getItem(settings.auth.admin);
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem(settings.auth.admin);
    if (!isLoggedIn) {
      navigate('/admin');
    } else navigate('/dashboard');
  }, [navigate]);

  useEffect(() => {
    if (authReducer.signingInStatus === 'completed') {
      setSuccess({ message: authReducer.signingInSuccess });

      //cookie.set(settings.auth.admin, authReducer.authToken);

      _setTimeout(
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000),
      );
    }
  }, [authReducer.authToken, authReducer.signingInStatus, authReducer.signingInSuccess, dispatch, navigate]);

  useEffect(() => {
    if (authReducer.signingInStatus === 'failed') {
      if (authReducer.signingInError) {
        setError({ message: authReducer.signingInError });
      }
      dispatch(clearLoginStatus());
    }
  }, [authReducer.signingInStatus, authReducer.signingInError, navigate, dispatch]);

  useEffect(() => {
    return () => {
      clearTimeout(_timeout);
    };
  }, [_timeout]);

  const clearError = () => setError(undefined);
  const clearSuccess = () => setSuccess(undefined);

  useEffect(() => {
    return () => {
      dispatch(clearLoginStatus());
    };
  }, [dispatch]);

  return {
    success,
    error,
    clearError,
    clearSuccess,
  };
}
