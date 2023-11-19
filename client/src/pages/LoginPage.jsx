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
import { Link } from "react-router-dom";

function LoginPage() {
  //Constants
  const { signin, errors: signinErrors, isAuthenticated, hasRole } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (hasRole('admin')) {
        navigate('/ListarUsuarios');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, hasRole]);

  const formik = useFormik({
    initialValues: {
      correo: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      correo: Yup
        .string()
        .email('Debe ser un correo válido')
        .max(255)
        .required('Se requiere correo'),
      password: Yup
        .string()
        .max(255)
        .required('Se requiere contraseña')
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
        } else {
          navigate("/dashboard");
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

    <div className={`flex  h-[100vh]  items-center justify-center ${theme === 'dark' ? 'dark' : ''}`}  >
      <div className={` max-w-md w-full rounded-md ${theme === 'dark' ? "#3b0764" : "bg-white"} `}>
        <div className={`LoginCard ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white border-black'}`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(207, 195, 218, 0.7)', backgroundColor:'#fffdfe' }}>
          <div className="LoginImg">
            <Link to="/"><img src={vision} alt="Descripción de la imagen" /></Link>
          </div>
          <div className="LoginMsg">
            <h2 className="LoginTxt1"> Hola, bienvenido de nuevo</h2>
            <span className="LoginTxt2">Introduce tus credenciales para continuar</span>
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
                color="secondary"
                error={!!(formik.touched.correo && formik.errors.correo)}
                fullWidth
                helperText={formik.touched.correo && formik.errors.correo}
                label="Correo"
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
                color="secondary"
                error={!!(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label="Contraseña"
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
              </div>
              <Link to='/recoverPass' >
              <h6 className='LoginForgot'>
              ¿Has olvidado tu contraseña?
              </h6>
              </Link>
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
              color="secondary"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
            >
              Iniciar sesión
            </Button>

          </form>
          <div className="LoginSeparacion"></div>
          <hr className="LoginRecta" />
          <div className="LoginSeparacion"></div>

          <div className='LoginNoAccount'>
            <Link to='/registro' >
            ¿No tienes una cuenta?
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LoginPage