import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [uiMode, setUiMode] = useState(localStorage.getItem('uiMode') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-ui-mode', uiMode);
        localStorage.setItem('uiMode', uiMode);
    }, [uiMode]);

    const toggleUiMode = () => {
        setUiMode(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ uiMode, toggleUiMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
