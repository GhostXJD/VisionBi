import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

function Profile() {
  const { isAuthenticated, usuario } = useAuth();

  // Redirige al usuario a la página de inicio si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated]);
  return (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      <div className={`relative flex flex-col items-center rounded-[20px] w-[700px] max-w-[95%] mx-auto  bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-800 dark:text-white dark:!shadow-none p-3`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(207, 195, 218, 0.7)', backgroundColor:'#fffdfe' }}>
        <div className="perfil">
          <h4>
            <PersonRoundedIcon sx={{ fontSize: 45 }}/>
            Información general
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4 px-2 w-full">
          <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
            <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Nombres</p>
            <p className="text-base font-medium text-zinc-700 dark:text-white">
              {usuario.nombre}
            </p>
          </div>

          <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
          <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Apellidos</p>
            <p className="text-base font-medium text-zinc-700 dark:text-white">
              {usuario.apellido}
            </p>
          </div>

          <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
          <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Correo</p>
            <p className="text-base font-medium text-zinc-700 dark:text-white">
              {usuario.correo}
            </p>
          </div>

          <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
          <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Rut</p>
            <p className="text-base font-medium text-zinc-700 dark:text-white">
              {usuario.rut}
            </p>
          </div>
          <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
          <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Compañia</p>
            <p className="text-base font-medium text-zinc-700 dark:text-white">
              {usuario.company}
            </p>
          </div>

          <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
          <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Cargo</p>
            <p className="text-base font-medium text-zinc-700 dark:text-white">
              {usuario.tipoUsuario}
            </p>
          </div>
        </div>

        <div className="justify-center items-center py-3">
          <li className='bg-[#8F3C8A] px-3 py-1 rounded-lg h-8 scale-x-95 text-white'>
            <Link to='ChangePassword'>Cambiar contraseña</Link>
          </li>
        </div>
      </div>
    </div>

  )
}

export default Profile
