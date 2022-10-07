import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Formik, FormikHelpers } from "formik";
import { Button } from "@mui/material";
import AppModal from "../../components/modal/AppModal";
import {
  Image,
  ImageBackdrop,
  ImageButton,
  ImageMarked,
  ImageSrc,
} from "../../components/buttons/imageButton";

import partnerModel, {
  ICreatePartnerModel,
} from "../../components/forms/models/partnerModel";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getStatesAndDistrictsAction } from "../../store/actions/miscellaneousActions";
import {
  createPartnerAction,
  getPartnersAction,
} from "../../store/actions/partnerActions";
import CreatePartnerForm from "../../components/forms/partner/CreatePartnerForm";

import partnerImg from "../../assets/images/partner2.jpg";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/generic";
import { IImageButtonData } from "@app-interfaces";
import { clearGetStatesAndDistrictsStatus } from "../../store/reducers/miscellaneousReducer";
import {
  clearCreatePartnerStatus,
  clearGetPartnersStatus,
} from "../../store/reducers/partnerReducer";

export default function PartnersPage() {
  const [createPartner, setCreatePartner] = useState<boolean>(false);
  const [images, setImages] = useState<IImageButtonData[]>([]);

  const miscReducer = useAppSelector((state) => state.miscellaneousReducer);
  const partnerReducer = useAppSelector((state) => state.partnerReducer);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (miscReducer.getStatesAndDistrictsStatus === "idle") {
      dispatch(getStatesAndDistrictsAction());
    }
  }, [dispatch, miscReducer.getStatesAndDistrictsStatus]);

  useEffect(() => {
    if (partnerReducer.getPartnersStatus === "idle") {
      dispatch(getPartnersAction());
    }
  }, [dispatch, partnerReducer.getPartnersStatus]);

  useEffect(() => {
    if (partnerReducer.getPartnersStatus === "completed") {
      setImages(
        partnerReducer.partners.map((partner) => ({
          id: partner.id,
          url: partner.logo ? getImageUrl(partner.logo) : partnerImg,
          title: partner.name,
          width: "33.33%",
        }))
      );
    }
  }, [dispatch, partnerReducer.getPartnersStatus, partnerReducer.partners]);

  useEffect(() => {
    if (partnerReducer.createPartnerStatus === "completed") {
      const partner = partnerReducer.partner;

      if (partner) {
        setImages((prevState) => [
          ...prevState,
          {
            id: partner.id,
            url: partner.logo ? getImageUrl(partner.logo) : partnerImg,
            title: partner.name,
            width: "33.33%",
          },
        ]);
      }
      setCreatePartner(false);
    }
  }, [partnerReducer.createPartnerStatus, partnerReducer.partner]);

  useEffect(() => {
    return () => {
      dispatch(clearGetStatesAndDistrictsStatus());
      dispatch(clearGetPartnersStatus());
      dispatch(clearCreatePartnerStatus());
    };
  }, [dispatch]);

  const handleOpenCreatePartner = () => {
    setCreatePartner(true);
  };

  const handleCloseCreatePartner = () => {
    setCreatePartner(false);
  };

  function handleSubmit(
    values: ICreatePartnerModel,
    formikHelper: FormikHelpers<ICreatePartnerModel>
  ) {
    dispatch(createPartnerAction(values));
    formikHelper.resetForm();
  }

  return (
    <React.Fragment>
      <Box mb={1}>
        <Button
          onClick={handleOpenCreatePartner}
          variant="outlined"
          color="secondary"
        >
          Create Partner
        </Button>
      </Box>
      <Box
        sx={{ display: "flex", flexWrap: "wrap", minWidth: 300, width: "100%" }}
      >
        {images.map((image) => {
          return (
            <ImageButton
              focusRipple
              onClick={() => navigate(`/partner/${image.id}`, { state: image })}
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
        size="md"
        fullWidth
        show={createPartner}
        Content={
          <Formik
            initialValues={partnerModel.initialValues}
            onSubmit={handleSubmit}
            validationSchema={partnerModel.schema}
          >
            <CreatePartnerForm createPartner={createPartner} />
          </Formik>
        }
        onClose={handleCloseCreatePartner}
      />
    </React.Fragment>
  );
}
