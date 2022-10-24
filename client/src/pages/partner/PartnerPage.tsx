import React, { createContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Divider, Paper, Stack } from "@mui/material";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import {
  getPartnerAction,
  getPaymentPlansAction,
  getPlansAction,
} from "../../store/actions/partnerActions";
import { IPartner } from "@app-models";
import { ITab, PartnerPageContextProps } from "@app-interfaces";
import PartnerTab from "../../components/tabs/PartnerTab";
import { partnerDetailTabs } from "../../navigation/menus";
import {
  clearGetPartnerStatus,
  clearGetPaymentPlansStatus,
  clearGetPlansStatus,
} from "../../store/reducers/partnerReducer";
import { GARAGE_CATEGORY, RIDE_SHARE_CATEGORY } from "../../config/constants";
import useAdmin from "../../hooks/useAdmin";

export const PartnerPageContext = createContext<PartnerPageContextProps | null>(
  null
);

function PartnerPage() {
  const [programme, setProgramme] = useState<string>("");
  const [modeOfService, setModeOfService] = useState<string>("");
  const [partner, setPartner] = useState<IPartner | null>(null);
  const [tabs, setTabs] = useState<ITab[]>([]);

  const params = useParams();
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
            setTabs(
              partnerDetailTabs.filter((tab) => tab.tag === RIDE_SHARE_CATEGORY)
            );
          }
          if (category.name === GARAGE_CATEGORY) {
            setTabs(
              partnerDetailTabs.filter((tab) => tab.tag === GARAGE_CATEGORY)
            );
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
    return () => {
      dispatch(clearGetPartnerStatus());
      dispatch(clearGetPlansStatus());
      dispatch(clearGetPaymentPlansStatus());
    };
  }, [dispatch]);

  return (
    <React.Fragment>
      <h1>{partner?.name}</h1>
      <PartnerPageContext.Provider
        value={{
          programme,
          setProgramme,
          modeOfService,
          setModeOfService,
          partner,
          setPartner,
        }}
      >
        <Stack
          direction="column"
          spacing={5}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          <Paper sx={{ p: 3 }}>
            <PartnerTab tabMenus={tabs} />
          </Paper>
        </Stack>
      </PartnerPageContext.Provider>
    </React.Fragment>
  );
}

export default PartnerPage;
