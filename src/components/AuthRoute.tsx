import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export interface IAuthRouteProps {};

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = props => {
    const { children } = props as React.PropsWithChildren<IAuthRouteProps>;
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const AuthCheck = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(false);
            }
            else {
                console.log('Unauthorized');
                // Can also use /login
                navigate("/");
            }
        });

        return () => AuthCheck();
    }, [auth]);

    if (loading) {
        return (
            <p>Loading page...</p>
        )
    }

    return <>{ children }</>;
};

export default AuthRoute