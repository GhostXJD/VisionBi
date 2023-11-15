//TODO: Validar el rut de la compañia existente
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import vision from '../images/visionBI (1).png';
import Stack from '@mui/material/Stack';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function RegistroPage() {

  const [rutError, setRutError] = useState("");
  const [rutErrorBusiness, setRutErrorBusiness] = useState("");
  const { signup, errors: registroError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated])

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

  const calcularDigitoVerificadorEmpresa = (rutSinDigito) => {
    let suma = 0;
    let multiplicador = 2;

    for (let i = rutSinDigito.length - 1; i >= 0; i--) {
      suma += parseInt(rutSinDigito[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const digito = 11 - (suma % 11);

    if (digito === 11) {
      return "0";
    } else {
      return digito.toString();
    }
  };

  const validarRutEmpresa = (businessRut) => {
    const rutSinFormatearBusiness = businessRut.replace(/\./g, "").replace("-", "").trim();
    const rutNumBusiness = rutSinFormatearBusiness.slice(0, -1);
    const dvIngresadoBusiness = rutSinFormatearBusiness.slice(-1);
    const dvCalculadoBusiness = calcularDigitoVerificadorEmpresa(rutNumBusiness);

    if (dvIngresadoBusiness === dvCalculadoBusiness) {
      setRutErrorBusiness("");
      const rutFormateadoBusiness = rutNumBusiness.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dvIngresadoBusiness;
      return rutFormateadoBusiness;
    } else {
      setRutErrorBusiness("This RUT does not exist");
      const rutFormateadoBusinessMal = rutNumBusiness.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dvIngresadoBusiness;
      return rutFormateadoBusinessMal;
    }
  };

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      rut: '',
      correo: '',
      password: '',
      passwordC: '',
      businessRut: '',
      businessName: '',
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
      password: Yup
        .string()
        .max(255)
        .min(5, 'Must be at least 5 characters')
        .required('Password is required'),
      passwordC: Yup
        .string()
        .max(255)
        .min(5, 'Must be at least 5 characters')
        .required('Repeat your password'),
      businessRut: Yup
        .string()
        .max(255)
        .required('Business rut is required'),
      businessName: Yup
        .string()
        .max(255)
        .required('Business name is required')
    }),

    onSubmit: async (values, helpers) => {
      try {
        //RUT Persona
        const rutSinFormato = values.rut.replace(/\./g, "").replace("-", "").trim();
        const dvIngresado = rutSinFormato.slice(-1);
        const rutNum = rutSinFormato.slice(0, -1);
        const dvCalculado = calcularDigitoVerificador(rutNum);

        //RUT Empresa
        const rutSinFormatearBusiness = values.businessRut.replace(/\./g, "").replace("-", "").trim();
        const rutNumBusiness = rutSinFormatearBusiness.slice(0, -1);
        const dvIngresadoBusiness = rutSinFormatearBusiness.slice(-1);
        const dvCalculadoBusiness = calcularDigitoVerificadorEmpresa(rutNumBusiness);

        if (dvIngresadoBusiness === dvCalculadoBusiness) {
          const rutFormateadoBusiness = validarRutEmpresa(values.businessRut);
          values.businessRut = rutFormateadoBusiness;
          if (dvIngresado === dvCalculado) {
            const rutFormateado = formatearRut(values.rut);
            values.rut = rutFormateado;
            if (values.password !== values.passwordC) {
              formik.setFieldError('passwordC', 'Passwords do not match');
              return;
            }

            const userData = {
              nombre: values.nombre,
              apellido: values.apellido,
              rut: values.rut,
              correo: values.correo,
              password: values.password,
              tipoUsuario: "representante",
              active: true,
              company: values.businessRut
            }
            const companyData = {
              businessRut: values.businessRut,
              businessName: values.businessName,
              agent: values.rut
            }

            await signup(userData, companyData);

          } else {
            setRutError("This RUT does not exist");
          }
        } else {
          setRutErrorBusiness("This RUT does not exist");
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (registroError.length > 0) {
      for (const errores of registroError) {
        if (errores == "El correo ya existe") {
          formik.setFieldError('correo', 'This email already exists');
        } else if (errores == "Este rut ya existe") {
          formik.setFieldError('rut', 'This RUT already exists');
        } else if (errores == "Este RUT de empresa ya existe") {
          formik.setFieldError('businessRut', 'This RUT already exists');
        }
        else {
          navigate("/dashboard")
        }
      }
    }
  }, [registroError]);



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
    <div className={`flex h-[70vh] items-center justify-center ${theme === 'dark' ? 'dark' : ''}`}>
      <div className={` max-w-md w-full rounded-md ${theme === 'dark' ? "#3b0764" : "bg-white"}`}>
        <div className={`RegistroCard ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white border-black'}`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(207, 195, 218, 0.7)', backgroundColor:'#fffdfe' }}>
          <div className="RegistroPrueba">
            <div className="LoginImg">
              <Link to="/"><img src={vision} alt="Descripción de la imagen" /></Link>
            </div>
            <div className="RegistroMsg">
              <h2 className='RegistroTxt1'>Sign up</h2>
              <span className='Registrotxt2'>Enter your credentials to continue</span>
            </div>

            <div className="LoginSeparacion"></div>
            <hr className="LoginRecta" />
            <div className="LoginSeparacion"></div>

            <form

              noValidate
              onSubmit={formik.handleSubmit}
            >

              <Stack spacing={3}>
                <div className='names'>
                  <TextField
                  className='textform'
                    color="secondary"
                    error={!!(formik.touched.nombre && formik.errors.nombre)}
                    fullWidth
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
                  className='textformA'
                    color="secondary"
                    error={!!(formik.touched.apellido && formik.errors.apellido)}
                    fullWidth
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
                <TextField
                  color="secondary"
                  error={!!(formik.touched.rut && formik.errors.rut) || !!rutError}
                  helperText={formik.touched.rut && formik.errors.rut ? formik.errors.rut : rutError}
                  label="Rut"
                  name="rut"
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

                <TextField
                  color="secondary"
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
                  color="secondary"
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

                <TextField
                  color="secondary"
                  error={!!(formik.touched.passwordC && (formik.errors.passwordC || formik.values.password !== formik.values.passwordC))}
                  fullWidth
                  helperText={
                    (formik.touched.passwordC && formik.errors.passwordC) ||
                    (formik.values.password !== formik.values.passwordC && 'Passwords do not match')
                  }
                  label="Confirm Password"
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

                <TextField
                  color="secondary"
                  error={!!(formik.touched.businessRut && formik.errors.businessRut) || !!rutErrorBusiness}
                  helperText={formik.touched.businessRut && formik.errors.businessRut ? formik.errors.businessRut : rutErrorBusiness}
                  label="Business rut"
                  name="businessRut"
                  onBlur={(e) => {
                    const formattedRut = validarRutEmpresa(e.target.value);
                    formik.handleBlur(e);
                    if (formattedRut !== e.target.value) {
                      e.target.value = formattedRut;
                      formik.setFieldValue('businessRut', formattedRut);
                    }
                  }}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.businessRut}
                  InputProps={{
                    sx: { borderRadius: 3 }
                  }}
                />

                <TextField
                  color="secondary"
                  error={!!(formik.touched.businessName && formik.errors.businessName)}
                  fullWidth
                  helperText={formik.touched.businessName && formik.errors.businessName}
                  label="Business name"
                  name="businessName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.businessName}
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

              <Button
                color="secondary"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Sing up
              </Button>
            </form>

            <div className="LoginSeparacion"></div>
            <hr className="LoginRecta" />
            <div className="LoginSeparacion"></div>

            <div className='RegistroAlredyAccount'>
              <Link to="/login" >
                Already have an account?
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistroPage