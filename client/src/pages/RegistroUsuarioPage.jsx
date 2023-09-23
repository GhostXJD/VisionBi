import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUsuarioRequest } from '../api/usuarios'
import Swal from 'sweetalert2'

function RegistroPage() {

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { signup, isAuthenticated, errors: registroError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/inicio')
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

        if (dvIngresado.toUpperCase() === dvCalculado) {
            const rutFormateado = rutNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dvIngresado;
            return rutFormateado;
        } else {
            Swal.fire({
                icon: 'info',
                text: 'El RUT ingresado no es válido',
                confirmButtonColor: 'rgb(158 173 56)',
            });
            return "";
        }
    };

    const onSubmit = handleSubmit(async (values) => {
        const rutFormateado = formatearRut(values.rut);
        if (rutFormateado !== "") {
            values.rut = rutFormateado;
            values.active = true
            createUsuarioRequest(values)
            navigate('/ListarUsuarios')
        }
    })

    return (
        <div className='flex h-screen items-center justify-center'>

            <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
                {registroError.map((error, i) => (
                    <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
                        {error}
                    </div>
                ))}
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        {...register("nombre", { required: true })}
                        className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'
                        placeholder=' Ingrese su nombre'
                    />
                    {errors.nombre && (
                        <p className='text-red-500'>Se necesita nombre</p>
                    )}
                    <input
                        type="text"
                        {...register("rut", { required: true })}
                        className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'
                        placeholder=' Ingrese su rut'
                        onBlur={(e) => {
                            const rutFormateado = formatearRut(e.target.value);

                            if (rutFormateado !== "") {
                                e.target.value = rutFormateado;
                            } else {
                                e.target.value = "";
                            }
                        }}
                    />
                    {errors.rut && (
                        <p className='text-red-500'>Se necesita rut</p>
                    )}
                    <input
                        type="email"
                        {...register("correo", { required: true, pattern: { value: "([a-zA-Z0-9]([^ @&%$\\\/()=?¿!.,:;]?|\d?)+[a-zA-Z0-9][\.]){1,2}" } })}
                        className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'
                        placeholder=' Ingrese su correo'
                    />
                    {errors.correo && (
                        <p className='text-red-500'>Se necesita correo</p>
                    )}
                    <input
                        type="password"
                        {...register("password", { required: true })}
                        className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'
                        placeholder=' Ingrese su contraseña'
                    />
                    {errors.password && (
                        <p className='text-red-500'>Se necesita contraseña</p>
                    )}
                    <input
                        type="password"
                        {...register("confirmarPassword", { required: true, validate: value => value === watch('password') || "Las contraseñas no coinciden" })}
                        className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'
                        placeholder=' Confirme su contraseña'
                    />
                    {errors.confirmarPassword && (
                        <p className='text-red-500'>{errors.confirmarPassword.message}</p>
                    )}
                    {errors.confirmarPassword && (
                        <p className='text-red-500'>Se necesita confirmar contraseña</p>
                    )}
                    <select
                        {...register("tipoUsuario", { required: true })}
                        className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'>
                        <option disabled={true}>Seleccione tipo de usuario</option>
                        <option value="representante">Representante</option>
                        <option value="empleado">Empleado</option>
                    </select>
                    <button className='bg-zinc-400 px-3 py-1 rounded-lg' type="submit">Registrar</button>
                </form>
            </div>
        </div>

    );
}

export default RegistroPage