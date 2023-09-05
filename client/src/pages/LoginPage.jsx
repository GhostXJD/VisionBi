import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function LoginPage() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, errors: signinErrors } = useAuth();

  const onSubmit = handleSubmit(data => {
    signin(data)
  })

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
        {signinErrors.map((error, i) => (
          <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
            {error}
          </div>
        ))
        }
        <h1 className='text-2xl font-bold'></h1>
        <form
          onSubmit={onSubmit}>
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
          <button type="submit">Ingresar</button>
        </form>

        <p className='flex gap-x-2 justify-between'>
          No tienes una cuenta? <Link to='/registro'
            className='text-sky-500'>Crear una cuenta</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
