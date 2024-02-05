import { IconButton } from "@mui/material";
import { useThemeContext } from "../theme/ThemeContextProvider";
import { BrightnessMedium } from "@mui/icons-material";

type ntProps = {
    hasText: boolean
}

function NightmodeToggle({ hasText }: ntProps) {

    const { mode, toggleColorMode } = useThemeContext();

    return (
        <IconButton
            onClick={() => { toggleColorMode() }}
            sx={{
                height: 40,
                width: 40,
            }}>
            <BrightnessMedium />
        </IconButton>
    )
}

export default NightmodeToggle