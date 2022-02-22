import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Toolbar, IconButton, Typography } from '@mui/material';
import { Profile } from './Profile';
import { useAppDispatch } from 'common/hooks';
import { Navbar } from 'components';
import { actionsApp, useSelectAppToggleSidebar } from 'modules/App';
import Logo from '@public/images/logo.png';
import Image from 'next/image';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

interface HeaderProps {
  title: string | undefined;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const dispatch = useAppDispatch();
  const isToggle = useSelectAppToggleSidebar();

  const toggleDrawer = () => {
    dispatch(actionsApp.toggleSidebar());
  };

  return (
    <AppBar position="absolute" open={isToggle}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            mr: { xs: '12px', sm: '36px' },
            ...(isToggle && { display: 'none' })
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box display="flex" alignItems="center">
          <Image src={Logo} width="32px" height="32px" />
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            ml={2}
            sx={{
              flexGrow: 1,
              fontFamily: '"Montserrat", "Roboto", "Arial", sans-serif'
            }}
          >
            {process.env.siteName}
          </Typography>
        </Box>
        <Box ml="auto">
          <Navbar data={[{ name: 'Visit Site', url: '/' }]} />
        </Box>
        <Profile />
      </Toolbar>
    </AppBar>
  );
};
