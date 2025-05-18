import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Phone, Lock } from '@mui/icons-material';

const Login = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      number: '',
      password: ''
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Here you would make your API call to login the user
      console.log('Login data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle successful login - might include storing tokens, redirecting, etc.
      
      // Close the dialog and reset form
      reset();
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: '100%',
          maxWidth: { xs: '90%', sm: 450 }
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div" fontWeight="bold" color="primary" textAlign="center">
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Login to your Chatify account
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
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
                sx={{ mb: 1 }}
              />
            )}
          />
          
          <Typography 
            variant="body2" 
            color="primary" 
            align="right" 
            sx={{ 
              cursor: 'pointer', 
              fontWeight: 'medium',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Forgot Password?
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column' }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          sx={{ 
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
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Login'
          )}
        </Button>
        
        <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
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
              onClick={handleClose}
            >
              Register now
            </Typography>
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Login;