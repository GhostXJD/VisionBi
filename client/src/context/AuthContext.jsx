import { createContext, useState, useContext, useEffect } from "react";
import { registroRequest, loginRequest } from '../api/auth';

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
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.mesagge]);
        }
    }

    useEffect(() =>{
        if (errors.length > 0) {
            const timer = setTimeout(()=>{
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            usuario,
            isAuthenticated,
            errors
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}