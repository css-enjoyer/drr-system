import { PaletteMode, createTheme } from "@mui/material";
import { useMemo, useState } from "react";

// function that triggers use and toggle of theme
export const useColorTheme = () => {
    // create theme state initial "light"
    const [mode, setMode] = useState<PaletteMode>("light");

    // toggle theme state value based on previous value
    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        console.log("Theme is", mode);
    }

    // material ui theme format
    const theme = ({
        palette: {
            mode: 'dark',
        },
    });
    
    // useMemo hook allow caching to prevent recalculation of expensive resources
    // creates a new theme on state toggle
    const modifiedTheme = useMemo(
        () =>
            createTheme({
                ...theme,
                palette: {
                    ...theme.palette,
                    mode,
                },
            }),
        [mode] // useMemo only fires when this mode state value changes
    );
    
    return {
        theme: modifiedTheme,
        mode,
        toggleColorMode,
    };
}