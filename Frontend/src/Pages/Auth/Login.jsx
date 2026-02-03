import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Phone, Lock } from '@mui/icons-material';
import { useLoginApiMutation } from '../../services/loginService';
import Register from './Register';
import notify from '../../Utils/toastNotification';
import ForgotPassword from './ForgotPassword';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openForgotDialog, setOpenForgotDialog] = useState(false);

  const [loginUser] = useLoginApiMutation();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      number: '',
      password: ''
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOpenRegisterDialog = () => {
    setOpenRegisterDialog(true);
  };

  const handleCloseRegisterDialog = () => {
    setOpenRegisterDialog(false);
  };


  const handleOpenForgotDialog = () => {
    setOpenForgotDialog(true);
  };

  const handleCloseForgotDialog = () => {
    setOpenForgotDialog(false);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await loginUser(data).unwrap();
      if (response?.status) {
        localStorage.setItem('user', JSON.stringify(response.data))
        localStorage.setItem('token', response.token)
        navigate('/chatDashboard')
        notify.success(response?.message);
      }
    } catch (error) {
      notify.error(error?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>

        <Container maxWidth="sm">
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'linear-gradient(145deg, #f0f0f0 0%, #ffffff 100%)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: 'primary.main',
                  width: 60,
                  height: 60
                }}
              >
                <Lock fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h4" fontWeight="bold" color="primary.main">
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" mt={1}>
                Login to your Chatify account
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <Controller
                name="number"
                control={control}
                rules={{
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    label="Phone Number"
                    autoComplete="tel"
                    autoFocus
                    error={!!errors.number}
                    helperText={errors.number?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required'
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 'medium',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  onClick={handleOpenForgotDialog}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 15px rgba(25, 118, 210, 0.4)',
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Typography
                    component="span"
                    color="primary"
                    sx={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                    onClick={handleOpenRegisterDialog}
                  >
                    Register now
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Register Dialog */}
          <Register open={openRegisterDialog} onClose={handleCloseRegisterDialog} />

          {/* Forgot Dialog */}
          <ForgotPassword open={openForgotDialog} onClose={handleCloseForgotDialog} />
        </Container>
      </Box>
    </>
  );
};

export default Login;