import { createContext, useContext, useState, useEffect } from 'react';

// Crea el contexto del tema
const ThemeContext = createContext();

// Hook personalizado para usar el contexto del tema
export function useTheme() {
    return useContext(ThemeContext);
}

// Proveedor de tema que se utilizará en la parte superior de la jerarquía de componentes
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Determina el tema según la preferencia del sistema
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        } else {
            return 'light';
        }
    });

    // Cambia el tema cuando el botón es presionado
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Efecto para aplicar el tema al documento HTML
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
