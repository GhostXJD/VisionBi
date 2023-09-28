//Imports 
import { useAuth } from '../context/AuthContext';
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
import vision from '../images/visionBI (1).png';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';



function LoginPage() {
  //Constants
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { checked, setChecked } = useState(false)

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  }

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
        }else{
          navigate("/inicio")
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

    <div className={`flex  h-[80vh] items-center justify-center ${theme === 'dark' ? 'dark' : ''}`}>
      <div className={` max-w-md w-full p-10 rounded-md ${theme === 'dark' ? "#3b0764" : "bg-white"}`}>

        <div className={`LoginCard ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white border-black'}`}>
          <div className="LoginImg">
            <img src={vision} alt="Descripción de la imagen"/>
          </div>
          <div className="LoginMsg">
            <h2 className="LoginTxt1"> Hi, Welcome Back</h2>
            <span className="LoginTxt2">Enter your credentials to continue</span>
          </div>

          <div className="LoginSeparacion"></div>
          <hr className="LoginRecta" />
          <div className="LoginSeparacion"></div>

          <form className='LoginForm'
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
                InputProps={{
                  sx: { borderRadius: 3 }
                }}
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
                  sx: { borderRadius: 3 }
                }}
              />
            </Stack>

            <div className='LoginFinal'>
              <div className='LoginRemember'>
                <div className='LoginCheckbox'>
                  <Checkbox
                    checked={checked}
                    onChange={handleCheckboxChange}
                    color="primary"
                  />
                </div>
                <div className='LoginRememberSpan'>
                  <span>Remember me</span>
                </div>
              </div>
              <h6 className='LoginForgot'>
                Forgot Password?
              </h6>
            </div>


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
              Sing in
            </Button>

          </form>
          <div className="LoginSeparacion"></div>
          <hr className="LoginRecta" />
          <div className="LoginSeparacion"></div>
          <div className='LoginNoAccount'>
            <a href="" >
              Don't have an account?
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage


