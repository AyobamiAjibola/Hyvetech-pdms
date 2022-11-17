import React, { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { IBrands, IGarageSettings, IKycValues, IWorkingHours } from "../../forms/models/partnerModel";
import GarageKycForm from "../../forms/partner/GarageKYCForm";
import { PartnerPageContext } from "../../../pages/partner/PartnerPage";
import { PartnerPageContextProps } from "@app-interfaces";
import useAppDispatch from "../../../hooks/useAppDispatch";
import useAppSelector from "../../../hooks/useAppSelector";
import { MESSAGES } from "../../../config/constants";
import { createPartnerKycAction, createPartnerSettingsAction } from "../../../store/actions/partnerActions";
import { CustomHookMessage } from "@app-types";
import AppAlert from "../../alerts/AppAlert";
import GarageSettingsForm from "../../forms/partner/GarageSettingsForm";
import { clearCreatePartnerKycStatus, clearCreatePartnerSettingsStatus } from "../../../store/reducers/partnerReducer";

function GarageProfileAndSetting() {
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();
  const [kycValues, setKycValues] = useState<IKycValues>({
    cac: "",
    name: "",
    nameOfDirector: "",
    nameOfManager: "",
    vatNumber: "",
    workshopAddress: "",
  });
  const [settingsValues, setSettingsValues] = useState<IGarageSettings>({
    accountName: "",
    accountNumber: "",
    bankName: "",
    googleMap: "",
    logo: "",
    phone: "",
    totalStaff: "",
    totalTechnicians: "",
    brands: [{ name: "", description: "" }],
    workingHours: [{ days: [], from: new Date(), to: new Date() }],
  });

  const { partner } = useContext(PartnerPageContext) as PartnerPageContextProps;

  const partnerReducer = useAppSelector((state) => state.partnerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (partner) {
      setKycValues((prevState) => ({
        ...prevState,
        cac: partner.cac ? partner.cac : "",
        name: partner.name ? partner.name : "",
        nameOfDirector: partner.nameOfDirector ? partner.nameOfDirector : "",
        nameOfManager: partner.nameOfManager ? partner.nameOfManager : "",
        vatNumber: partner.vatNumber ? partner.vatNumber : "",
        workshopAddress: partner.contact.address ? partner.contact.address : "",
      }));

      const workingHours = partner.workingHours as unknown as IWorkingHours[];

      const brands = partner.brands as unknown as IBrands[];

      setSettingsValues((prevState) => ({
        ...prevState,
        logo: partner.logo ? partner.logo : "",
        accountName: partner.accountName ? partner.accountName : "",
        googleMap: partner.googleMap ? partner.googleMap : "",
        accountNumber: partner.accountNumber ? partner.accountNumber : "",
        bankName: partner.bankName ? partner.bankName : "",
        phone: partner.phone ? partner.phone : "",
        totalStaff: partner.totalStaff ? `${partner.totalStaff}` : "",
        totalTechnicians: partner.totalTechnicians ? `${partner.totalTechnicians}` : "",
        workingHours: workingHours ? workingHours : [{ days: [], from: new Date(), to: new Date() }],
        brands: brands ? brands : [{ name: "", description: "" }],
      }));
    }
  }, [partner]);

  useEffect(() => {
    if (partnerReducer.createPartnerKycStatus === "completed") {
      setSuccess({ message: partnerReducer.createPartnerKycSuccess });
    }
  }, [partnerReducer.createPartnerKycSuccess, partnerReducer.createPartnerKycStatus]);

  useEffect(() => {
    if (partnerReducer.createPartnerKycStatus === "failed") {
      if (partnerReducer.createPartnerKycError) {
        setError({ message: partnerReducer.createPartnerKycError });
      }
    }
  }, [partnerReducer.createPartnerKycError, partnerReducer.createPartnerKycStatus]);

  useEffect(() => {
    if (partnerReducer.createPartnerSettingsStatus === "completed") {
      setSuccess({ message: partnerReducer.createPartnerSettingsSuccess });
    }
  }, [partnerReducer.createPartnerSettingsSuccess, partnerReducer.createPartnerSettingsStatus]);

  useEffect(() => {
    if (partnerReducer.createPartnerSettingsStatus === "failed") {
      if (partnerReducer.createPartnerSettingsError) {
        setError({ message: partnerReducer.createPartnerSettingsError });
      }
    }
  }, [partnerReducer.createPartnerSettingsError, partnerReducer.createPartnerSettingsStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearCreatePartnerKycStatus());
      dispatch(clearCreatePartnerSettingsStatus());
    };
  }, [dispatch]);

  const handleSubmitKyc = (values: IKycValues) => {
    if (partner) {
      dispatch(createPartnerKycAction({ partnerId: partner.id, data: values }));
    } else throw new Error(MESSAGES.internalError);
  };

  const handleSubmitSettings = (values: IGarageSettings) => {
    if (partner) {
      dispatch(createPartnerSettingsAction({ partnerId: partner.id, data: values }));
    } else throw new Error(MESSAGES.internalError);
  };

  return (
    <React.Fragment>
      <Stack spacing={5} divider={<Divider orientation="horizontal" />}>
        <Box>
          <Typography variant="h6">KYC</Typography>
          <Box sx={{ my: 1 }} />
          <Formik onSubmit={handleSubmitKyc} initialValues={kycValues} enableReinitialize>
            <GarageKycForm isSubmitting={partnerReducer.createPartnerKycStatus === "loading"} />
          </Formik>
        </Box>
        <Box>
          <Formik onSubmit={handleSubmitSettings} initialValues={settingsValues} enableReinitialize>
            <GarageSettingsForm isSubmitting={partnerReducer.createPartnerKycStatus === "loading"} />
          </Formik>
        </Box>
      </Stack>
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

export default GarageProfileAndSetting;
