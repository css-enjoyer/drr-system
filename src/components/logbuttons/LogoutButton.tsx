import { getAuth, signOut } from "firebase/auth";
import { IconButton } from "@mui/material";
import { LogoutSharp } from "@mui/icons-material";

function LogoutButton() {
    const auth = getAuth();

    // async function logOut() {
    //     try {
    //         await signOut(auth);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const handleLogOut = () => {
        signOut(auth)
            .then(() => {
                console.log("Sign out success!")
            }).catch((error) => {
                console.log(error.code, error.message)
            })
    }

    return (
        <IconButton centerRipple onClick={handleLogOut} sx={{color: 'white'}}>
            <LogoutSharp />
        </IconButton>
    )
};

export default LogoutButton;