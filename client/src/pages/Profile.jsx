import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react';
import Navbar from '../components/Navbar';

function Profile() {
  const { isAuthenticated, usuario } = useAuth();

  // Redirige al usuario a la página de inicio si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) navigate('/inicio');
  }, [isAuthenticated]);
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <div className="relative flex flex-col items-center rounded-[20px] w-[700px] max-w-[95%] mx-auto bg-zinc-200 bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-800 dark:text-white dark:!shadow-none p-3">
          <div className="mt-2 mb-8 w-full">
            <h4 className="px-2 text-xl font-bold text-zinc-700 dark:text-white">
              Información general
            </h4>
            <p hidden className="mt-2 px-2 text-base text-gray-600">
              As we live, our hearts turn colder. Cause pain is what we go through
              as we become older. We get insulted by others, lose trust for those
              others. We get back stabbed by friends. It becomes harder for us to
              give others a hand. We get our heart broken by people we love, even
              that we give them all...
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 px-2 w-full">
            <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none">
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-base font-medium text-zinc-700 dark:text-white">
                {usuario.nombre}
              </p>
            </div>
      
            <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none">
              <p className="text-sm text-gray-600">Last Name</p>
              <p className="text-base font-medium text-zinc-700 dark:text-white">
                {usuario.apellido}
              </p>
            </div>
      
            <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none">
              <p className="text-sm text-gray-600">E-mail</p>
              <p className="text-base font-medium text-zinc-700 dark:text-white">
                {usuario.correo}
              </p>
            </div>
      
            <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none">
              <p className="text-sm text-gray-600">Rut</p>
              <p className="text-base font-medium text-zinc-700 dark:text-white">
                {usuario.rut}
              </p>
            </div>
            <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none">
              <p className="text-sm text-gray-600">Company</p>
              <p className="text-base font-medium text-zinc-700 dark:text-white">
                {usuario.company}
              </p>
            </div>
      
            <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none">
              <p className="text-sm text-gray-600">Job</p>
              <p className="text-base font-medium text-zinc-700 dark:text-white">
                {usuario.tipoUsuario}
              </p>
            </div>
      
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
