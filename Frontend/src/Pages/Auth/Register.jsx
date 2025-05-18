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
  Snackbar,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff, Phone, Person, Lock } from '@mui/icons-material';
import Login from './Login';
import notify from '../../Utils/toastNotification';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      number: '',
      password: ''
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOpenLoginDialog = () => {
    setOpenLoginDialog(true);
  };

  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Here you would make your API call to register the user
      console.log('Registration data:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      notify.success('Registration Successfully')
      // Reset form or redirect after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={8}
        sx={{
          p: 4,
          mt: 8,
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
            <Person fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" fontWeight="bold" color="primary.main">
            Join Chatify
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Connect with friends and the world around you
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Full Name"
                autoComplete="name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}
          />

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
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
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
                onClick={handleOpenLoginDialog}
              >
                Login now
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Login Dialog */}
      <Login open={openLoginDialog} onClose={handleCloseLoginDialog} />
    </Container>
  );
};

export default Register;