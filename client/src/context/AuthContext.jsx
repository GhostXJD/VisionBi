import { createContext, useState, useContext, useEffect } from "react";
import { registroRequest, loginRequest, verifyTokenRequet } from '../api/auth';
import Cookies from 'js-cookie';

export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth called with no context");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signup = async (usuario) => {
        try {
            const res = await registroRequest(usuario)
            setUsuario(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            // console.log(error.response)
            setErrors(error.response.data);
        }
    }

    const signin = async (usuario) => {
        try {
            const res = await loginRequest(usuario)
            console.log(res)
            setIsAuthenticated(true)
            setUsuario(res.data)
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.mesagge]);
        }
    }

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUsuario(null);
    }

    const hasRole = (role) => usuario?.tipoUsuario === role;

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [errors]);

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();


            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                return setUsuario(null);
            }

            try {
                const res = await verifyTokenRequet(cookies.token);
                if (!res.data) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }
                setIsAuthenticated(true);
                setUsuario(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
                setUsuario(null);
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            hasRole,
            loading,
            usuario,
            isAuthenticated,
            errors,
            logout
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;