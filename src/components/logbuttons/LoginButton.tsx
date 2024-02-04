import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom"
import { Button } from "@mui/material";
import { LoginSharp } from "@mui/icons-material";

function Login() {
    const auth = getAuth();
    const navigate = useNavigate();
    // const [authing, setAuthing] = useState(false);

    // async function signInWithGoogle() {
    //     setAuthing(true);

    //     try {
    //         await signInWithPopup(auth, new GoogleAuthProvider());
    //         console.log(auth?.currentUser?.uid);
    //         navigate('/timeline');
    //     } catch (error) {
    //         console.error(error);
    //         setAuthing(false);
    //     }
    // }

    const handleLogin = () => {
        signInWithPopup(auth, new GoogleAuthProvider())
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(`${user.uid} signed in!`)
                navigate('/timeline')
            }).catch((error) => {
                console.log(`Login Failed: ${error.code} ${error.message}`)
            });
    }

    return (
        <Button 
            onClick={handleLogin} 
            variant="contained" 
            endIcon={<LoginSharp />}>
            Sign in with Google
        </Button>
    )
}

export default Login;