
import bcrypt from 'bcryptjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Stack from '@mui/material/Stack';
import { updateUsuarioRequest } from '../api/usuarios'
import Swal from 'sweetalert2'
import LockIcon from '@mui/icons-material/Lock';

function ChangePasswordPage() {
    const { isAuthenticated, usuario } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/')
    }, [isAuthenticated])

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            password: '',
            passwordC: '',
            submit: null
        },
        validationSchema: Yup.object({
            currentPassword: Yup
                .string()
                .max(255)
                .required('Se requiere contraseña actual'),
            password: Yup
                .string()
                .max(255)
                .min(5, 'Debe tener al menos 5 caracteres')
                .required('Se requiere contraseña'),
            passwordC: Yup
                .string()
                .max(255)
                .min(5, 'Debe tener al menos 5 caracteres')
                .required('Repita su contraseña'),
        }),

        onSubmit: async (values, helpers) => {
            try {

                const isPasswordValid = await bcrypt.compare(values.currentPassword, usuario.password);

                if (!isPasswordValid) {
                    helpers.setErrors({ currentPassword: 'La contraseña actual es incorrecta' });
                    return;
                }

                const userData = {
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    rut: usuario.rut,
                    correo: usuario.correo,
                    password: values.password,
                    tipoUsuario: usuario.tipoUsuario,
                    active: true,
                    company: usuario.company
                }
                await updateUsuarioRequest(usuario.id, userData)
                if (updateUsuarioRequest(userData)) {
                    Swal.fire({
                        icon: 'success',
                        text: 'Contraseña actualizada',
                        confirmButtonColor: '#8F3C8A',
                    }).then(() => {
                        window.location.replace('/perfil');
                    });
                }

            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        }
    });

    const [showCurrentPassword, setCurrentPassword] = useState(false);
    const handleClickShowCurrentPassword = () => setCurrentPassword((show) => !show);
    const handleMouseDownCurrentPassword = (event) => {
        event.preventDefault();
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [showPasswordC, setShowPasswordC] = useState(false);
    const handleClickShowPasswordC = () => setShowPasswordC((showC) => !showC);
    const handleMouseDownPasswordC = (event) => {
        event.preventDefault();
    };

    return (

        <div className={`flex  h-[80vh] items-center justify-right justify-center`}>
            <div className={` max-w-md w-full  rounded-md p-8 bg-[#fff] `}style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(219, 207, 228, 0.7)' }}>
                <h1> <LockIcon sx={{ fontSize: 45 }} />Cambiar contraseña</h1>
                <div className="">
                    <form
                        noValidate
                        onSubmit={formik.handleSubmit}
                    >

                        <Stack spacing={3}>
                            <TextField
                                error={!!(formik.touched.currentPassword && formik.errors.currentPassword)}
                                fullWidth
                                color="secondary"
                                helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                                label="Contraseña actual"
                                name="currentPassword"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={formik.values.currentPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle currentPassword visibility"
                                                onClick={handleClickShowCurrentPassword}
                                                onMouseDown={handleMouseDownCurrentPassword}
                                                edge="end"
                                            >
                                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 3 }
                                }}
                            />
                            <TextField
                                error={!!(formik.touched.password && formik.errors.password)}
                                fullWidth
                                color="secondary"
                                helperText={formik.touched.password && formik.errors.password}
                                label="Nueva contraseña"
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

                            <TextField
                                error={!!(formik.touched.passwordC && (formik.errors.passwordC || formik.values.password !== formik.values.passwordC))}
                                fullWidth
                                color="secondary"
                                helperText={
                                    (formik.touched.passwordC && formik.errors.passwordC) ||
                                    (formik.values.password !== formik.values.passwordC && 'Las contraseñas no coinciden')
                                }
                                label="Confirmar contraseña"
                                name="passwordC"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type={showPasswordC ? 'text' : 'password'}
                                value={formik.values.passwordC}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPasswordC}
                                                onMouseDown={handleMouseDownPasswordC}
                                                edge="end"
                                            >
                                                {showPasswordC ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 3 },
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
                        <div>
                            <Button
                                fullWidth
                                size="large"
                                sx={{
                                    mt: 3,
                                    backgroundColor: '#8F3C8A', // Establece el color de fondo del botón
                                    '&:hover': {
                                        backgroundColor: '#b57edc', // Establece el color de fondo al pasar el mouse por encima
                                    },
                                }}
                                type="submit"
                                variant="contained"
                                color="success"
                            >
                                Cambiar la contraseña
                            </Button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordPage
