import { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Always light mode – yellow & white theme
    const uiMode = 'light';

    return (
        <ThemeContext.Provider value={{ uiMode, toggleUiMode: () => { } }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
