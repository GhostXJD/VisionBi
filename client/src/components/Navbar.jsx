import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import SideMenu from './SideMenu'
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/visionBI (1).png";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    backgroundColor: "#27272a",
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    backgroundColor: "#27272a",
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const { isAuthenticated, logout, usuario, hasRole } = useAuth();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <Link to='/inicio'>
                        <img src={logo} alt="Logo" className='logo-img' />
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{ mr: 2, ...(open && { display: 'none' }) }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <li className='text-center px-9 py-10'>
                                Bienvenido {usuario.nombre}!
                            </li>
                            <div className='ml-auto'>
                                <li className='bg-cyan-700 px-3 py-1 rounded-lg h-8 scale-x-95 text-white'>
                                    <Link to='/perfil'>Perfil</Link>
                                </li>
                            </div>
                            {hasRole('admin') && (
                                <>
                                    <li className='bg-zinc-400 px-3 py-1 rounded-lg h-8 text-white'>
                                        <Link to='/ListarUsuarios'>Lista de usuarios</Link>
                                    </li>
                                </>
                            )}
                            {hasRole('representante') && (
                                <>
                                    <li className='bg-lime-700 px-3 py-1 rounded-lg h-8 text-white'>
                                        <Link to='/RegistrarEmpleado'>Agregar empleado</Link>
                                    </li>
                                </>
                            )}
                            <li className="bg-red-700 px-3 py-1 rounded-lg h-8 text-white">
                                <Link to='/' onClick={() => { logout(); }}>Cerrar Sesión</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <div className='ml-auto'>
                                <li className="bg-indigo-500 px-3 py-1 rounded-lg h-8 text-white">
                                    <Link to='/login' >Ingresar</Link>
                                </li>
                            </div>
                            <li className="bg-indigo-500 px-3 py-1  h-8 rounded-lg text-white">
                                <Link to='/registro' >Registrarse</Link>
                            </li>

                        </>
                    )}

                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <SideMenu />
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
            </Main>
        </Box>
    );
}
