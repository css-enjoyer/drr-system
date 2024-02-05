import { getAuth, signOut } from "firebase/auth";
import { IconButton } from "@mui/material";
import { LogoutSharp } from "@mui/icons-material";

function LogoutButton() {
    const auth = getAuth();

    const handleLogOut = () => {
        signOut(auth)
            .then(() => {
                console.log("Sign out success!")
            }).catch((error) => {
                console.log(error.code, error.message)
            })
    }

    return (
        <IconButton centerRipple onClick={handleLogOut}>
            <LogoutSharp />
        </IconButton>
    )
};

export default LogoutButton;