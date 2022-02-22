import React from 'react';
import { EnhanceLinkProps } from 'components';
import { ListItemText, MenuItem, MenuList } from '@mui/material';
import { redirect } from 'utils';
import { theme } from 'themes';

export interface NavbarProps {
  className?: string;
  data: EnhanceLinkProps[];
}

export const Navbar: React.FC<NavbarProps> = ({ data = [], className }) => {
  return (
    <MenuList
      className={className}
      sx={{
        [theme.breakpoints.up('md')]: {
          display: 'flex',
          alignItems: 'center'
        }
      }}
    >
      {data?.map((item, i) => (
        <MenuItem
          key={i}
          onClick={() => redirect(item.url)}
          sx={{
            mx: { md: 3 },
            px: { xs: 3, md: 3 },
            py: { xs: 1, md: 0.75 },
            ':hover': {
              borderRadius: '40px'
            }
          }}
        >
          <ListItemText>{item.name}</ListItemText>
        </MenuItem>
      ))}
    </MenuList>
  );
};
