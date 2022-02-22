import React from 'react';
import { Layout } from 'components';
import { LoginForm } from 'modules/Auth';
import { withAuth } from 'hoc';
import { Container, Grid } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <Layout variant="blank" title="Login to your account">
      <Container>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <LoginForm />
        </Grid>
      </Container>
    </Layout>
  );
};
export default withAuth(LoginPage);
