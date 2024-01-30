import { Button } from "@mui/material";
import { useThemeContext } from "../theme/ThemeContextProvider";
import { BrightnessMedium } from "@mui/icons-material";

type ntProps = {
    hasText: boolean
}

function NightmodeToggle({hasText}: ntProps) {

    const { mode, toggleColorMode } = useThemeContext();

    return (
        <Button
            centerRipple = {false}
            variant = 'text'
            endIcon={<BrightnessMedium />}
            onClick={() => { toggleColorMode() }}
            sx={{
                height: 40,
                width: 40,
                color: 'white',
            }}>
            {/* {hasText ? '' : `${mode} mode`} */}
        </Button>
    )
}

export default NightmodeToggle