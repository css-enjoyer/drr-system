import { getAuth, signOut } from "firebase/auth";
import { IconButton } from "@mui/material";
import { LogoutSharp } from "@mui/icons-material";
import { ReactNode } from "react";

type btnProps = {
    children: ReactNode
}

function LogoutButton(props: btnProps) {
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
        <IconButton disableRipple onClick={handleLogOut} sx={{color: "inherit"}}>
            <LogoutSharp />
            {props.children}
        </IconButton>
    )
}

export default LogoutButton;