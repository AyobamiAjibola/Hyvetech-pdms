import React, { createContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, DialogActions, DialogContentText, Divider, Grid, Paper, Stack } from "@mui/material";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import {
  deletePartnerAction,
  getPartnerAction,
  getPaymentPlansAction,
  getPlansAction,
} from "../../store/actions/partnerActions";
import { IPartner } from "@app-models";
import { ITab, PartnerPageContextProps } from "@app-interfaces";
import PartnerTab from "../../components/tabs/PartnerTab";
import { partnerDetailTabs } from "../../navigation/menus";
import {
  clearDeletePartnerStatus,
  clearGetPartnerStatus,
  clearGetPaymentPlansStatus,
  clearGetPlansStatus,
} from "../../store/reducers/partnerReducer";
import { GARAGE_CATEGORY, MESSAGES, RIDE_SHARE_CATEGORY } from "../../config/constants";
import useAdmin from "../../hooks/useAdmin";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import AppModal from "../../components/modal/AppModal";
import { CustomHookMessage } from "@app-types";
import AppAlert from "../../components/alerts/AppAlert";

export const PartnerPageContext = createContext<PartnerPageContextProps | null>(null);

function PartnerPage() {
  const [programme, setProgramme] = useState<string>("");
  const [modeOfService, setModeOfService] = useState<string>("");
  const [partner, setPartner] = useState<IPartner | null>(null);
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [id, setId] = useState<number>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();
  const [_timeout, _setTimeout] = useState<NodeJS.Timer>();

  const params = useParams();
  const navigate = useNavigate();
  const admin = useAdmin();

  const partnerId = useMemo(() => {
    if (admin.isTechAdmin && admin.user) {
      return admin.user.partnerId;
    }

    if (params.id) {
      return +(params.id as unknown as string);
    }
  }, [admin.isTechAdmin, admin.user, params.id]);

  const partnerReducer = useAppSelector((state) => state.partnerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (partnerReducer.getPartnerStatus === "idle") {
      if (partnerId) dispatch(getPartnerAction(partnerId));
    }
  }, [dispatch, partnerId, partnerReducer.getPartnerStatus]);

  useEffect(() => {
    if (partnerReducer.getPartnerStatus === "completed") {
      if (partnerReducer.partner) {
        const _partner = partnerReducer.partner;

        _partner.categories.forEach((category) => {
          if (category.name === RIDE_SHARE_CATEGORY) {
            setTabs(partnerDetailTabs.filter((tab) => tab.tag === RIDE_SHARE_CATEGORY));
          }
          if (category.name === GARAGE_CATEGORY) {
            setTabs(partnerDetailTabs.filter((tab) => tab.tag === GARAGE_CATEGORY));
          }
        });

        setPartner(_partner);
      }
    }
  }, [partnerReducer.getPartnerStatus, partnerReducer.partner]);

  useEffect(() => {
    if (partnerReducer.getPlansStatus === "idle") {
      if (partnerId) dispatch(getPlansAction(partnerId));
    }
  }, [dispatch, partnerId, partnerReducer.getPlansStatus]);

  useEffect(() => {
    if (partnerReducer.getPaymentPlansStatus === "idle") {
      if (partnerId) dispatch(getPaymentPlansAction(partnerId));
    }
  }, [dispatch, partnerId, partnerReducer.getPaymentPlansStatus]);

  useEffect(() => {
    if (partnerReducer.deletePartnerStatus === "completed") {
      setSuccess({ message: partnerReducer.deletePartnerSuccess });

      _setTimeout(setTimeout(() => navigate(-1), 1000));
    }
  }, [navigate, partnerReducer.deletePartnerStatus, partnerReducer.deletePartnerSuccess]);

  useEffect(() => {
    if (partnerReducer.deletePartnerStatus === "failed") {
      if (partnerReducer.deletePartnerError) setError({ message: partnerReducer.deletePartnerError });
    }
  }, [partnerReducer.deletePartnerStatus, partnerReducer.deletePartnerError]);

  useEffect(() => {
    return () => {
      dispatch(clearGetPartnerStatus());
      dispatch(clearGetPlansStatus());
      dispatch(clearGetPaymentPlansStatus());
      dispatch(clearDeletePartnerStatus());
      clearTimeout(_timeout);
    };
  }, [_timeout, dispatch]);

  const onDelete = (partnerId?: number) => {
    setId(partnerId);
    setShowDelete(true);
  };

  const handleDelete = () => {
    if (id) dispatch(deletePartnerAction(id));
    setShowDelete(false);
  };

  return (
    <React.Fragment>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={11}>
          <h1>{partner?.name}</h1>
        </Grid>
        <Grid item>
          <LoadingButton
            onClick={() => onDelete(partnerId)}
            endIcon={<Delete />}
            variant="outlined"
            color="error"
            size="small"
          >
            Delete
          </LoadingButton>
        </Grid>
      </Grid>
      <PartnerPageContext.Provider
        value={{
          programme,
          setProgramme,
          modeOfService,
          setModeOfService,
          partner,
          setPartner,
          showDelete,
          setShowDelete,
        }}
      >
        <Stack direction="column" spacing={5} divider={<Divider orientation="horizontal" flexItem />}>
          <Paper sx={{ p: 3 }}>
            <PartnerTab tabMenus={tabs} />
          </Paper>
        </Stack>
      </PartnerPageContext.Provider>
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
    </React.Fragment>
  );
}

export default PartnerPage;
