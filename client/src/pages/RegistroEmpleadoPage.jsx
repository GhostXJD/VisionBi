import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUsuarioRequest } from '../api/usuarios'
import Swal from 'sweetalert2'
import { useTheme } from '../context/ThemeContext';
import Stack from '@mui/material/Stack';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';

function RegistroEmpleadoPage() {

    const [rutError, setRutError] = useState("");
    const { isAuthenticated, errors: registroError, usuario } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        if (!isAuthenticated) navigate('/');
    }, [isAuthenticated]);

    const calcularDigitoVerificador = (rutSinDigito) => {
        let suma = 0;
        let multiplicador = 2;

        for (let i = rutSinDigito.length - 1; i >= 0; i--) {
            suma += parseInt(rutSinDigito[i]) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }

        const digito = 11 - (suma % 11);

        if (digito === 11) {
            return "0";
        } else if (digito === 10) {
            return "K";
        } else {
            return digito.toString();
        }
    };

    const formatearRut = (rut) => {
        const rutSinFormatear = rut.replace(/\./g, "").replace("-", "").trim();
        const rutNum = rutSinFormatear.slice(0, -1);
        const dvIngresado = rutSinFormatear.slice(-1);
        const dvCalculado = calcularDigitoVerificador(rutNum);

        if (dvIngresado === dvCalculado) {
            setRutError("");
            const rutFormateado = rutNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dvIngresado;
            return rutFormateado;
        } else {
            const rutFormateadoMal = rutNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dvIngresado;
            setRutError("This RUT does not exist");
            return rutFormateadoMal;
        }
    };

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            rut: '',
            correo: '',
            submit: null
        },
        validationSchema: Yup.object({
            nombre: Yup
                .string()
                .max(255)
                .required('First name is required'),
            apellido: Yup
                .string()
                .max(255)
                .required('Last name is required'),
            rut: Yup
                .string()
                .max(12, 'Rut must be at most 12 characters')
                .matches(/^(\d{1,2}\.\d{3}\.\d{3}-[\dkK])$/, 'Invalid RUT format')
                .required('Rut is required'),
            correo: Yup
                .string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
        }),

        onSubmit: async (values, helpers) => {
            try {
                //RUT Persona
                const rutSinFormato = values.rut.replace(/\./g, "").replace("-", "").trim();
                const funPass = rutSinFormato.substring(0, 5);
                const dvIngresado = rutSinFormato.slice(-1);
                const rutNum = rutSinFormato.slice(0, -1);
                const dvCalculado = calcularDigitoVerificador(rutNum);


                if (dvIngresado === dvCalculado) {
                    const rutFormateado = formatearRut(values.rut);
                    values.rut = rutFormateado;

                    const userData = {
                        nombre: values.nombre,
                        apellido: values.apellido,
                        rut: values.rut,
                        correo: values.correo,
                        password: funPass,
                        tipoUsuario: "empleado",
                        active: true,
                        company: usuario.company
                    }
                    await createUsuarioRequest(userData)
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario creado exitosamente',
                        text: 'La contraseña se define automaticamente como los primeros 5 dígitos del Rut',
                        confirmButtonColor: '#8F3C8A',
                    }).then(() => {
                        // Redirigir al usuario a la página de inicio después de hacer clic en "Ok"
                        window.location.replace('/ListarEmpleados');
                    });

                } else {
                    setRutError("This RUT does not exist");
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
            <div className={` max-w-md w-full  rounded-md p-8 bg-[#fff] `} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(219, 207, 228, 0.7)' }}>
                <h1 className='regUserTittle'> <PersonAddAlt1RoundedIcon sx={{ fontSize: 45 }} /> Registrar Usuario</h1>
                <div className="registroEmpCard" >
                    <form

                        noValidate
                        onSubmit={formik.handleSubmit}
                    >
                        <Stack spacing={3} >
                            
                                <div className='regEmpForm'>
                                    <TextField
                                        className='textForm'
                                        color="secondary"
                                        error={!!(formik.touched.nombre && formik.errors.nombre)}
                                        helperText={formik.touched.nombre && formik.errors.nombre}
                                        label="First Name"
                                        name="nombre"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.nombre}
                                        InputProps={{
                                            sx: { borderRadius: 3 }
                                        }}
                                    />
                                    <TextField
                                        className='textForm'
                                        color="secondary"
                                        error={!!(formik.touched.apellido && formik.errors.apellido)}
                                        helperText={formik.touched.apellido && formik.errors.apellido}
                                        label="Last Name"
                                        name="apellido"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.apellido}
                                        InputProps={{
                                            sx: { borderRadius: 3 }
                                        }}
                                    />
                                </div>
                                <div className='regEmpForm'>
                                    <TextField
                                        className='textFormA'
                                        color="secondary"
                                        error={!!(formik.touched.rut && formik.errors.rut) || !!rutError}
                                        helperText={formik.touched.rut && formik.errors.rut ? formik.errors.rut : rutError}
                                        label="Rut"
                                        name="rut"
                                        fullWidth
                                        onBlur={(e) => {
                                            const formattedRut = formatearRut(e.target.value);
                                            formik.handleBlur(e);
                                            if (formattedRut !== e.target.value) {
                                                e.target.value = formattedRut;
                                                formik.setFieldValue('rut', formattedRut);
                                            }
                                        }}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.rut}
                                        InputProps={{
                                            sx: { borderRadius: 3 }
                                        }}
                                    />
                                </div>
                                <div className='regEmpForm'>
                                    <TextField
                                        className='textFormA'
                                        color="secondary"
                                        error={!!(formik.touched.correo && formik.errors.correo)}
                                        helperText={formik.touched.correo && formik.errors.correo}
                                        label="Email Address"
                                        name="correo"
                                        fullWidth
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="email"
                                        value={formik.values.correo}
                                        InputProps={{
                                            sx: { borderRadius: 3 }
                                        }}
                                    />
                                </div>
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
                        <div className="LoginSeparacion">
                            <Button
                                color="secondary"
                                size="large"
                                sx={{ mt: 3 }}
                                type="submit"
                                variant="contained"
                                font-family='Poppins'
                            >
                                Create user
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>


    );
}

export default RegistroEmpleadoPage