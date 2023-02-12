import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Divider, Paper, Stack } from '@mui/material';
import CustomerTab from '../../components/tabs/CustomerTab';
import { customerDetailTabs, customerDetailTabsTechOnly } from '../../navigation/menus';
import { CustomerPageContextProps, ILocationState } from '@app-interfaces';
import { ICustomer } from '@app-models';
import useAdmin from '../../hooks/useAdmin';
import { KeyboardArrowLeft } from '@mui/icons-material';

export const CustomerPageContext = createContext<CustomerPageContextProps | null>(null);

function CustomerPage() {
  const [customer, setCustomer] = useState<ICustomer>();
  const { isTechAdmin } = useAdmin();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const state = location.state as ILocationState;
      setCustomer(state.customer);
    }
  }, [location.state]);

  return (
    <Stack direction="column" spacing={5} divider={<Divider orientation="horizontal" flexItem />}>
      <Paper sx={{ p: 3 }}>
        <KeyboardArrowLeft style={{ cursor: 'pointer', }} onClick={()=> window.history.back()} />
        <CustomerPageContext.Provider value={{ customer, setCustomer }}>
          <CustomerTab tabMenus={ isTechAdmin ? customerDetailTabsTechOnly : customerDetailTabs} />
        </CustomerPageContext.Provider>
      </Paper>
    </Stack>
  );
}

export default CustomerPage;
