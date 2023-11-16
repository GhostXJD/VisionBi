import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '../context/ThemeContext';
import SideMenu from './SideMenu'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/visionBI (1).png";
import { purple } from '@mui/material/colors';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const drawerWidth = 257;
const appBarHeight = 116; // Establece la altura de la parte superior

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
    backgroundColor: theme === 'dark' ? '#fff' : '', // Cambia el color de fondo según el tema
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
    padding: theme.spacing(0),
    height: appBarHeight,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft({ children, hiddenRoutes }) {
    const { toggleTheme, theme } = useTheme();
    const [open, setOpen] = React.useState(false);
    const { isAuthenticated, logout, usuario } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const profile = () => {
        navigate("/perfil")
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null); // Cierra el menú
    };

    if (hiddenRoutes.find((hiddenRoute) => pathname == hiddenRoute)) {
        return children
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }} className="my-5">
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>

                    {isAuthenticated ? (
                        <>
                            <Link to='/dashboard'>
                                <img src={logo} alt="Logo" className='logo-img' />
                            </Link>
                            <IconButton
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{ color: purple[300], mr: 2, ...(open && { display: 'none' }) }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <li className={`text-center px-9 py-10 font-bold text-gray-500  dark:text-white `}>
                                Welcome {usuario.nombre}!
                            </li>

                            <div className='ml-auto'>
                                <Button
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenuOpen}
                                    color="secondary"
                                    className='text-gray-600 hover:text-[#8F3C8A]'
                                >
                                    <ManageAccountsIcon />

                                </Button>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={() => { toggleTheme(); }}
                                        className='flex items-center text-center px-4 py-1  h-8'>
                                        <div className="flex items-center space-x-2  mx-auto">
                                            <div>
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="w-6 h-6"
                                                >
                                                    {<svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" className="fill-[#8F3C8A]/20 stroke-[#8F3C8A]"></path><path d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836" className="stroke-[#8F3C8A]"></path></svg>}
                                                </svg>
                                            </div>
                                            <div>
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    className="w-6 h-6"
                                                >
                                                    {<svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path fillRule="evenodd" clipRule="evenodd" d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z" className="fill-[#8F3C8A]/20"></path><path d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z" className="fill-[#8F3C8A]"></path><path fillRule="evenodd" clipRule="evenodd" d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z" className="fill-[#8F3C8A]"></path></svg>}
                                                </svg>
                                            </div>
                                        </div>
                                    </MenuItem>

                                    <MenuItem className='text-gray-600 hover:text-[#8F3C8A]' onClick={() => { handleMenuClose(); profile(); }} >
                                        <AccountCircle className='text-[#8F3C8A]' /> Profile
                                    </MenuItem>

                                    <MenuItem className='text-gray-600 hover:text-[#8F3C8A]' onClick={() => { handleMenuClose(); logout(); handleDrawerClose(); }} >
                                        <LogoutIcon className='text-[#8F3C8A]' /> Log out
                                    </MenuItem>

                                </Menu>
                            </div>
                            <div hidden>
                                <li className='bg-cyan-700 px-3 py-1 rounded-lg h-8 scale-x-95 text-white'>
                                    <Link to='/perfil'>Profile</Link>
                                </li>
                            </div>
                            <button hidden className={`text-center px-3 py-1 h-8 bg-[#8F3C8A] rounded-3xl hover:bg-[#4b1c71]  dark:bg-[#8F3C8A] dark:hover:bg-[#b57edc]`}
                                onClick={toggleTheme}>
                                <div className="flex items-center space-x-2 ">
                                    <div>
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-6 h-6"
                                        >
                                            {<svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" className="fill-sky-400/20 stroke-sky-500"></path><path d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836" className="stroke-sky-500"></path></svg>}
                                        </svg>
                                    </div>
                                    <div>
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="w-6 h-6"
                                        >
                                            {<svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path fillRule="evenodd" clipRule="evenodd" d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z" className="fill-sky-400/20"></path><path d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z" className="fill-sky-500"></path><path fillRule="evenodd" clipRule="evenodd" d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z" className="fill-sky-500"></path></svg>}
                                        </svg>
                                    </div>
                                </div>
                            </button>
                            <li hidden className="border border-red-500 hover:border-red-300 bg-transparent  rounded-md text-red-500 hover:text-red-300 px-4 py-1  h-8">
                                <Link to='/' onClick={() => { logout(); }}><LogoutIcon />Log out</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <Link to='/'>
                                <img src={logo} alt="Logo" className='logo-img' />
                            </Link>
                            <div className="info-navbar">
                                <li className='dark:text-white'>
                                    <Link to='/mission' > Mission</Link>
                                </li>
                            </div>
                            <div className="info-navbar">
                                <li className='dark:text-white'>
                                    <Link to='/vision' > Vision</Link>
                                </li>
                            </div>
                            <div className="info-navbar">
                                <li className='dark:text-white'>
                                    <Link to='/aboutus' > About Us</Link>
                                </li>
                            </div>
                            <div className='ml-auto'>
                                <li className="bg-[#8F3C8A] px-3 py-1 rounded-lg h-8 text-white">
                                    <Link to='/login' >Sign in</Link>
                                </li>
                            </div>

                            <li hidden className="bg-[#b57edc] px-3 py-1  h-8 rounded-lg text-white">
                                <Link to='/registro' >Sign up</Link>
                            </li>
                            <button
                                hidden
                                className={`text-center px-3 py-1 h-8 bg-[#8F3C8A] rounded-3xl hover:bg-[#4b1c71]  dark:bg-[#8F3C8A] dark:hover:bg-[#b57edc]`}
                                onClick={toggleTheme}
                            >
                                <div className="flex items-center space-x-2 ">
                                    <div>
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-6 h-6"
                                        >
                                            {<svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" className="fill-sky-400/20 stroke-sky-500"></path><path d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836" className="stroke-sky-500"></path></svg>}
                                        </svg>
                                    </div>
                                    <div>
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="w-6 h-6"
                                        >
                                            {<svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path fillRule="evenodd" clipRule="evenodd" d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z" className="fill-sky-400/20"></path><path d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z" className="fill-sky-500"></path><path fillRule="evenodd" clipRule="evenodd" d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z" className="fill-sky-500"></path></svg>}
                                        </svg>
                                    </div>
                                </div>
                            </button>

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
                    <IconButton onClick={handleDrawerClose} sx={{ color: purple[300] }}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <SideMenu />
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                {children}
            </Main>
        </Box>
    );
}
