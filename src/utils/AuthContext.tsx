import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, createContext, useEffect, useState } from "react";

export interface AuthContextValues {
    user: User | null | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
}
export const AuthContext = createContext<AuthContextValues | null>(null);


interface AuthContextProps {
    children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProps) {
    const auth = getAuth(); // retrieve user information (if any)
    const [user, setUser] = useState<User | null | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        // eslint-disable-next-line prefer-const
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false);
            if(currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });
        return () => {
            if(unsubscribe) {
                unsubscribe();
            }
        }
    }, [auth]);

    const values: AuthContextValues = {
        user, 
        setUser,
    };


    return (
        <AuthContext.Provider value={values as AuthContextValues}>
            {!loading && children}
        </AuthContext.Provider>
    );
}