import { getAuth, signOut } from "firebase/auth";
import { IconButton } from "@mui/material";
import { LogoutSharp } from "@mui/icons-material";

function LogoutButton() {
    const auth = getAuth();

    async function logOut() {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <IconButton centerRipple onClick={logOut} sx={{color: 'white'}}>
            <LogoutSharp />
        </IconButton>
    )
};

export default LogoutButton;