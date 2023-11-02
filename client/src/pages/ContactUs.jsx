import contact from "../images/contactus.png";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { createMessageRequest } from '../api/messages'
import Swal from 'sweetalert2'

import { Button, Typography } from '@mui/material';

function ContactUs() {
    const formik = useFormik({
        initialValues: {
            nombre: '',
            correo: '',
            message: '',
            submit: null
        },
        validationSchema: Yup.object({
            nombre: Yup
                .string()
                .max(255)
                .required('Name is required'),
            correo: Yup
                .string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            message: Yup
                .string()
                .max(255)
                .required('Please enter a message'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const msgData = {
                    nombre: values.nombre,
                    correo: values.correo,
                    message: values.message,
                }
                await createMessageRequest(msgData)
                Swal.fire({
                    icon: 'success',
                    text: 'Message sent',
                    confirmButtonColor: '#8F3C8A',
                }).then(() => {
                    // Redirigir al usuario a la página de inicio después de hacer clic en "Ok"
                    window.location.replace('/');
                });

            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        }
    });
    return (
        <section>
            <div className="about">
                <div className="about-banner">
                    <div className="presentation">
                        <h3>CONTACT US</h3>
                        <div className="form-contact">
                            <form

                                noValidate
                                onSubmit={formik.handleSubmit}
                            >
                                <Stack spacing={3}>
                                    <TextField
                                        error={!!(formik.touched.nombre && formik.errors.nombre)}
                                        fullWidth
                                        helperText={formik.touched.nombre && formik.errors.nombre}
                                        label="Name"
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
                                        error={!!(formik.touched.message && formik.errors.message)}
                                        fullWidth
                                        helperText={formik.touched.message && formik.errors.message}
                                        label="Message"
                                        name="message"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.message}
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
                                {/* Botón de ingresar */}
                                <div className="LoginSeparacion">
                                    <Button
                                        fullWidth
                                        size="large"
                                        sx={{ mt: 3 }}
                                        type="submit"
                                        variant="contained"
                                        font-family='Poppins'
                                    >
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="presentation-photo">
                        <img src={contact} alt="contact" className='about-img' />
                    </div>
                </div>
            </div>


        </section>
    );
}

export default ContactUs;