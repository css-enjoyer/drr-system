import { PaletteMode, createTheme, Theme } from "@mui/material";
import { useMemo, useState, useEffect } from "react";

// function that triggers use and toggle of theme
export const useColorTheme = () => {
    // create theme state initial "light"
    const [mode, setMode] = useState<PaletteMode>(() => {
      const storedMode = localStorage.getItem("themeMode");
      return (storedMode as PaletteMode) || "light";
  });

    // toggle theme state value based on previous value
    const toggleColorMode = () => {
      const newMode = mode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
        setMode(newMode);
  };

  useEffect(() => {
    const storedMode = localStorage.getItem("themeMode");
    if (storedMode && storedMode !== mode) {
        setMode(storedMode as PaletteMode);
    }
  }, []);

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

  const modifiedTheme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);

  return {
      theme: modifiedTheme,
      mode,
      toggleColorMode,
  };
};