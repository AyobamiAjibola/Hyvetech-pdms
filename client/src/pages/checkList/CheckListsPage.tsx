import React, { createContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, DialogActions, DialogContentText, Grid } from "@mui/material";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";

import { CheckListsPageContextProps, IImageButtonData } from "@app-interfaces";
import AppModal from "../../components/modal/AppModal";
import checkListModel, { ICheckListValues } from "../../components/forms/models/checkListModel";
import { IPartner } from "@app-models";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { getPartnersAction } from "../../store/actions/partnerActions";
import CheckListForm from "../../components/forms/checkList/CheckListForm";
import checkListImg from "../../assets/images/check-list2.png";
import {
  createCheckListAction,
  deleteCheckListAction,
  getCheckListsAction,
  updateCheckListAction,
} from "../../store/actions/checkListActions";
import { CustomHookMessage } from "@app-types";
import AppAlert from "../../components/alerts/AppAlert";
import CheckListCard from "../../components/checkList/CheckListCard";
import {
  clearCreateCheckListStatus,
  clearGetCheckListsStatus,
  clearUpdateCheckListStatus,
} from "../../store/reducers/checkListReducer";
import AppLoader from "../../components/loader/AppLoader";
import { MESSAGES } from "../../config/constants";

export const CheckListsPageContext = createContext<CheckListsPageContextProps | null>(null);

function CheckListsPage() {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showView, setShowView] = useState<boolean>(false);
  const [partners, setPartners] = useState<IPartner[]>([]);
  const [_checkLists, setCheckLists] = useState<IImageButtonData[]>([]);
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();
  const [id, setId] = useState<number>();
  const [initialValues, setInitialValues] = useState<ICheckListValues>(checkListModel.initialValues);

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
    if (checkListReducer.updateCheckListStatus === "completed") {
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
      setShowEdit(false);
      setSuccess({ message: checkListReducer.updateCheckListSuccess });
      dispatch(clearUpdateCheckListStatus());
      dispatch(clearGetCheckListsStatus());
    }
  }, [
    checkListReducer.updateCheckListStatus,
    checkListReducer.checkLists,
    checkListReducer.updateCheckListSuccess,
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
  }, [checkListReducer.createCheckListStatus, checkListReducer.createCheckListError, dispatch]);

  useEffect(() => {
    if (checkListReducer.updateCheckListStatus === "failed") {
      setShowEdit(false);
      if (checkListReducer.updateCheckListError) {
        setError({ message: checkListReducer.updateCheckListError });
      }
    }
    dispatch(clearCreateCheckListStatus());
    dispatch(clearGetCheckListsStatus());
  }, [checkListReducer.updateCheckListStatus, checkListReducer.updateCheckListError, dispatch]);

  useEffect(() => {
    if (checkListReducer.deleteCheckListStatus === "failed") {
      setShowEdit(false);
      if (checkListReducer.deleteCheckListError) {
        setError({ message: checkListReducer.deleteCheckListError });
      }
    }
    dispatch(clearCreateCheckListStatus());
    dispatch(clearGetCheckListsStatus());
  }, [checkListReducer.deleteCheckListStatus, checkListReducer.deleteCheckListError, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearCreateCheckListStatus());
      dispatch(clearGetCheckListsStatus());
    };
  }, [dispatch]);

  const handleCreateCheckList = (values: ICheckListValues) => {
    dispatch(createCheckListAction(values));
  };

  const onEdit = (checkListId: number) => {
    const checkList = checkListReducer.checkLists.find((value) => value.id === checkListId);

    if (checkList) {
      const partners = checkList.partners.map((value) => `${value.id}`);

      setId(checkListId);
      setInitialValues((prevState) => ({
        ...prevState,
        checkList: checkList.name ? checkList.name : "",
        description: checkList.description ? checkList.description : "",
        partners,
      }));
      setShowEdit(true);
    }
  };

  const onDelete = (checkListId: number) => {
    setId(checkListId);
    setShowDelete(true);
  };

  const handleUpdateCheckList = (values: ICheckListValues) => {
    dispatch(updateCheckListAction({ data: values, id }));
  };

  const handleDelete = () => {
    if (id) dispatch(deleteCheckListAction(id));
    setShowDelete(false);
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
        <Button onClick={() => setShowCreate(true)} variant="outlined" color="secondary">
          Create CheckList
        </Button>
      </Box>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {_checkLists.map((checkList) => {
          return (
            <Grid item xs={12} md={3} key={checkList.id}>
              <CheckListCard
                onEdit={() => onEdit(checkList.id)}
                onDelete={() => onDelete(checkList.id)}
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
        size="sm"
        show={showCreate}
        Content={
          <Formik
            initialValues={initialValues}
            onSubmit={handleCreateCheckList}
            validationSchema={checkListModel.schema}
          >
            <CheckListForm isSubmitting={checkListReducer.createCheckListStatus === "loading"} />
          </Formik>
        }
        onClose={() => setShowCreate(false)}
      />
      <AppModal
        fullWidth
        size="sm"
        show={showEdit}
        Content={
          <Formik
            initialValues={initialValues}
            onSubmit={handleUpdateCheckList}
            validationSchema={checkListModel.schema}
            enableReinitialize
          >
            <CheckListForm isSubmitting={checkListReducer.updateCheckListStatus === "loading"} />
          </Formik>
        }
        onClose={() => setShowEdit(false)}
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
      <AppModal
        fullWidth
        show={showDelete}
        Content={<DialogContentText>{MESSAGES.cancelText}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button onClick={() => setShowDelete(false)}>Disagree</Button>
            <Button onClick={handleDelete}>Agree</Button>
          </DialogActions>
        }
        onClose={() => setShowDelete(false)}
      />
      <AppLoader show={checkListReducer.getCheckListsStatus === "loading"} />
      <AppLoader show={checkListReducer.deleteCheckListStatus === "loading"} />
    </CheckListsPageContext.Provider>
  );
}

export default CheckListsPage;
