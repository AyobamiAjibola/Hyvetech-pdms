import React, { createContext, useEffect, useState } from 'react';
import { IRideShareDriver } from '@app-models';
import { useLocation } from 'react-router-dom';
import { Divider, Paper, Stack } from '@mui/material';
import CustomerTab from '../../components/tabs/CustomerTab';
import { driverDetailTabs } from '../../navigation/menus';
import { DriverPageContextProps, ILocationState, ITab } from '@app-interfaces';
import useAdmin from '../../hooks/useAdmin';

export const DriverPageContext = createContext<DriverPageContextProps | null>(null);

function DriverPage() {
  const [driver, setDriver] = useState<IRideShareDriver>();
  const [tabs, setTabs] = useState<ITab[]>([]);

  const location = useLocation();
  const { isSuperAdmin, isDriverAdmin } = useAdmin();

  useEffect(() => {
    if (isSuperAdmin) setTabs(driverDetailTabs);
    if (isDriverAdmin) setTabs(driverDetailTabs.filter(value => value.name === 'Vehicles'));
  }, [isSuperAdmin, isDriverAdmin]);

  useEffect(() => {
    if (location.state) {
      const state = location.state as ILocationState;
      setDriver(state.driver);
    }
  }, [location.state]);

  return (
    <Stack direction="column" spacing={5} divider={<Divider orientation="horizontal" flexItem />}>
      <Paper sx={{ p: 3 }}>
        <DriverPageContext.Provider value={{ driver, setDriver }}>
          <CustomerTab tabMenus={tabs} />
        </DriverPageContext.Provider>
      </Paper>
    </Stack>
  );
}

export default DriverPage;
