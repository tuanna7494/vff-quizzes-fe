import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAppDispatch } from 'common/hooks';
import { actionsAuth, ILoginForm, useSelectAuthStore } from 'modules/Auth';
import { useSnackbar } from 'notistack';
import { RHFTextInput } from 'components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaValidateSignIn } from 'modules/Auth/schema';
import { setToken } from 'common/localStorage';
import { redirect, stackCallback } from 'utils';
import { AUTH_STATUS, BUTTON } from 'constants/common';
import Logo from '@public/images/logo.png';
import Image from 'next/image';

const defaultValues = {
  email: '',
  password: ''
};

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useSelectAuthStore();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = async (data: ILoginForm) => {
    await dispatch(actionsAuth.login(data))
      .unwrap()
      .then(({ data }) => {
        setToken(data.token);
        enqueueSnackbar(AUTH_STATUS.LOGIN_SUCCESS);
        stackCallback(() => redirect('/account/quiz'));
      })
      .catch(err =>
        enqueueSnackbar(AUTH_STATUS.LOGIN_FAILED, { variant: 'error' })
      );
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };
  const { control, handleSubmit } = useForm<ILoginForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schemaValidateSignIn)
  });

  return (
    <Grid item sm={8} md={5} mb={20}>
      <Grid item xs={12}>
        <Box display="center" justifyContent="center" mb={1}>
          <Image src={Logo} width="150px" height="150px" />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography component="h1" variant="h3" textAlign="center" mb={5}>
          Login
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RHFTextInput
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                disabled={loading === 'pending'}
                control={control}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextInput
                id="password"
                name="password"
                label="Password"
                variant="outlined"
                control={control}
                fullWidth
                disabled={loading === 'pending'}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        size="small"
                        onMouseDown={handleMouseDownPassword}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading === 'pending'}
              >
                {BUTTON.SUBMIT}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};
