import React, { useState } from 'react';
import { Avatar, Badge, Box, IconButton, Menu, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { actionsAuth, useSelectCurrentUserStore } from 'modules/Auth';
import { redirect, stackCallback } from 'utils';
import { useAppDispatch } from 'common/hooks';
import { removeToken } from 'common/localStorage';
import { actionsQuiz } from 'modules/Quiz';
import { actionsUser } from 'modules/Users';
import { actionsApp } from 'modules/App';

export const Profile = () => {
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'profile-menu' : undefined;
  const user = useSelectCurrentUserStore();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async e => {
    e.preventDefault();
    await removeToken();
    dispatch(actionsApp.clearState());
    dispatch(actionsUser.clearState());
    dispatch(actionsAuth.clearState());
    dispatch(actionsQuiz.clearState());
    stackCallback(() => redirect('/account/login'));
  };

  return (
    <Box display="flex" mr={-1}>
      <Avatar src={user.avatar}>{user.name}</Avatar>
      <IconButton
        aria-describedby={id}
        size="small"
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 1 }}
      >
        <Badge color="default">
          <ExpandMoreIcon fontSize="small" />
        </Badge>
      </IconButton>
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {/* <MenuItem sx={{ fontSize: '14px' }}>Profile Settings</MenuItem> */}
        <MenuItem onClick={handleLogout} sx={{ fontSize: '14px' }}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};
