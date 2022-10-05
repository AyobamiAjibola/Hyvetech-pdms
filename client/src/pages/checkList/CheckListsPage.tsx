import React, { createContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { Formik } from "formik";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { CheckListPageContextProps, IImageButtonData } from "@app-interfaces";
import AppModal from "../../components/modal/AppModal";
import checkListModel, {
  ICheckListValues,
} from "../../components/forms/models/checkListModel";
import { IPartner } from "@app-models";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { getPartnersAction } from "../../store/actions/partnerActions";
import CheckListForm from "../../components/forms/checkList/CheckListForm";
import checkListImg from "../../assets/images/check-list.jpeg";
import {
  Image,
  ImageBackdrop,
  ImageButton,
  ImageMarked,
  ImageSrc,
} from "../../components/buttons/imageButton";
import {
  createCheckListAction,
  getCheckListsAction,
} from "../../store/actions/checkListActions";
import { CustomHookMessage } from "@app-types";
import AppAlert from "../../components/alerts/AppAlert";

export const CheckListsPageContext =
  createContext<CheckListPageContextProps | null>(null);

const { initialValues, schema } = checkListModel;

function CheckListsPage() {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showView, setShowView] = useState<boolean>(false);
  const [partners, setPartners] = useState<IPartner[]>([]);
  const [images, setImages] = useState<IImageButtonData[]>([]);
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
      setImages(
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
        setImages(
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
    }
  }, [
    checkListReducer.createCheckListStatus,
    checkListReducer.checkLists,
    checkListReducer.createCheckListSuccess,
  ]);

  useEffect(() => {
    if (checkListReducer.createCheckListStatus === "failed") {
      setShowCreate(false);
      if (checkListReducer.createCheckListError) {
        setError({ message: checkListReducer.createCheckListError });
      }
    }
  }, [
    checkListReducer.createCheckListStatus,
    checkListReducer.createCheckListError,
  ]);

  const handleCreateCheckList = (values: ICheckListValues) => {
    console.log(values);

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
      <Box mb={1}>
        <Button
          onClick={() => setShowCreate(true)}
          variant="outlined"
          color="secondary"
        >
          Create CheckList
        </Button>
      </Box>
      <Box
        sx={{ display: "flex", flexWrap: "wrap", minWidth: 300, width: "100%" }}
      >
        {images.map((image) => {
          return (
            <ImageButton
              focusRipple
              onClick={() =>
                navigate(`/checkLists/${image.id}`, { state: image })
              }
              key={image.title}
              style={{
                width: image.width,
              }}
            >
              <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
              <ImageBackdrop className="MuiImageBackdrop-root" />
              <Image>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="inherit"
                  sx={{
                    position: "relative",
                    p: 4,
                    pt: 2,
                    pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                  }}
                >
                  {image.title}
                  <ImageMarked className="MuiImageMarked-root" />
                </Typography>
              </Image>
            </ImageButton>
          );
        })}
      </Box>
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
