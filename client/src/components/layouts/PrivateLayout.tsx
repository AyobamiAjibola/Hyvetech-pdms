import * as React from 'react';
import { useContext } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Route, Routes } from 'react-router-dom';

import AppointmentsPage from '../../pages/appointment/AppointmentsPage';
import VehiclePages from '../../pages/vehicle/VehiclePages';
import CustomersPage from '../../pages/customer/CustomersPage';
import DashboardPage from '../../pages/dashboard/DashboardPage';
import CustomerPage from '../../pages/customer/CustomerPage';
import TransactionsPage from '../../pages/transaction/TransactionsPage';
import TransactionPage from '../../pages/transaction/TransactionPage';
import VehiclePage from '../../pages/vehicle/VehiclePage';
import AppointmentPage from '../../pages/appointment/AppointmentPage';
import useAppSelector from '../../hooks/useAppSelector';
import AppLoader from '../loader/AppLoader';
import PartnersPage from '../../pages/partner/PartnersPage';
import PartnerPage from '../../pages/partner/PartnerPage';
import TechniciansPage from '../../pages/technician/TechniciansPage';
import TechnicianPage from '../../pages/technician/TechnicianPage';
import DriverPage from '../../pages/driver/DriverPage';
import DriversPage from '../../pages/driver/DriversPage';
import SideNav from './SideNav';
import { AppContext } from '../../context/AppContextProvider';
import { AppContextProps } from '@app-interfaces';
import AppBar from './AppDar';
import DrawerHeader from './DrawerHeader';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import CheckListsPage from '../../pages/checkList/CheckListsPage';
import CheckListPage from '../../pages/checkList/CheckListPage';
import JobCheckListPage from '../../pages/checkList/JobCheckListPage';
import JobCheckListReportPage from '../../pages/checkList/JobCheckListReportPage';
import EstimatesPage from '../../pages/estimates/EstimatesPage';
import EstimatePage from '../../pages/estimates/EstimatePage';

function PrivateLayout() {
  const { setOpenSideNav, openSideNav } = useContext(AppContext) as AppContextProps;

  const appointmentReducer = useAppSelector(state => state.appointmentReducer);

  const handleDrawerOpen = () => {
    setOpenSideNav(true);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" open={openSideNav}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(openSideNav && { display: 'none' }),
              }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Jiffix HYVE
            </Typography>
          </Toolbar>
        </AppBar>
        <SideNav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/appointments/:id" element={<AppointmentPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:id" element={<CustomerPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/:id" element={<TransactionPage />} />
            <Route path="/vehicles" element={<VehiclePages />} />
            <Route path="/vehicles/:id" element={<VehiclePage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/partner/:id" element={<PartnerPage />} />
            <Route path="/partner/dashboard" element={<React.Fragment />} />
            <Route path="/technicians" element={<TechniciansPage />} />
            <Route path="/technician/:id" element={<TechnicianPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/drivers/:id" element={<DriverPage />} />
            <Route path="/garage" element={<PartnerPage />} />
            <Route path="/ride-share" element={<PartnerPage />} />
            <Route path="/checkLists" element={<CheckListsPage />} />
            <Route path="/checkLists/:id" element={<CheckListPage />} />
            <Route path="/job-check-list/:id" element={<JobCheckListPage />} />
            <Route path="/estimates" element={<EstimatesPage />} />
            <Route path="/estimates/:id" element={<EstimatePage />} />
            <Route path="/job-check-list-report/:id" element={<JobCheckListReportPage />} />
          </Routes>
        </Box>
      </Box>
      <AppLoader show={appointmentReducer.updateAppointmentStatus === 'loading'} />
    </React.Fragment>
  );
}

export default withErrorBoundary(PrivateLayout);
