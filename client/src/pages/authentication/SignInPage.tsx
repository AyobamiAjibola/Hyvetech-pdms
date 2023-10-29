import './signInForm.css';
import { ISignInModel } from '@app-interfaces';
import { Box, Grid, SnackbarContent, Typography } from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';

import logoLogin from '../../assets/images/logoLogin.png';
// import AppAlert from '../../components/alerts/AppAlert';
import SignInForm from '../../components/forms/authentication/SignInForm';
import signInModel from '../../components/forms/models/signInModel';
import PublicLayout from '../../components/layouts/PublicLayout';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import useAppDispatch from '../../hooks/useAppDispatch';
// import useLogin from '../../hooks/useLogin';
import { signInAction } from '../../store/actions/authenicationActions';
import { TransitionProps } from '@mui/material/transitions';
import Snackbar from '@mui/material/Snackbar';
import Slide, { SlideProps } from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
// import useAppSelector from '../../hooks/useAppSelector';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function SignInPage() {
  const dispatch = useAppDispatch();
  // const authReducer = useAppSelector(state => state.authenticationReducer);
  const [state, setState] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & {
        children: React.ReactElement<any, any>;
      }
    >;
  }>({
    open: false,
    Transition: Fade,
  });

  // const login = useLogin();

  const handleSignIn = (values: ISignInModel, formikHelpers: FormikHelpers<ISignInModel>) => {

    dispatch(signInAction(values));
    formikHelpers.resetForm();
  };


  const handleClick =
    (
      Transition: React.ComponentType<
        TransitionProps & {
          children: React.ReactElement<any, any>
        }
      >,
    ) =>
    () => {
      setState({
        open: true,
        Transition,
      });
    };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  return (
    <PublicLayout>
      <img src={logoLogin} alt="" className="loginLogo" />
      {/* <Typography textAlign="center" sx={headTextStyle}>
        Welcome to your gateway to boundless opportunities!
      </Typography> */}
      <Box sx={{ mb: 3 }}>
        <Typography textAlign="center" sx={{fontWeight: 500, fontSize: {xs: 20, sm: 25}, mb: 2}}>
          Sign In
        </Typography>
        <Typography textAlign="center" sx={headTextStyle}>
          To continue to your AutoHyve Workshop Profile
        </Typography>
      </Box>
      <Formik
        initialValues={signInModel.initialValues}
        validationSchema={signInModel.schema}
        onSubmit={handleSignIn}
      >
        <SignInForm/>
      </Formik>

      <Grid item container xs spacing={2} my={3} justifyContent="space-between" alignItems="center">
        <Grid item xs={6}>
          <Link style={{ color: '#FBA91A' }} to="/garage/register">
            Create Account
          </Link>
        </Grid>

        <Grid item>
          <LoadingButton
            // loading={authReducer.signingInStatus === 'loading'}
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleClick(SlideTransition)}
            >
            Login
          </LoadingButton>
        </Grid>
      </Grid>
      
      <Snackbar
        sx={{height: '120px'}}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={state.open}
        autoHideDuration={10000}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        key={state.Transition.name}
      >
        <SnackbarContent
          message={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <span style={{fontSize: '15px'}}>
                We have moved to a new site! Please log in by
              </span>
              <span style={{fontSize: '15px'}}>
              clicking this link: <a href='https://auto.hyvetech.co' style={{fontWeight: 600}}>auto.hyvetech.co</a>
              </span>
              {/* <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} >
                <GridCloseIcon fontSize="small" />
              </IconButton> */}
              
            </div>
          }
        />
      </Snackbar>
      {/* <AppAlert
        alertType="success"
        show={login.success !== undefined}
        message={login.success?.message}
        onClose={login.clearSuccess}
      />
      <AppAlert
        alertType="error"
        show={login.error !== undefined}
        message={login.error?.message}
        onClose={login.clearError}
      /> */}
    </PublicLayout>
  );
}

const headTextStyle = {
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  mb: '20px',
};

export default withErrorBoundary(SignInPage);
