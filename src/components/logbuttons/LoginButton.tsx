import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/config";
import { Button } from "@mui/material";
import { LoginOutlined, LoginSharp } from "@mui/icons-material";


function Login() {

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            console.log(auth?.currentUser?.email);
            console.log(auth?.currentUser?.photoURL);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        // <button onClick={signInWithGoogle}>Sign in with Google</button>
        <Button onClick={signInWithGoogle} variant="contained" endIcon={<LoginSharp />}>Sign in with Google</Button>
    )
}
export default Login;