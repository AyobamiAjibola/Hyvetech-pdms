import React from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { blue } from "@mui/material/colors";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import settings from "../../../config/settings";
import HybridInspectionServiceModeTab from "../../tabs/HybridInspectionServiceModeTab";
import Location from "./Location";
import {
  DRIVE_IN_PLAN,
  HYBRID_PLAN,
  MOBILE_PLAN,
} from "../../../config/constants";

interface IServiceLocationProps {
  planCategory: string;
}

function ServiceLocation({ planCategory }: IServiceLocationProps) {
  const getLocation = (planCategory: string) => {
    switch (planCategory) {
      case MOBILE_PLAN:
        return (
          <ListItem alignItems="flex-start" sx={{ p: 0 }}>
            <Location />
          </ListItem>
        );
      case DRIVE_IN_PLAN:
        return (
          <ListItem alignItems="flex-start" sx={{ p: 0 }}>
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
        );
      case HYBRID_PLAN:
        return <HybridInspectionServiceModeTab />;
      default:
    }
  };

  return <List>{getLocation(planCategory)}</List>;
}

export default ServiceLocation;
