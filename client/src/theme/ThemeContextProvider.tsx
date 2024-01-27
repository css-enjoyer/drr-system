import { createTheme, Theme } from "@mui/material";
import { createContext, useContext } from "react";
import { useColorTheme } from "./useColorTheme";

// declare prop types for theme context
type ThemeContextPropType = {
    mode: string;
    toggleColorMode: () => void;
    theme: Theme;
}
// create and export theme context, with initial values
// context is a specialized prop which can be passed directly to far children
export const ThemeContext = createContext<ThemeContextPropType>({
    mode: "light",
    toggleColorMode: () => { },
    theme: createTheme(),
});

// declare prop type for theme context
type TCPPropType = {
    children: JSX.Element;
}
// create and export theme context provider, used to wrap elements and provide theme
export const ThemeContextProvider = ({ children }: TCPPropType) => {
    const value = useColorTheme();
    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};

// create and export hook, enables use of theme context
export const useThemeContext = () => {
    return useContext(ThemeContext);
}