import React from 'react';
import { Box, LinkProps, Link as NavLink } from '@mui/material';
import Link from 'next/link';
import { theme } from 'themes';

export interface EnhanceLinkProps extends LinkProps {
  name?: string;
  url: string;
  children?: React.ReactNode;
}

export const EnhanceLink: React.FC<EnhanceLinkProps> = ({
  name,
  url,
  sx,
  children,
  ...props
}) => {
  return (
    <>
      {name ? (
        <Link href={url}>
          <NavLink
            href="#"
            sx={{
              ...sx,
              transition: 'all 0.25s',
              '&:hover': { opacity: 0.85 }
            }}
            {...props}
          >
            {name}
          </NavLink>
        </Link>
      ) : (
        <Link href={url}>
          <Box
            component="a"
            href="#"
            sx={sx}
            style={{
              color: theme.palette.text.primary,
              textDecoration: 'none'
            }}
            {...props}
          >
            {children}
          </Box>
        </Link>
      )}
    </>
  );
};
