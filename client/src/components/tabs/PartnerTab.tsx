import React, { SyntheticEvent, useRef, useState } from 'react';
import { Box, Slide, Tab, Tabs, tabsClasses, useTheme } from '@mui/material';
import a11yProps from './a11yProps';
import TabPanel from './TabPanel';
import { ITab } from '@app-interfaces';
import useAppDispatch from '../../hooks/useAppDispatch';
import {
  clearGetAppointmentsStatus,
  clearGetAppointmentStatus,
  clearUpdateAppointmentsStatus,
} from '../../store/reducers/appointmentReducer';
import { clearGetCustomersStatus } from '../../store/reducers/customerReducer';
import {
  clearCreateCheckListStatus,
  clearCreateJobCheckListStatus,
  clearDeleteCheckListStatus,
  clearGetCheckListsStatus,
  clearGetCheckListStatus,
  clearUpdateCheckListStatus,
  clearUpdateJobCheckListStatus,
} from '../../store/reducers/checkListReducer';
import {
  clearCreatePartnerKycStatus,
  clearCreatePartnerSettingsStatus,
  clearCreatePartnerStatus,
  clearDeletePartnerStatus,
  clearDeletePaymentPlanStatus,
  clearDeletePlanStatus,
  clearGetDriversFilterDataStatus,
  clearGetOwnersFilterDataStatus,
  clearGetPartnersStatus,
  clearGetPartnerStatus,
  clearGetPaymentPlansStatus,
  clearGetPlansStatus,
} from '../../store/reducers/partnerReducer';
import {
  clearDeleteDriverStatus,
  clearGetDriversStatus,
  clearGetDriverStatus,
} from '../../store/reducers/rideShareReducer';
import {
  clearGetCustomerVehicleSubscriptionStatus,
  clearGetDriverVehicleSubscriptionStatus,
  clearGetVehicleVINStatus,
} from '../../store/reducers/vehicleReducer';
import useAdmin from '../../hooks/useAdmin';

interface IProps {
  tabMenus: ITab[];
}

export default function PartnerTab(props: IProps) {
  const [tabValue, setTabValue] = useState(0);
  const { isSuperAdmin } = useAdmin()

  const containerRef = useRef(null);

  const theme = useTheme();

  const dispatch = useAppDispatch();

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    dispatch(clearGetAppointmentsStatus());
    dispatch(clearUpdateAppointmentsStatus());
    dispatch(clearGetAppointmentStatus());
    dispatch(clearCreateCheckListStatus());
    dispatch(clearDeleteCheckListStatus());
    dispatch(clearUpdateCheckListStatus());
    dispatch(clearGetCheckListStatus());
    dispatch(clearGetCheckListsStatus());
    dispatch(clearUpdateJobCheckListStatus());
    dispatch(clearCreateJobCheckListStatus());
    dispatch(clearGetCustomersStatus());
    dispatch(clearCreatePartnerStatus());
    dispatch(clearGetPartnersStatus());
    dispatch(clearGetPartnerStatus());
    dispatch(clearGetPaymentPlansStatus());
    dispatch(clearGetPlansStatus());
    dispatch(clearGetDriversFilterDataStatus());
    dispatch(clearCreatePartnerKycStatus());
    dispatch(clearCreatePartnerSettingsStatus());
    dispatch(clearDeletePaymentPlanStatus());
    dispatch(clearDeletePlanStatus());
    dispatch(clearDeletePartnerStatus());
    dispatch(clearGetOwnersFilterDataStatus());
    dispatch(clearGetDriverStatus());
    dispatch(clearDeleteDriverStatus());
    dispatch(clearGetDriversStatus());
    dispatch(clearGetCustomerVehicleSubscriptionStatus());
    dispatch(clearGetDriverVehicleSubscriptionStatus());
    dispatch(clearGetVehicleVINStatus());
  };
  const screenWidth = document.documentElement.clientWidth

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleChange} aria-label="icon label tabs example"
        variant={screenWidth <= 375 ? "scrollable" : undefined}
        scrollButtons
        centered={screenWidth > 375 ? true : false}
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: {sm: 0, xs: 0.3} },
          },
        }}
        allowScrollButtonsMobile
      >
        {props.tabMenus.map((tab, index) => {
          let admin = '';
          if(tab.name === 'Account Settings') admin = tab.name;
          return isSuperAdmin ? <Tab label={admin} key={index} {...a11yProps(index)} /> : <Tab label={tab.name} key={index} {...a11yProps(index)} />;
        })}
      </Tabs>

      {props.tabMenus.map((tab, index) => {
        return (
          <Slide key={index} direction="right" in={tabValue === index} container={containerRef.current}>
            <div>
              <TabPanel value={tabValue} index={index} dir={theme.direction}>
                <Box sx={{ pt: 6 }}>
                  <tab.Element />
                </Box>
              </TabPanel>
            </div>
          </Slide>
        );
      })}
    </Box>
  );
}
