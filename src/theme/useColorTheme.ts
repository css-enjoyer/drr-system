import { PaletteMode, createTheme, Theme } from "@mui/material";
import { useMemo, useState } from "react";

// function that triggers use and toggle of theme
export const useColorTheme = () => {
    // create theme state initial "light"
    const [mode, setMode] = useState<PaletteMode>("light");

    // toggle theme state value based on previous value
    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        console.log("Theme is", mode);
    };

    // Define your light and dark themes
    const lightTheme: Theme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#6FA1D2', 
            },
            secondary: {
                main: '#FAD02E', 
            },
            background: {
                default: '#F7F7F7', 
                paper: '#FFFFFF', 
            },
        },
    });

    const darkTheme: Theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#79f1e8',
                dark: '#ffffff',
            },
            secondary: {
                main: '#e2e07b',
                contrastText: 'rgba(0,0,0,0.87)',
            },
            background: {
                default: '#292929',
                paper: '#333232',
            },
        },
    });

    // useMemo hook allows caching to prevent recalculation of expensive resources
    // Creates a new theme on state toggle
    const modifiedTheme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);

    return {
        theme: modifiedTheme,
        mode,
        toggleColorMode,
    };
};
