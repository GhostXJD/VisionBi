import { Link } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';
import { useAuth } from "../context/AuthContext";
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LogoutIcon from '@mui/icons-material/Logout';
import MessageIcon from '@mui/icons-material/Message';
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';

function SideMenu({ handleMenuClose, handleDrawerClose }) {
    const theme = useTheme()
    const { hasRole, logout } = useAuth();

    const handleLogout = () => {
        logout();
        handleDrawerClose();
        handleMenuClose();
    };

    return (
        <aside className={`flex flex-col custom-scrollbar w-64 h-screen px-5 py-1 overflow-y-auto  text-white border-r rtl:border-r-0 rtl:border-l ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>

            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav className="-mx-3 space-y-6 ">
                    {(hasRole("representante") || hasRole("empleado")) && (
                        <>
                            <div className="space-y-3 ">
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <DashboardRoundedIcon className="" />
                                    <Link to='/dashboard'><span className="mx-2 text-sm font-medium">Panel principal</span></Link>
                                </li>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <DashboardRoundedIcon className="" />
                                    <Link to='/dashboardByCategory'><span className="mx-2 text-sm font-medium">Panel por categoría</span></Link>
                                </li>
                            </div>

                            <div className="space-y-3 ">
                                <label className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">Análisis</label>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <SignalCellularAltRoundedIcon className="" />
                                    <Link to='/revenue-by-category'><span className="mx-2 text-sm font-medium">Ingresos por categoría</span></Link>
                                </li>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <SignalCellularAltRoundedIcon className="" />
                                    <Link to='/sales-by-neighborhood'><span className="mx-2 text-sm font-medium">Ventas por comuna</span></Link>
                                </li>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <SignalCellularAltRoundedIcon className="" />
                                    <Link to='/sales-trend-over-time'><span className="mx-2 text-sm font-medium">Tendencia de ventas</span></Link>
                                </li>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <SignalCellularAltRoundedIcon className="" />
                                    <Link to='/sales-by-month'><span className="mx-2 text-sm font-medium">Ventas mensuales</span></Link>
                                </li>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <SignalCellularAltRoundedIcon className="" />
                                    <Link to='/sales-by-state'><span className="mx-2 text-sm font-medium">Ventas por región</span></Link>
                                </li>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <SignalCellularAltRoundedIcon className="" />
                                    <Link to='/orders-by-month'><span className="mx-2 text-sm font-medium">Pedidos por mes</span></Link>
                                </li>

                            </div>

                            <div className="space-y-3 ">
                                <label className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">Carga de Datos</label>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <FilePresentRoundedIcon className="" />
                                    <Link to='/uploadfile'><span className="mx-2 text-sm font-medium">Subir archivo</span></Link>
                                </li>
                            </div>

                        </>
                    )}

                    {hasRole('admin') && (
                        <>
                            <div className="space-y-3 ">
                                <label className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">Administración</label>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <GroupRoundedIcon className="" />
                                    <Link to='/ListarUsuarios'><span className="mx-2 text-sm font-medium">Usuarios</span></Link>
                                </li>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <ApartmentRoundedIcon className="" />
                                    <Link to='/ListarCompania'><span className="mx-2 text-sm font-medium">Compañías</span></Link>
                                </li>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <MessageIcon className="" />
                                    <Link to='/ListarMensajes'><span className="mx-2 text-sm font-medium">Mensajes</span></Link>
                                </li>
                            </div>
                        </>
                    )}
                    {hasRole('representante') && (
                        <>
                            <div className="space-y-3 ">
                                <label className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">Administración</label>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <PersonAddAlt1Icon />
                                    <Link to='/RegistrarEmpleado'><span className="mx-2 text-sm font-medium">Añadir empleado</span></Link>
                                </li>
                                <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                                    <GroupRoundedIcon className="" />
                                    <Link to='/ListarEmpleados'><span className="mx-2 text-sm font-medium">Empleados</span></Link>
                                </li>
                            </div>
                        </>
                    )}
                    <div className="py-9 ">
                        <li className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-[#7f3ca5]">
                            <Link to='/' onClick={handleLogout}><LogoutIcon /> Salir</Link>
                        </li>
                    </div>
                </nav>
            </div>
        </aside>
    )
}

export default SideMenu
