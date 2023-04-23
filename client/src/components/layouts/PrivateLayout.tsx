import * as React from 'react';
import { useContext } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Route, Routes, useNavigate } from 'react-router-dom';

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
import JobCheckListReportPage from '../../pages/checkList/JobCheckListReportPage';
import EstimatesPage from '../../pages/estimate/EstimatesPage';
import EstimatePage from '../../pages/estimate/EstimatePage';
import InvoicesPage from '../../pages/invoice/InvoicesPage';
import InvoicePage from '../../pages/invoice/InvoicePage';
import Expenses from '../../pages/expenses/ExpensesPage';
import ExpenseCreate from '../../pages/expenses/ExpenseCreate';
import ExpenseDetail from '../../pages/expenses/ExpenseDetail';
import PaymentRecieve from '../../pages/paymentRecieve/paymentRecieve';
import { Settings } from '@mui/icons-material';
import useAdmin from '../../hooks/useAdmin';
import settings from '../../config/settings';
import Main from './Main';
import Workshops from '../../pages/workshops/Workshops';
import WorkshopPage from '../../pages/workshops/WorkshopPage';
import ItemsPage from '../../pages/item/ItemsPage';
import ItemPage from '../../pages/item/ItemPage';

function PrivateLayout() {
  const { setOpenSideNav, openSideNav } = useContext(AppContext) as AppContextProps;

  const appointmentReducer = useAppSelector(state => state.appointmentReducer);

  const handleDrawerOpen = () => {
    setOpenSideNav(true);
  };

  const navigate = useNavigate();
  const { user, isSuperAdmin } = useAdmin();

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ backgroundColor: '#E8E8E8', boxShadow: 'none' }} open={openSideNav}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                // color="inherit"
                // color="black"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  color: 'black',
                  ...(openSideNav && { display: 'none' }),
                }}>
                <MenuIcon />
              </IconButton>

              {/* <img
                style={{ width: 50, height: 50, borderRadius: 6 }}
                crossOrigin="anonymous"
                src="./logo.ico" alt="" /> */}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                sx={{ color: 'black', marginRight: 3, fontWeight: '400' }}
                variant="h6"
                noWrap
                component="div">
                {user?.partner?.name || ''}
              </Typography>

              {!isSuperAdmin && <img
                style={{ width: 30, height: 30, borderRadius: 6 }}
                crossOrigin="anonymous"
                src={`${settings.api.baseURL}/${user?.partner?.logo || ''}`}
                alt=" "
              />}

              <IconButton
                // color="inherit"
                aria-label="open drawer"
                onClick={() => {
                  // ..
                  navigate('/garage');
                }}
                edge="start"
                sx={{
                  marginRight: 2,
                  marginLeft: 5,
                  color: 'black',
                }}>
                <Settings />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <SideNav />
        <Main open={openSideNav}>
        {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}> */}
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
            <Route path="/estimates" element={<EstimatesPage />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expense/create" element={<ExpenseCreate />} />
            <Route path="/expense/:id" element={<ExpenseDetail />} />
            <Route path="/estimates/:id" element={<EstimatePage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/workshop/:id" element={<WorkshopPage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/items/:id" element={<ItemPage />} />

            <Route path="/invoices/:id" element={<InvoicePage />} />
            <Route path="/job-check-list-report/:id" element={<JobCheckListReportPage />} />
            <Route path="/payment-recieved" element={<PaymentRecieve />} />
          </Routes>
        {/* </Box> */}
        </Main>
      </Box>
      <AppLoader show={appointmentReducer.updateAppointmentStatus === 'loading'} />
    </React.Fragment>
  );
}

export default withErrorBoundary(PrivateLayout);
