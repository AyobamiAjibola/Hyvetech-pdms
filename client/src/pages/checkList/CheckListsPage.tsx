import React, { createContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, Grid } from "@mui/material";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";

import { CheckListsPageContextProps, IImageButtonData } from "@app-interfaces";
import AppModal from "../../components/modal/AppModal";
import checkListModel, {
  ICheckListValues,
} from "../../components/forms/models/checkListModel";
import { IPartner } from "@app-models";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { getPartnersAction } from "../../store/actions/partnerActions";
import CheckListForm from "../../components/forms/checkList/CheckListForm";
import checkListImg from "../../assets/images/check-list2.png";
import {
  createCheckListAction,
  getCheckListsAction,
} from "../../store/actions/checkListActions";
import { CustomHookMessage } from "@app-types";
import AppAlert from "../../components/alerts/AppAlert";
import CheckListCard from "../../components/checkList/CheckListCard";
import {
  clearCreateCheckListStatus,
  clearGetCheckListsStatus,
} from "../../store/reducers/checkListReducer";

export const CheckListsPageContext =
  createContext<CheckListsPageContextProps | null>(null);

const { initialValues, schema } = checkListModel;

function CheckListsPage() {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showView, setShowView] = useState<boolean>(false);
  const [partners, setPartners] = useState<IPartner[]>([]);
  const [_checkLists, setCheckLists] = useState<IImageButtonData[]>([]);
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();

  const dispatch = useAppDispatch();
  const partnerReducer = useAppSelector((state) => state.partnerReducer);
  const checkListReducer = useAppSelector((state) => state.checkListReducer);

  const navigate = useNavigate();

  useEffect(() => {
    if (partnerReducer.getPartnersStatus === "idle") {
      dispatch(getPartnersAction());
    }
  }, [dispatch, partnerReducer.getPartnersStatus]);

  useEffect(() => {
    if (checkListReducer.getCheckListsStatus === "idle") {
      dispatch(getCheckListsAction());
    }
  }, [dispatch, checkListReducer.getCheckListsStatus]);

  useEffect(() => {
    if (partnerReducer.getPartnersStatus === "completed") {
      setPartners(partnerReducer.partners);
    }
  }, [partnerReducer.getPartnersStatus, partnerReducer.partners]);

  useEffect(() => {
    if (checkListReducer.getCheckListsStatus === "completed") {
      setCheckLists(
        checkListReducer.checkLists.map((checkList) => ({
          id: checkList.id,
          url: checkListImg,
          title: checkList.name,
          width: "33.33%",
        }))
      );
    }
  }, [checkListReducer.getCheckListsStatus, checkListReducer.checkLists]);

  useEffect(() => {
    if (checkListReducer.createCheckListStatus === "completed") {
      const checkLists = checkListReducer.checkLists;

      if (checkLists.length) {
        setCheckLists(
          checkLists.map((checkList) => ({
            id: checkList.id,
            url: checkListImg,
            title: checkList.name,
            width: "33.33%",
          }))
        );
      }
      setShowCreate(false);
      setSuccess({ message: checkListReducer.createCheckListSuccess });
      dispatch(clearCreateCheckListStatus());
      dispatch(clearGetCheckListsStatus());
    }
  }, [
    checkListReducer.createCheckListStatus,
    checkListReducer.checkLists,
    checkListReducer.createCheckListSuccess,
    dispatch,
  ]);

  useEffect(() => {
    if (checkListReducer.createCheckListStatus === "failed") {
      setShowCreate(false);
      if (checkListReducer.createCheckListError) {
        setError({ message: checkListReducer.createCheckListError });
      }
    }
    dispatch(clearCreateCheckListStatus());
    dispatch(clearGetCheckListsStatus());
  }, [
    checkListReducer.createCheckListStatus,
    checkListReducer.createCheckListError,
    dispatch,
  ]);

  useEffect(() => {
    return () => {
      dispatch(clearCreateCheckListStatus());
      dispatch(clearGetCheckListsStatus());
    };
  }, [dispatch]);

  const handleCreateCheckList = (values: ICheckListValues) => {
    dispatch(createCheckListAction(values));
  };

  return (
    <CheckListsPageContext.Provider
      value={{
        showCreate,
        setShowCreate,
        showEdit,
        setShowEdit,
        showDelete,
        setShowDelete,
        showView,
        setShowView,
        partners,
        setPartners,
      }}
    >
      <Box mb={3}>
        <Button
          onClick={() => setShowCreate(true)}
          variant="outlined"
          color="secondary"
        >
          Create CheckList
        </Button>
      </Box>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {_checkLists.map((checkList) => {
          return (
            <Grid item xs={12} md={3} key={checkList.id}>
              <CheckListCard
                onEdit={() => setShowEdit(true)}
                onNavigate={() =>
                  navigate(`/checkLists/${checkList.id}`, {
                    state: {
                      checkLists: checkListReducer.checkLists,
                      checkListId: checkList.id,
                    },
                  })
                }
                title={checkList.title}
                imgUrl={checkList.url}
                index={checkList.id}
              />
            </Grid>
          );
        })}
      </Grid>

      <AppModal
        fullWidth
        size="xs"
        show={showCreate}
        Content={
          <Formik
            initialValues={initialValues}
            onSubmit={handleCreateCheckList}
            validationSchema={schema}
          >
            <CheckListForm
              isSubmitting={
                checkListReducer.createCheckListStatus === "loading"
              }
            />
          </Formik>
        }
        onClose={() => setShowCreate(false)}
      />
      <AppAlert
        alertType="success"
        show={undefined !== success}
        message={success?.message}
        onClose={() => setSuccess(undefined)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
    </CheckListsPageContext.Provider>
  );
}

export default CheckListsPage;
