import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import notify from '../../Utils/toastNotification';
import { useResetPasswordMutation } from '../../services/loginService';

const NewPasswordDialog = ({ open, onClose, id }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            newPassword: ''
        }
    });

    const [resetPassword] = useResetPasswordMutation();
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await resetPassword({ _id: id,password:data.password });
            notify.success('Password reset successfully!');
            onClose();
        } catch (err) {
            notify.error('Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Set New Password</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="newPassword"
                        control={control}
                        rules={{
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters'
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                margin="normal"
                                error={!!errors.newPassword}
                                helperText={errors.newPassword?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}
                    />

                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={20} /> : 'Save Password'}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewPasswordDialog;
