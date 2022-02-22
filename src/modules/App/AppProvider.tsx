import React from 'react';
import { CssBaseline } from '@mui/material';
import { Loading, Notications } from 'components';
import { useSelectAppLoaded } from './redux';
import { IAppProps } from './types';

export const AppProvider = ({ children }: IAppProps) => {
  const showLoading = useSelectAppLoaded();
  return (
    <>
      <CssBaseline />
      <Notications>{children}</Notications>
      {showLoading && <Loading open={showLoading} />}
    </>
  );
};
