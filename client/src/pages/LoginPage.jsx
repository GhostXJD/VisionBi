//Imports 
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Typography
} from '@mui/material';

function LoginPage() {
  //Constants
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, errors: signinErrors } = useAuth();

  const onSubmit = handleSubmit(data => {
    signin(data)
  })

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  

  return (
    <div className='flex h-screen items-center justify-right'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
        {signinErrors.map((error, i) => (
          <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
            {error}
          </div>
        ))
        }
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
                  Don't have an account?
                  <Link
                    href=""
                    underline="hover"
                    variant="subtitle2"
                  >
                    Register
                  </Link>
                </Typography>
              </Stack>
            </grid>

            <form
              onSubmit={onSubmit}>

              <FormControl sx={{ m: 1, width: '100%' }} variant="outlined" className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'>
                {/* Ingreso de Correo */}
                <InputLabel htmlFor="outlined-adornment-password" text-white px4 py-2 rounded-md my-2 >Email</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={'mail'}
                  {...register("correo", { required: true })}
                  label="Password"
                />
                {/* Valido el ingreso de un Correo */}
                {errors.correo && (
                  <Stack sx={{ width: '100%' }} spacing={0.5}>
                    <Alert severity="error">Se requiere correo</Alert>
                  </Stack>
                )}
              </FormControl>
              <FormControl sx={{ m: 1, width: '100%' }} variant="outlined" className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'>
                {/* Ingreso de Contraseña */}
                <InputLabel htmlFor="outlined-adornment-password" text-white px4 py-2 rounded-md my-2 >Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register("password", { required: true })}
                  endAdornment={
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
                  }
                  label="Password"
                />

                {/* Valido el ingreso de una contraseña */}
                {errors.password && (
                  <Stack sx={{ width: '100%' }} spacing={0.5}>
                    <Alert severity="error">Se requiere contraseña</Alert>
                  </Stack>
                )}
              </FormControl>

              {/* Botón de ingresar */}
              <button className='bg-zinc-400 px-3 py-1 rounded-lg' sx={{ width: '100%' }} type="submit">Ingresar</button>

            </form>

            <p className='flex gap-x-2 justify-between'>
              No tienes una cuenta? <Link to='/registro'
                className='bg-sky-500 px-4 py-1 rounded-xl'>Crear una cuenta</Link>
            </p>
          </div>
      </div >
      )
}
      export default LoginPage


