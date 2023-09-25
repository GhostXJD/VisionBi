import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import SideMenu from './SideMenu';
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
    backgroundColor: "#403E44",
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
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function Navbar() {
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
                    <ul className="flex gap-x-2">
                        <Typography variant="h6" noWrap component="div">
                            VisionBi
                        </Typography>
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
                                <li className='text-center px-9 py-1'>
                                    Bienvenido {usuario.nombre}!
                                </li>
                                <li className='bg-cyan-700 px-3 py-1 rounded-lg h-8 text-white'>
                                    <Link to='/perfil'>Perfil</Link>
                                </li>

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
                                <li className="bg-indigo-500 px-3 py-1 rounded-lg h-8 text-white">
                                    <Link to='/login' >Ingresar</Link>
                                </li>
                                <li className="bg-indigo-500 px-3 py-1  h-8 rounded-lg text-white">
                                    <Link to='/registro' >Registrarse</Link>
                                </li>
                            </>
                        )}
                    </ul>
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
                <Divider />

                <SideMenu />

            </Drawer>
            <Main open={open}>
                <DrawerHeader />
            </Main>
        </Box>
    );
}