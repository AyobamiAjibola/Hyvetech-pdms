import React, { SyntheticEvent, useRef, useState } from 'react';
import { Box, Slide, Tab, Tabs, useTheme } from '@mui/material';
import a11yProps from './a11yProps';
import TabPanel from './TabPanel';
import { ITab } from '@app-interfaces';

interface IProps {
  tabMenus: ITab[];
}

function CustomerTab(props: IProps) {
  const [tabValue, setTabValue] = useState(0);

  const containerRef = useRef(null);

  const theme = useTheme();

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs centered value={tabValue} onChange={handleChange} aria-label="icon label tabs example">
        {props.tabMenus.map((tab, index) => {
          return <Tab label={tab.name} key={index} {...a11yProps(index)} />;
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

export default CustomerTab;
