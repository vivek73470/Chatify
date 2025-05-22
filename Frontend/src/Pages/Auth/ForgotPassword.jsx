import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, IconButton, Box, Typography,
    InputAdornment, CircularProgress, Divider, Avatar
} from '@mui/material';
import { Lock, Phone, Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import notify from '../../Utils/toastNotification';
import { useVerifyNumberMutation } from '../../services/loginService';
import NewPasswordDialog from './NewPasswordDialog';

const ForgotPassword = ({ open, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [storedOTP, setStoredOTP] = useState('');
    const [otpEnabled, setOtpEnabled] = useState(false);
    const [otpError, setOtpError] = useState('');

    const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false);
    const [id, setId] = useState('');

    const { control, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            number: '',
            verificationCode: ''
        }
    });

    const [verifyNumber] = useVerifyNumberMutation();
    const enteredOTP = watch('verificationCode');

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await verifyNumber({ number: data.number }).unwrap();
            if (res?.status) {
                notify.info(`Verification code: ${res.code}`);
                setStoredOTP(res.code);
                setOtpEnabled(true);
                setId(res._id);
            }
        } catch (err) {
            notify.error(err?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (enteredOTP && otpEnabled) {
            if (enteredOTP === storedOTP) {
                setOtpError('');
                setShowNewPasswordDialog(true);
            } else {
                setOtpError('Verification code does not match');
            }
        } else {
            setOtpError('');
        }
    }, [enteredOTP, storedOTP, otpEnabled]);


    const handleClose = () => {
        reset();
        setStoredOTP('');
        setOtpEnabled(false);
        setShowNewPasswordDialog(false);
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ position: 'relative', p: 4 }}>
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 16, top: 16 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 2 }}>
                            <Lock />
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold">Reset Password</Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            Enter your number to get Verification Code
                        </Typography>
                    </Box>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ p: 4 }}>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="number"
                            control={control}
                            rules={{
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Enter a valid 10-digit number'
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Phone Number"
                                    margin="normal"
                                    autoComplete="tel"
                                    error={!!errors.number}
                                    helperText={errors.number?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone color="primary" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="verificationCode"
                            control={control}
                            rules={{
                                required: otpEnabled ? 'Verification code is required' : false,
                                pattern: {
                                    value: /^[0-9]{4,6}$/,
                                    message: 'Invalid verification code'
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Verification Code"
                                    margin="normal"
                                    disabled={!otpEnabled}
                                    error={!!errors.verificationCode || !!otpError}
                                    helperText={
                                        !otpEnabled
                                            ? 'Enter phone number first to enable this field'
                                            : errors.verificationCode?.message || otpError
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="primary" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Code'}
                        </Button>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Typography variant="body2">
                        Remember password?{' '}
                        <Typography
                            component="span"
                            color="primary"
                            sx={{ cursor: 'pointer', fontWeight: 'medium' }}
                            onClick={handleClose}
                        >
                            Login now
                        </Typography>
                    </Typography>
                </DialogActions>
            </Dialog>

            {showNewPasswordDialog && (
                <NewPasswordDialog
                    open={showNewPasswordDialog}
                    id={id}
                    onClose={() => {
                        setShowNewPasswordDialog(false);
                        handleClose();
                    }}
                />
            )}
        </>
    );
};

export default ForgotPassword;
