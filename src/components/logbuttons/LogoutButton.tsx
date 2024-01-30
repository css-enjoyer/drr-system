import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { IconButton } from "@mui/material";
import { LogoutSharp } from "@mui/icons-material";

function LogoutButton() {

    const logOut = async () => {
        try {
            await signOut(auth);
            if (auth == null) {
                console.log("No user signed in")
            } else {
                console.log("Sign out success")
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <IconButton centerRipple onClick={logOut} sx={{color: 'white'}}>
            <LogoutSharp />
        </IconButton>
    )
}

export default LogoutButton