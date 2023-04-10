import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormGroup, Grid, TextField } from '@mui/material';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import {
  getPartnerAction,
} from '../../store/actions/partnerActions';
import { IPartner } from '@app-models';
import { PartnerPageContextProps } from '@app-interfaces';
import {
  clearGetPartnerStatus
} from '../../store/reducers/partnerReducer';
import useAdmin from '../../hooks/useAdmin';
import { ArrowBackIosNew } from '@mui/icons-material';
import settings from '../../config/settings';

export const PartnerPageContext = createContext<PartnerPageContextProps | null>(null);

function WorkshopPage() {
  const [partner, setPartner] = useState<IPartner | null>(null);
  const [_timeout, _setTimeout] = useState<NodeJS.Timer>();

  const params = useParams();
  const admin = useAdmin();

  const partnerId = useMemo(() => {
    return +(params.id as unknown as string) || admin.user?.partnerId;
  }, [admin.user, params.id]);

  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (partnerReducer.getPartnerStatus === 'idle') {
      if (partnerId) dispatch(getPartnerAction(partnerId));
    }
  }, [dispatch, partnerId, partnerReducer.getPartnerStatus]);

  useEffect(() => {
    if (partnerReducer.getPartnerStatus === 'completed') {
      if (partnerReducer.partner) {
        const _partner = partnerReducer.partner;

        setPartner(_partner);
      }
    }
  }, [partnerReducer.getPartnerStatus, partnerReducer.partner])

  useEffect(() => {
    return () => {
      dispatch(clearGetPartnerStatus());
    };
  }, [dispatch]);

  return (
    <React.Fragment>
      <Grid container item
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Grid container xs={10} mb={4}
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Grid>
            <ArrowBackIosNew
              onClick={() => window.history.back()}
              style={{ position: 'absolute', cursor: 'pointer' }}
            />
          </Grid>
          <Grid item xs>
            <img
              alt=""
              width="10%"
              crossOrigin="anonymous"
              src={`${settings.api.baseURL}/${partner?.logo}`}
            />
          </Grid>

      </Grid>

        <Grid container spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          xs={10}
          mt={4}
        >
          <Grid item xs={12} md={6}>
            <FormGroup>
              <TextField
                value={partner?.name}
                fullWidth
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                label={'Company Full Name'}
                InputProps={{
                  readOnly: true
                }}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <TextField
                value={partner?.nameOfDirector}
                fullWidth
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                label={'Name of Director'}
                InputProps={{
                  readOnly: true
                }}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <TextField
                value={partner?.nameOfManager}
                fullWidth
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                label={'Name of Manager'}
                InputProps={{
                  readOnly: true
                }}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <TextField
                value={partner?.cac}
                fullWidth
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                label={'CAC'}
                InputProps={{
                  readOnly: true
                }}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <TextField
                value={partner?.vatNumber}
                fullWidth
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                label={'VAT Number'}
                InputProps={{
                  readOnly: true
                }}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <TextField
                value={partner?.name}
                fullWidth
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                label={'Workshop Address'}
                InputProps={{
                  readOnly: true
                }}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <TextField
                value={partner?.totalStaff}
                fullWidth
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                label={'Total Staff'}
                InputProps={{
                  readOnly: true
                }}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <TextField
                value={partner?.totalTechnicians}
                fullWidth
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                label={'Number of Technician'}
                InputProps={{
                  readOnly: true
                }}
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Grid>

    </React.Fragment>
  );
}

export default WorkshopPage;
