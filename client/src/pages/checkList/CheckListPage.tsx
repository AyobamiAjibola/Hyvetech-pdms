import React, { createContext, useEffect, useState } from "react";
import { ICheckList } from "@app-models";
import { Navigate, useLocation } from "react-router-dom";
import { CheckListType, CustomHookMessage } from "@app-types";
import { MESSAGES } from "../../config/constants";
import AppAlert from "../../components/alerts/AppAlert";
import { CheckListPageContextProps } from "@app-interfaces";
import AppLoader from "../../components/loader/AppLoader";
import { Stack } from "@mui/material";
import { Formik } from "formik";
import SectionForm from "../../components/forms/checkList/SectionForm";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import {
  getCheckListAction,
  updateCheckListAction,
} from "../../store/actions/checkListActions";
import checkListSectionModel from "../../components/forms/models/checkListSectionModel";
import {
  clearGetCheckListsStatus,
  clearUpdateCheckListStatus,
} from "../../store/reducers/checkListReducer";

interface ILocationState {
  checkLists: ICheckList[];
  checkListId: number;
}

export const CheckListPageContext =
  createContext<CheckListPageContextProps | null>(null);

const { initialValues } = checkListSectionModel;

function CheckListPage() {
  const [checkListId, setCheckListId] = useState<number>();
  const [checkLists, setCheckLists] = useState<ICheckList[]>([]);
  const [checkList, setCheckList] = useState<ICheckList>();
  const [error, setError] = useState<CustomHookMessage>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [locationStateError, setLocationStateError] =
    useState<CustomHookMessage>();
  const [currentValues, setCurrentValues] =
    useState<CheckListType>(initialValues);

  const checkListReducer = useAppSelector((state) => state.checkListReducer);
  const dispatch = useAppDispatch();

  const location = useLocation();

  useEffect(() => {
    const state = location.state as ILocationState;

    if (state) {
      setCheckListId(state.checkListId);
      setCheckLists(state.checkLists);
      setCheckList(
        state.checkLists.find((value) => value.id == state.checkListId)
      );
      dispatch(getCheckListAction(state.checkListId));
    } else setLocationStateError({ message: MESSAGES.internalError });
  }, [location.state, dispatch]);

  useEffect(() => {
    if (checkListReducer.getCheckListStatus === "completed") {
      if (checkListReducer.checkList) {
        const checkList =
          checkListReducer.checkList as unknown as CheckListType;

        setCurrentValues((prevState) => ({
          ...prevState,
          sections: JSON.parse(JSON.stringify(checkList.sections)),
        }));
      }
    }
  }, [checkListReducer.getCheckListStatus, checkListReducer.checkList]);

  useEffect(() => {
    if (checkListReducer.updateCheckListStatus === "completed") {
      if (checkListReducer.checkList) {
        const checkList =
          checkListReducer.checkList as unknown as CheckListType;

        setCurrentValues((prevState) => ({
          ...prevState,
          sections: JSON.parse(JSON.stringify(checkList.sections)),
        }));
      }
      setSuccess({ message: checkListReducer.updateCheckListSuccess });
    }
  }, [
    checkListReducer.updateCheckListStatus,
    checkListReducer.checkList,
    checkListReducer.updateCheckListSuccess,
  ]);

  useEffect(() => {
    if (checkListReducer.updateCheckListStatus === "failed") {
      if (checkListReducer.updateCheckListError) {
        setError({ message: checkListReducer.updateCheckListError });
      }
    }
  }, [
    checkListReducer.updateCheckListStatus,
    checkListReducer.updateCheckListError,
  ]);

  useEffect(() => {
    return () => {
      dispatch(clearGetCheckListsStatus());
      dispatch(clearUpdateCheckListStatus());
      setCurrentValues(initialValues);
    };
  }, [dispatch]);

  const handleSubmit = (values: CheckListType) => {
    if (undefined === checkListId)
      return setError({ message: MESSAGES.internalError });

    const data = JSON.stringify(values);

    dispatch(updateCheckListAction({ id: checkListId, data }));
  };

  if (locationStateError) {
    return (
      <Navigate
        to={{ pathname: "/error" }}
        state={{ message: locationStateError.message }}
      />
    );
  } else
    return (
      <CheckListPageContext.Provider
        value={{ checkListId, setCheckListId, checkLists, setCheckLists }}
      >
        {checkList ? (
          <Stack spacing={3}>
            <h1>{checkList.name}</h1>
            <Formik
              initialValues={currentValues}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              <SectionForm
                isSubmitting={
                  checkListReducer.updateCheckListStatus === "loading"
                }
              />
            </Formik>
          </Stack>
        ) : (
          <AppLoader show={undefined === checkList} />
        )}
        <AppAlert
          alertType="error"
          show={undefined !== error}
          message={error?.message}
          onClose={() => setError(undefined)}
        />
        <AppAlert
          alertType="success"
          show={undefined !== success}
          message={success?.message}
          onClose={() => setSuccess(undefined)}
        />
      </CheckListPageContext.Provider>
    );
}

export default CheckListPage;
