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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Phone, Person, Lock } from '@mui/icons-material';
import notify from '../../Utils/toastNotification';
import CloseIcon from '@mui/icons-material/Close';
import { useRegisterApiMutation } from '../../services/loginService';

const Register = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [registerUser] = useRegisterApiMutation();

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
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
      const response = await registerUser(data).unwrap();
      if (response?.status) {
        reset();
        onClose();
        notify.success(response?.message);
      }
    } catch (error) {
      notify.error(error?.data?.message || 'Something went wrong!');
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
          maxWidth: { xs: '90%', sm: 500 }
        }
      }}
    >
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 2
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
      </DialogTitle>

      <Divider />

      <DialogContent>
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
            'Create Account'
          )}
        </Button>

        <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
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
              onClick={handleClose}
            >
              Login now
            </Typography>
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Register;