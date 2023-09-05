import { useForm } from 'react-hook-form'
import { registroRequest } from '../api/auth';

function RegistroPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    values.tipoUsuario = "empresa"
    values.active = false 
    const res = await registroRequest(values)
  })

  return (
    <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
      <form
        onSubmit={onSubmit}>
        <input type="text" {...register("nombre", { required: true })}
          className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'
          placeholder='Ingrese su nombre'
        />
        <input type="email" {...register("correo", { required: true })}
          className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'
          placeholder='Ingrese su correo'
        />
        <input type="password" {...register("password", { required: true })}
          className='w-full bg-zinc-700 text-white px4 py-2 rounded-md my-2'
          placeholder='Ingrese su contraseña'
        />
        <button type="submit">Registrarse</button>
      </form>

    </div>
  )
}

export default RegistroPage

