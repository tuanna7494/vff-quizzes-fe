import React, { useCallback, useEffect, useState } from 'react';
import { getToken, removeToken } from 'common/localStorage';
import { redirect } from 'utils';
import { actionsAuth, useSelectCurrentUserStore } from 'modules/Auth';
import { isEmpty } from 'lodash';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'common/hooks';

const PATH_EXCLUDED_AUTHENTICATION = ['/account/login'];

const withAuth = WrappedComponent => {
  return props => {
    const { pathname } = useRouter();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [verified, setVerified] = useState<boolean>(false);
    const currentUser = useSelectCurrentUserStore();

    /**
     * getCurrentUserAfterLogin
     * @param token
     * @returns
     */
    const getCurrentUserAfterLogin = useCallback(
      token => {
        if (!isEmpty(currentUser)) return setVerified(true);

        // Call getCurrentUser API
        dispatch(actionsAuth.getCurrentUser(token))
          .unwrap()
          .then(res => {
            if (isEmpty(res?.data)) return;
            return setVerified(true);
          })
          .catch(err => {
            enqueueSnackbar('Error, Token expired!', { variant: 'error' });
            removeToken();
            redirect('/account/login');
          });
      },
      [dispatch, currentUser, enqueueSnackbar]
    );

    useEffect(() => {
      (async () => {
        const accessToken = await getToken();
        const isExist = PATH_EXCLUDED_AUTHENTICATION.includes(pathname);

        // if no accessToken was found,then we redirect to "/" page.
        if (!accessToken) {
          redirect('/account/login');
          isExist && setVerified(true);
        } else {
          if (isExist) return redirect('/account/quiz');
          getCurrentUserAfterLogin(accessToken);
        }
      })();
    }, [pathname, getCurrentUserAfterLogin]);

    /**
     * Return
     */
    if (!verified) return null;
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
