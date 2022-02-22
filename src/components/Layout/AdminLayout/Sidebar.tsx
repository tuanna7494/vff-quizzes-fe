import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {
  Toolbar,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import { redirect } from 'utils';
import { actionsUser } from 'modules/Users';
import { actionsQuiz } from 'modules/Quiz';
import { useSelectCurrentUserStore } from 'modules/Auth';
import { actionsApp, useSelectAppToggleSidebar } from 'modules/App';
import { useAppDispatch } from 'common/hooks';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  }
}));

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { role } = useSelectCurrentUserStore();
  const isToggle = useSelectAppToggleSidebar();

  const toggleDrawer = () => {
    dispatch(actionsApp.toggleSidebar());
  };

  return (
    <Drawer variant="permanent" open={isToggle}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1]
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <ListItemButton
          component="a"
          onClick={() => {
            redirect('/account/quiz');
            dispatch(
              actionsQuiz.updateQuizActions({
                isShow: false,
                isAdd: true,
                isEdit: false,
                editableQuizz: {}
              })
            );
          }}
        >
          <ListItemIcon>
            <QuizIcon />
          </ListItemIcon>
          <ListItemText primary="Quizzes" />
        </ListItemButton>
        {role === 'admin' && (
          <ListItemButton
            component="a"
            onClick={() => {
              redirect('/account/user');
              dispatch(
                actionsUser.updateQuizActions({ isShow: false, isAdd: true })
              );
            }}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
        )}
      </List>
    </Drawer>
  );
};
