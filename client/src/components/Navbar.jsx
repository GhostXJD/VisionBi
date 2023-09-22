import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"


function Navbar() {

    const { isAuthenticated, logout, usuario } = useAuth();
    

    return (
        <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
            <Link to='/'>
                <h1 className="text-2xl font-bold">VisionBi</h1>
            </Link>
            <ul className="flex gap-x-2">
                {isAuthenticated ? (
                    <>
                        <li className='text-center px-3 py-1' >
                            Bienvenido {usuario.nombre}!
                        </li>
                        <li className='bg-lime-700 px-3 py-1 rounded-lg'>
                            <Link to='/RegistrarUsuario'>Agregar usuario</Link>
                        </li>
                        <li className='bg-zinc-400 px-3 py-1 rounded-lg'>
                            <Link to='/ListarUsuarios'>Lista de usuarios</Link>
                        </li>
                        <li className="bg-red-700 px-4 py-1 rounded-lg">
                            <Link to='/' onClick={() => { logout(); }} 
                            >Cerrar Sesión</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to='/login' 
                            className="bg-indigo-500 px-4 py-1 rounded-sm">Ingresar</Link>
                        </li>
                        <li>
                            <Link to='/registro' 
                            className="bg-indigo-500 px-4 py-1 rounded-sm">Registrarse</Link>
                        </li>
                    </>
                )
                }
            </ul >
        </nav >
    )
}

export default Navbar
