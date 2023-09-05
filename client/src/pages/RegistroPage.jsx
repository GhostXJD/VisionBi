import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RegistroPage() {
  const { register, handleSubmit, formState: {
    errors
  } } = useForm();
  const { signup, isAuthenticated, errors: registroError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/csvDatos')
  }, [isAuthenticated])

  const onSubmit = handleSubmit(async (values) => {
    values.tipoUsuario = "empresa"
    values.active = true
    signup(values)
  })

  return (
    <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
      {registroError.map((error, i) => (
        <div className='bg-red-500 p-2 text-white' key={i}>
          {error}
        </div>
      ))
      }
      <form
        onSubmit={onSubmit}>
        <input type="text" {...register("nombre", { required: true })}
          className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'
          placeholder='Ingrese su nombre'
        />
        {errors.nombre && (
          <p className='text-red-500'>Se necesita nombre</p>
        )}
        <input type="email" {...register("correo", { required: true })}
          className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'
          placeholder='Ingrese su correo'
        />
        {errors.correo && (
          <p className='text-red-500'>Se necesita correo</p>
        )}
        <input type="password" {...register("password", { required: true })}
          className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'
          placeholder='Ingrese su contraseña'
        />
        {errors.password && (
          <p className='text-red-500'>Se necesita contraseña</p>
        )}
        <button type="submit">Registrarse</button>
      </form>

    </div>
  )
}

export default RegistroPage

