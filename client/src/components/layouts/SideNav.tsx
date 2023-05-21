import { AppContextProps } from '@app-interfaces';
import { Logout } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
// import MuiDrawer from '@mui/material/Drawer';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  createTheme,
  // CSSObject, styled, Theme,
  ThemeProvider, useTheme
} from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DRAWER_WIDTH } from '../../config/constants';
// import settings from '../../config/settings';
import { AppContext } from '../../context/AppContextProvider';
import useAdmin from '../../hooks/useAdmin';
import useLogout from '../../hooks/useLogout';
import { ISideNav, sideNavs } from '../../routes';
import DrawerHeader from './DrawerHeader';

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
      return setNavs(
        sideNavs.filter(
          value =>
            value.tag === 'all' ||
            value.tag === 'super' ||
            value.tag === 'drivers' ||
            value.name === 'Estimates' ||
            value.name === 'Invoices',
        ),
      );
    if (admin.isTechAdmin) return setNavs(sideNavs.filter(value => value.tag === 'techs' || value.name === 'Invoices'));
    if (admin.isDriverAdmin) return setNavs(sideNavs.filter(value => value.tag === 'all' || value.tag === 'drivers'));
    else setNavs(sideNavs.filter(value => value.tag === 'techs' || value.name === 'Invoices'));
  }, [admin.isDriverAdmin, admin.isSuperAdmin, admin.isTechAdmin]);

  const handleDrawerClose = () => {
    setOpenSideNav(false);
  };

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          primary: { main: '#4F4F4F' },
          // primary: { main: '#e8e8e8' },
          secondary: { main: '#4F4F4F' },
          mode: 'dark',
        },
      })}>
      <Drawer
        // variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={openSideNav}
      >
        <ThemeProvider
          theme={createTheme({
            palette: {
              primary: { main: '#1a97cf' },
              // primary: { main: '#e8e8e8' },
              secondary: { main: '#fba91a' },
              mode: 'light',
            },
          })}>
          <DrawerHeader sx={{ backgroundColor: 'white' }}>
            <img
              style={{
                width: 90,
                height: 90,
                borderRadius: 6,
                position: 'absolute',
                left: '24%',
              }}
              crossOrigin="anonymous"
              src="./logo.ico"
              alt=""
            />

            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
        </ThemeProvider>

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
    </ThemeProvider>
  );
}

export default SideNav;
