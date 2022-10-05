import useAppSelector from "./useAppSelector";
import useAppDispatch from "./useAppDispatch";
import { useEffect } from "react";
import cookie from "../utils/cookie";
import settings from "../config/settings";
import { useNavigate } from "react-router-dom";
import { signOutAction } from "../store/actions/authenicationActions";
import { clearLogoutStatus } from "../store/reducers/authenticationReducer";

export default function useLogout() {
  const authReducer = useAppSelector((state) => state.authenticationReducer);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (authReducer.signOutStatus === "completed") {
      cookie.remove(settings.auth.admin);
      localStorage.clear();
      navigate("/");
    }
    dispatch(clearLogoutStatus());
  }, [authReducer.signOutStatus, dispatch, navigate]);

  const handleLogout = () => dispatch(signOutAction());

  return { handleLogout };
}
