import React, { createContext, useEffect, useState } from "react";
import { ICheckList } from "@app-models";
import { Navigate, useLocation } from "react-router-dom";
import { CustomHookMessage } from "@app-types";
import { MESSAGES } from "../../config/constants";
import AppAlert from "../../components/alerts/AppAlert";
import { CheckListPageContextProps } from "@app-interfaces";
import AppLoader from "../../components/loader/AppLoader";
import { Stack } from "@mui/material";
import { Formik } from "formik";
import SectionForm from "../../components/forms/checkList/SectionForm";

interface ILocationState {
  checkLists: ICheckList[];
  checkListId: number;
}

export const CheckListPageContext =
  createContext<CheckListPageContextProps | null>(null);

const initialValues = {
  sections: [{ title: "" }],
};

function CheckListPage() {
  const [checkListId, setCheckListId] = useState<number>();
  const [checkLists, setCheckLists] = useState<ICheckList[]>([]);
  const [checkList, setCheckList] = useState<ICheckList>();
  const [error, setError] = useState<CustomHookMessage>();
  const [locationStateError, setLocationStateError] =
    useState<CustomHookMessage>();

  const location = useLocation();

  useEffect(() => {
    const state = location.state as ILocationState;

    if (state) {
      setCheckListId(state.checkListId);
      setCheckLists(state.checkLists);
      setCheckList(
        state.checkLists.find((value) => value.id == state.checkListId)
      );
    } else setLocationStateError({ message: MESSAGES.internalError });
  }, [location.state]);

  const handleSubmit = () => {
    //
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
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              <SectionForm />
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
      </CheckListPageContext.Provider>
    );
}

export default CheckListPage;
