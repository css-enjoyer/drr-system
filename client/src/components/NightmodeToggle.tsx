import { Button } from "@mui/material";
import { useThemeContext } from "../theme/ThemeContextProvider";
import { BrightnessMedium } from "@mui/icons-material";

function NightmodeToggle() {
    const { mode, toggleColorMode } = useThemeContext();

    return (
        <Button
            variant="outlined"
            startIcon={<BrightnessMedium />}
            onClick={() => { toggleColorMode() }}
            sx={{ my: 2, color: 'white'}}>
            {mode} mode
        </Button>
    )
}

export default NightmodeToggle