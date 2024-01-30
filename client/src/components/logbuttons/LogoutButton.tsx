import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Button } from "@mui/material";
import { LogoutSharp } from "@mui/icons-material";

function LogoutButton() {

    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Button onClick={logOut} variant="contained" endIcon={<LogoutSharp />}>Sign Out</Button>
    )
}

export default LogoutButton