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
            main: '#A3A3A3', //greyish-blue
          },
          secondary: {
            main: '#880808', //red
          },
          background: {
            default: '#161617', 
            paper: '#151515',
          },
          text: {
            primary: '#FFFFFF', // This will style primary text color

          }
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