import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { userLogin } from '../utils/apiRequest';
import style from '../../../app/Style';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState(location.state?.message || null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    setLoginError(null);
    try {
      const result = await userLogin(formData);

      if (result?.success) {
        if (result.isFirstLogin) {
          navigate('/reset-password', {
            state: { message: result.message }
          });
        } else {
          navigate('/dashboard');
        }
      }

    } catch (error) {
      const message = error?.message || 'Login failed. Please check your credentials.';
      setLoginError(message);
    }
  };


  return (
    <div className={style.Login.container}>
      <div className={style.Login.card}>
        <h1 className={style.Login.title}>Team Simple</h1>
        <h2 className={style.Login.subtitle}>Dashboard Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={style.Login.form} noValidate>
          {/* Error Box */}
          {loginError && (
            <p className={style.Login.errorBox}>
              {loginError}
            </p>
          )}

          {/* Username Field */}
          <div>
            <label htmlFor="username" className={style.Login.label}>Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              {...register('username', { required: 'Username is required' })}
              className={style.Login.input}
            />
            {errors.username && (
              <p className={style.Login.errorText}>{errors.username.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className={style.Login.label}>Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
              className={style.Login.input}
            />
            {errors.password && (
              <p className={style.Login.errorText}>{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={style.Login.button}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className={style.Login.footer}>
          &copy; {new Date().getFullYear()} Team Simple. All rights reserved.
        </p>
      </div>
    </div>
  );
}
