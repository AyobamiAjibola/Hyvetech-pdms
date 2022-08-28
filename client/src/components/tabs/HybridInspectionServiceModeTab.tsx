import * as React from "react";
import { useContext } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import a11yProps from "./a11yProps";
import { Avatar, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { blue } from "@mui/material/colors";

import settings from "../../config/settings";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Location from "../forms/booking/Location";
import { AppContext } from "../../context/AppContextProvider";
import { AppContextProperties } from "@app-interfaces";
import TabPanel from "./TabPanel";

export default function HybridInspectionServiceModeTab() {
  const {
    planTab,
    setPlanTab,
    showTime,
    setShowTime,
    checkedSlot,
    setCheckedSlot,
    mobileDate,
    setMobileDate,
    showBookingBtn,
    setShowBookingBtn,
  } = useContext(AppContext) as AppContextProperties;

  const _handleChange = (event: any, newValue: number) => {
    setPlanTab(newValue);
    if (showBookingBtn) setShowBookingBtn(!showBookingBtn);
    if (mobileDate) setMobileDate(!mobileDate);
    if (checkedSlot) setCheckedSlot(!checkedSlot);
    if (showTime) setShowTime(!showTime);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={planTab} onChange={_handleChange}>
        <Tab label="Mobile" {...a11yProps(planTab)} />
        <Tab label="Drive-in" {...a11yProps(planTab)} />
      </Tabs>
      <TabPanel value={planTab} index={0}>
        <ListItem alignItems="flex-start" sx={{ p: 0, my: 2 }}>
          <Location />
        </ListItem>
      </TabPanel>
      <TabPanel value={planTab} index={1}>
        <ListItem alignItems="flex-start" sx={{ p: 0, my: 2 }}>
          <ListItemIcon>
            <Avatar sx={{ bgcolor: blue[300] }}>
              <LocationOnIcon />
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={settings.office.primary}
            secondary={settings.office.secondary}
          />
        </ListItem>
      </TabPanel>
    </Box>
  );
}
