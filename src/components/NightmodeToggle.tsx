import { IconButton } from "@mui/material";
import { useThemeContext } from "../theme/ThemeContextProvider";
import { BrightnessMedium } from "@mui/icons-material";
import { ReactNode } from "react";

type ntProps = {
    children: ReactNode
}

function NightmodeToggle(props: ntProps) {

    const { mode, toggleColorMode } = useThemeContext();

    return (
        <IconButton disableRipple onClick={() => { toggleColorMode() }} sx={{color: "inherit"}}>
            <BrightnessMedium />
            {props.children}
        </IconButton>
    )
}

export default NightmodeToggle