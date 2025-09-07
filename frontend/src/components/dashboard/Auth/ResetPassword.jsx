import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetUserPassword, logout } from '../utils/apiRequest';
import style from '../../../app/Style';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || null;
  const [serverError, setServerError] = useState(null);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    setServerError(null);
    const result = await resetUserPassword('reset', formData);

    if (result.success) {
      navigate('/dashboard', {
        state: {
          toast: {
            message: `${result.message}`,
            duration: 6000,
            type: 'success',
          },
        },
      });
    } else {
      setServerError(result.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', {
      replace: true,
      state: { message: 'You have been logged out.' },
    });
  };

  return (
    <div className={style.Login.container}>
      <div className={style.Login.card}>
        <h1 className={style.Login.title}>Reset Password</h1>
        <p className={style.Login.subtitle}>{message}</p>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="text-red-500 text-sm font-medium hover:underline"
          >
            Logout
          </button>
        </div>
        {serverError && <p className={style.Login.errorBox}>{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className={style.Login.form} noValidate>
          {/* Old Password */}
          <div>
            <label htmlFor="oldPassword" className={style.Login.label}>Current Password</label>
            <input
              id="oldPassword"
              type="password"
              {...register('oldPassword', { required: 'Current password is required' })}
              className={style.Login.input}
            />
            {errors.oldPassword && (
              <p className={style.Login.errorText}>{errors.oldPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className={style.Login.label}>New Password</label>
            <input
              id="newPassword"
              type="password"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: { value: 8, message: 'Must be at least 8 characters' },
              })}
              className={style.Login.input}
            />
            {errors.newPassword && (
              <p className={style.Login.errorText}>{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className={style.Login.label}>Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (value) =>
                  value === watch('newPassword') || 'Passwords do not match',
              })}
              className={style.Login.input}
            />
            {errors.confirmPassword && (
              <p className={style.Login.errorText}>{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={style.Login.button}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className={style.Login.footer}>
          &copy; {new Date().getFullYear()} Team Simple. All rights reserved.
        </p>
      </div>
    </div>
  );
}
