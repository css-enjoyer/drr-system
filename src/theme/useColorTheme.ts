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
                main: '#000500',
            },
            secondary: {
                main: '#902F57',
            },
            background: {
                default: '#e#FFFFFF',
                paper: '#eeeeee',
            },
        },
    });

    const darkTheme: Theme = createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#F4C644',
          },
          secondary: {
            main: '#F4C644',
          },
          background: {
            default: '#111111',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#F9F6E0', // This will style primary text color
            secondary: '#CCCCCC', // This will style secondary text color
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