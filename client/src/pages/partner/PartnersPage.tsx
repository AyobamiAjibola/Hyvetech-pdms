import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Formik, FormikHelpers } from 'formik';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import AppModal from '../../components/modal/AppModal';
import { Image, ImageBackdrop, ImageButton, ImageMarked, ImageSrc } from '../../components/buttons/imageButton';

import partnerModel, { ICreatePartnerModel } from '../../components/forms/models/partnerModel';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getStatesAndDistrictsAction } from '../../store/actions/miscellaneousActions';
import { createPartnerAction, getPartnersAction } from '../../store/actions/partnerActions';
import CreatePartnerForm from '../../components/forms/partner/CreatePartnerForm';

import partnerImg from '../../assets/images/partner2.jpg';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/generic';
import { IImageButtonData } from '@app-interfaces';
import { clearGetStatesAndDistrictsStatus } from '../../store/reducers/miscellaneousReducer';
import { clearCreatePartnerStatus, clearGetPartnersStatus } from '../../store/reducers/partnerReducer';
import AppLoader from '../../components/loader/AppLoader';

export default function PartnersPage() {
  const [createPartner, setCreatePartner] = useState<boolean>(false);
  const [images, setImages] = useState<IImageButtonData[]>([]);
  const [viewData, setViewData] = useState<any>([])
  // @ts-ignore
  const [searchTxt, setsearchTxt] = useState<any>("")
  const [filterTxt, setfilterTxt] = useState<any>("")

  const [filterBy, setfilterBy] = useState<any>("none")

  const miscReducer = useAppSelector(state => state.miscellaneousReducer);
  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    // by default auto-fill with initial
    setViewData(images)
  }, [images])

  useEffect(() => {
    if (miscReducer.getStatesAndDistrictsStatus === 'idle') {
      dispatch(getStatesAndDistrictsAction());
    }
  }, [dispatch, miscReducer.getStatesAndDistrictsStatus]);

  useEffect(() => {
    if (partnerReducer.getPartnersStatus === 'idle') {
      dispatch(getPartnersAction());
    }
  }, [dispatch, partnerReducer.getPartnersStatus]);

  useEffect(() => {
    if (partnerReducer.getPartnersStatus === 'completed') {
      // console.log(partnerReducer.partners, "partnerReducer.partners")

      setImages(
        partnerReducer.partners.map(partner => ({
          id: partner.id,
          url: partner.logo ? getImageUrl(partner.logo) : partnerImg,
          title: partner.name,
          width: '33.33%',
          partner
        })),
      );
    }
  }, [dispatch, partnerReducer.getPartnersStatus, partnerReducer.partners]);

  useEffect(() => {
    if (partnerReducer.createPartnerStatus === 'completed') {
      const partner = partnerReducer.partner;

      if (partner) {
        setImages(prevState => [
          ...prevState,
          {
            id: partner.id,
            url: partner.logo ? getImageUrl(partner.logo) : partnerImg,
            title: partner.name,
            width: '33.33%',
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

  function handleSubmit(values: ICreatePartnerModel, formikHelper: FormikHelpers<ICreatePartnerModel>) {
    dispatch(createPartnerAction(values));
    formikHelper.resetForm();
  }

  useEffect(() => {

    // filter logic
    if (filterBy == "none") {
      setViewData(images)
    } else {
      //
      if (filterBy == "state") {
        // filter by state
        const temp = images.filter(val => ((val.partner.contact.state).includes(filterTxt)));
        setViewData(temp)
      } else {
        // filter by category
        const temp = images.filter(val => ((val.partner.categories[0].name).includes(filterTxt)));
        setViewData(temp)
      }
    }
  }, [filterBy, filterTxt])

  return (
    <React.Fragment>
      <Box mb={1}>
        <Button onClick={handleOpenCreatePartner} variant="outlined" color="secondary">
          Create Partner
        </Button>
      </Box>

      <Box sx={{ minWidth: 300, width: '100%', marginBottom: 4 }}>
        <TextField
          style={{ width: '38%' }}
          placeholder="Search Partner"
          // @ts-ignore
          value={searchTxt}
          // @ts-ignore
          onChange={e => {

            // search logic
            const temp = images.filter(val => ((val.title).includes(e.target.value)));
            setViewData(temp)

            setsearchTxt(e.target.value)
          }}
        />

        <TextField
          style={{ width: '30%', marginLeft: '5%' }}
          placeholder="Filter, e.g Garage or Abuja"
          // @ts-ignore
          value={filterTxt}
          // @ts-ignore
          onChange={e => {
            const _val = e.target.value;
            setfilterTxt(_val)
          }}
        />

        <Select
          style={{ width: '23%', marginLeft: '1%', }}
          placeholder='Filter By'
          label='Filter-By'
          value={filterBy}
          onChange={(e) => {
            const _val = e.target.value;

            setfilterBy(_val)
          }}
        >
          <MenuItem value={'none'}>None</MenuItem>
          <MenuItem value={'category'}>Category</MenuItem>
          <MenuItem value={'state'}>State</MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%' }}>
        {viewData.map((image: any) => {
          console.log(image, "imageData")
          const active = image?.partner?.users[0]?.active || false;
          return (
            <ImageButton
              focusRipple
              onClick={() => navigate(`/partner/${image.id}`, { state: image })}
              key={image.title}
              style={{
                width: image.width,
              }}>
              <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
              <ImageBackdrop className="MuiImageBackdrop-root" />
              <Image>

                <div style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                }}>
                  <Button disabled variant="outlined" color="secondary">
                    {active ? 'Active' : 'In-Active'}
                  </Button>
                </div>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="inherit"
                  sx={{
                    position: 'relative',
                    p: 4,
                    pt: 2,
                    pb: theme => `calc(${theme.spacing(1)} + 6px)`,
                  }}>
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
            validationSchema={partnerModel.schema[0]}>
            <CreatePartnerForm createPartner={createPartner} />
          </Formik>
        }
        onClose={handleCloseCreatePartner}
      />
      <AppLoader show={partnerReducer.getPartnersStatus === 'loading'} />
    </React.Fragment>
  );
}
