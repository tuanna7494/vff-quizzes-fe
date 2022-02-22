import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { theme } from 'themes';
import { AppProvider } from 'modules/App';
import { store } from 'common/redux';
import 'styles/main.scss';
import { CacheProvider } from '@emotion/react';
import { createEmotionCache } from 'utils';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? (page => page);

  return (
    <CacheProvider value={emotionCache}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <AppProvider>{getLayout(<Component {...pageProps} />)}</AppProvider>
          </Provider>
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
