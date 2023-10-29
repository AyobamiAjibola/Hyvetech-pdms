import React, { useState } from 'react';
import PublicLayout from '../../components/layouts/PublicLayout';
import logoLogin from '../../assets/images/logoLogin.png';
import { Box, Grid, InputAdornment, Link, SnackbarContent, TextField, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import Snackbar from '@mui/material/Snackbar';
import Slide, { SlideProps } from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import { LoadingButton } from '@mui/lab';
import { Lock, VerifiedUser, Visibility, VisibilityOff } from '@mui/icons-material';

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
}

function SignIn () {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fieldType, setFieldType] = useState<string>('password');
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

    const togglePasswordVisibility = () => {
        setFieldType(fieldType === 'text' ? 'password' : 'text');
        setShowPassword(!showPassword);
    };

    return (
        <PublicLayout>
            <img src={logoLogin} alt="" 
                style={{
                    width: '243px',
                    height: "150px",
                    textAlign: 'center',
                    display: 'block',
                    margin: '0 auto'
                }}
            />

            <Box sx={{ mb: 3 }}>
                <Typography textAlign="center" sx={{fontWeight: 500, fontSize: {xs: 20, sm: 25}, mb: 2}}>
                Sign In
                </Typography>
                <Typography textAlign="center" sx={headTextStyle}>
                To continue to your AutoHyve Workshop Profile
                </Typography>
            </Box>

            <>
                <Grid container direction="column">
                    <Grid item xs={12} md={6}>
                    <TextField
                        sx={{width: '100%'}}
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        label={"username"}
                        name={"username"}
                        margin="normal"
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <VerifiedUser />
                            </InputAdornment>
                        ),
                        }}
                    />
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <TextField
                        sx={{width: '100%'}}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        label={"password"}
                        name={"password"}
                        type={fieldType}
                        margin="normal"
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment onClick={togglePasswordVisibility} position="start" sx={{ cursor: 'pointer' }}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </InputAdornment>
                        ),
                        }}
                    />
                    </Grid>

                    <Grid item container xs spacing={2} my={3} justifyContent="space-between" alignItems="center">
                        <Grid item xs={6}>
                        <Link sx={{ color: '#FBA91A', textDecoration: 'none', cursor: 'pointer' }} onClick={handleClick(SlideTransition)}>
                            Create Account
                        </Link>
                        </Grid>

                        <Grid item>
                        <LoadingButton
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
                </Grid>
            </>

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
                    clicking this link: <a href='https://auto.hyvetech.co' style={{fontWeight: 600, color: "#FBA91A", backgroundColor: 'white' }}>auto.hyvetech.co</a>
                    </span>
                    {/* <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} >
                        <GridCloseIcon fontSize="small" />
                    </IconButton> */}
                    
                    </div>
                }
                />
            </Snackbar>
        </PublicLayout>
    )
}

const headTextStyle = {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    mb: '20px',
  };

export default SignIn