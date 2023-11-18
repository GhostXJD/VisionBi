import { createContext, useState, useContext, useEffect } from "react";
import { registroRequest, loginRequest, verifyTokenRequet } from '../api/auth';
import { createCompanyRequest } from '../api/company'
import Cookies from 'js-cookie';
import bcrypt from 'bcryptjs';

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

    const signup = async (usuario, company) => {
        try {
            const res = await registroRequest(usuario)
            await createCompanyRequest(company)
            setUsuario(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setErrors(error.response.data);
        }
    }


    const signin = async (usuario) => {
        try {
            const res = await loginRequest(usuario);

            if (!res.data.active) {
                setIsAuthenticated(false);
                setUsuario(null);
                throw new Error("Usuario inactivo");
                // Aquí puedes redireccionar o mostrar un mensaje al usuario sobre su estado inactivo
            }

            setIsAuthenticated(true);
            setUsuario(res.data);

            const rutSinFormato = res.data.rut.replace(/\./g, "").replace("-", "").trim();
            const funPass = rutSinFormato.substring(0, 5);

            const isPasswordValid = await bcrypt.compare(funPass, res.data.password);
            if (isPasswordValid) {
                window.location.href = '/resetPass';
            }
        } catch (error) {
            if (error.message === "Usuario inactivo") {
                // Aquí puedes redireccionar o mostrar un mensaje al usuario sobre su estado inactivo
                alert("Usuario inactivo, no puedes iniciar sesión");
            } else {
                if (Array.isArray(error.response.data)) {
                    setErrors(error.response.data);
                } else {
                    setErrors([error.response.data.mesagge]);
                }
            }
            setIsAuthenticated(false);
            setUsuario(null);
        }
    };

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
            logout,
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;