import { AppContextProps } from '@app-interfaces';
import { Logout } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DRAWER_WIDTH } from '../../config/constants';
import { AppContext } from '../../context/AppContextProvider';
import useAdmin from '../../hooks/useAdmin';
import useLogout from '../../hooks/useLogout';
import { ISideNav, sideNavs } from '../../routes';
import DrawerHeader from './DrawerHeader';

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

function SideNav() {
  const [navs, setNavs] = useState<ISideNav[]>([]);

  useState<any>();
  const { openSideNav, setOpenSideNav } = useContext(AppContext) as AppContextProps;

  const admin = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const logout = useLogout();

  useEffect(() => {
    if (admin.isSuperAdmin)
      setNavs(
        sideNavs.filter(
          value =>
            value.tag === 'all' ||
            value.tag === 'super' ||
            value.tag === 'drivers' ||
            value.name === 'Estimates' ||
            value.name === 'Invoices',
        ),
      );
    if (admin.isTechAdmin) setNavs(sideNavs.filter(value => value.tag === 'techs'));
    if (admin.isDriverAdmin) setNavs(sideNavs.filter(value => value.tag === 'all' || value.tag === 'drivers'));
  }, [admin.isDriverAdmin, admin.isSuperAdmin, admin.isTechAdmin]);

  const handleDrawerClose = () => {
    setOpenSideNav(false);
  };

  return (
    <Drawer variant="permanent" open={openSideNav}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {navs.map((nav, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => {
                navigate(nav.path);
              }}
              selected={nav.path === location.pathname}
              sx={{
                minHeight: 48,
                justifyContent: openSideNav ? 'initial' : 'center',
                px: 2.5,
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: openSideNav ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <nav.Icon />
              </ListItemIcon>
              <ListItemText primary={nav.name} sx={{ opacity: openSideNav ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Logout'].map(text => (
          <ListItem key={text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={logout.handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: openSideNav ? 'initial' : 'center',
                px: 2.5,
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: openSideNav ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: openSideNav ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default SideNav;
