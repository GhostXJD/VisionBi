import bcrypt from 'bcryptjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { updatePassUsuarioRequest } from '../api/usuarios'
import Swal from 'sweetalert2'
import LockIcon from '@mui/icons-material/Lock';

function recoverPassPage() {

    const formik = useFormik({
        initialValues: {
            mail: '',
            submit: null
        },
        validationSchema: Yup.object({
            mail: Yup
                .string()
                .max(255)
                .required('Ingresa un correo'),
        }),

        onSubmit: async (values, helpers) => {
            try {

                 

                const userData = {
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    rut: usuario.rut,
                    correo: usuario.correo,
                    password: funPass,
                    tipoUsuario: usuario.tipoUsuario,
                    active: true,
                    company: usuario.company
                }
                await updatePassUsuarioRequest(usuario.id, userData)
                if (updatePassUsuarioRequest(userData)) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Contraseña se ha restablecida correctamente',
                        text: 'Tu contraseña son los primeros 5 dígitos de tu rut sin puntos',
                        confirmButtonColor: '#8F3C8A',
                    }).then(() => {
                        window.location.replace('/login');
                    });
                }

            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        }
    });

    return (

        <div className={`flex  h-[80vh] items-center justify-right justify-center`}>
            <div className={` max-w-md w-full  rounded-md p-8 bg-[#fff] `}style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(219, 207, 228, 0.7)' }}>
                <h1> <LockIcon sx={{ fontSize: 45 }} /> Create your password</h1>
                <div className="">
                    <form
                        noValidate
                        onSubmit={formik.handleSubmit}
                    >

                        <Stack spacing={3}>
                            <TextField
                                error={!!(formik.touched.mail && formik.errors.mail)}
                                fullWidth
                                color="secondary"
                                helperText={formik.touched.mail && formik.errors.mail}
                                label="Correo"
                                name="mail"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="email"
                                value={formik.values.mail}
                                InputProps={{
                                    sx: { borderRadius: 3 }
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
                                Restablecer contraseña
                            </Button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default recoverPassPage