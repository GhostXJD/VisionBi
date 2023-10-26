import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
    // Obtener el tema guardado en localStorage o establecer 'light' como valor predeterminado
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const toggleTheme = () => {
        // Cambiar el tema entre 'light' y 'dark'
        const newTheme = theme === 'light' ? 'dark' : 'light';

        // Guardar el nuevo tema en localStorage
        localStorage.setItem('theme', newTheme);

        setTheme(newTheme);
    };

    useEffect(() => {
        // Aplicar el tema al elemento raíz del documento (html)
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
