//Imports 
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Typography } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

function LoginPage() {
  //Constants
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/inicio')
  }, [isAuthenticated])

  const formik = useFormik({
    initialValues: {
      correo: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      correo: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),

    onSubmit: async (values, helpers) => {
      try {
        const userLogin = {
          correo: values.correo,
          password: values.password
        }
        await signin(userLogin);
        navigate("/inicio")

      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (signinErrors.length > 0) {
      for (const errores of signinErrors) {
        if (errores == "Correo incorrecto") {
          formik.setFieldError('correo', 'Email is incorrect');
        } else if (errores == "Contraseña incorrecta") {
          formik.setFieldError('password', 'Password is incorrect');
        }
      }
    }
  }, [signinErrors]);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();

  };


  return (
    <div className='flex py-6  items-center justify-right h-[70vh]'>
      <div className={` max-w-md w-full p-10 rounded-md ${theme === 'dark' ? "dark" : "bg-white"}`}>
        <grid>
          <Stack
            spacing={1}
            sx={{ mb: 3 }}
          >
            <Typography variant="h4">
              Login
            </Typography>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Dont have an account?
              <Link to='/registro'
                underline="hover"
                variant="subtitle2"
              >
                Register
              </Link>
            </Typography>
          </Stack>
        </grid>

        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >

          <Stack spacing={3}>
            <TextField
              error={!!(formik.touched.correo && formik.errors.correo)}
              fullWidth
              helperText={formik.touched.correo && formik.errors.correo}
              label="Email Address"
              name="correo"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.correo}

            />
            <TextField
              error={!!(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

          </Stack>
          {formik.errors.submit && (
            <Typography
              color="error"
              sx={{ mt: 3 }}
              variant="body2"
            >
              {formik.errors.submit}
            </Typography>
          )}
          {/* Botón de ingresar */}
          <Button
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            type="submit"
            variant="contained"
          >
            Continue
          </Button>

        </form>

        <p hidden className='flex gap-x-2 justify-between'>
          No tienes una cuenta? <Link hidden to='/registro'
            className='bg-sky-500 px-4 py-1 rounded-xl'>Crear una cuenta</Link>
        </p>
      </div>
    </div >
  )
}

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #BF4F74;
`;
export default LoginPage


