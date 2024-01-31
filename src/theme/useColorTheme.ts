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
                main: '#002fa5',
            },
            secondary: {
                main: '#902F57',
            },
            background: {
                default: '#e9e9e9',
                paper: '#eeeeee',
            },
        },
    });

    const darkTheme: Theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#2382ff',
            },
            secondary: {
                main: '#e7f179',
            },
            background: {
                default: '#000000',
                paper: '#1f1f1f',
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
