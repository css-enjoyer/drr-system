import { Button } from "@mui/material";
import { useThemeContext } from "../theme/ThemeContextProvider";
import { BrightnessMedium } from "@mui/icons-material";

type ntProps = {
    hasText: boolean
}

function NightmodeToggle(hasText: ntProps) {

    const { mode, toggleColorMode } = useThemeContext();

    return (
        <Button
            variant = 'outlined'
            startIcon={<BrightnessMedium />}
            onClick={() => { toggleColorMode() }}
            sx={{
                height: 20,
                width: 50,
            }}>
            {hasText ? '' : `${mode} mode`}
        </Button>
    )
}

export default NightmodeToggle