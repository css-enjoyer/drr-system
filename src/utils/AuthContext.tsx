import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { UserRole } from "../Types";
import { getUserRole } from "../firebase/dbHandler";

export interface AuthContextValues {
    user: User | null | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
    userRole: UserRole;
}
export const AuthContext = createContext<AuthContextValues | null>(null);


interface AuthContextProps {
    children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProps) {
    const auth = getAuth(); // retrieve user information (if any)
    const [user, setUser] = useState<User | null | undefined>();
    const [userRole, setUserRole] = useState<UserRole>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        // eslint-disable-next-line prefer-const
        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if(currentUser) {
                setUser(currentUser);
                const role = await getUserRole(currentUser.uid, currentUser.email);
                setUserRole(role);
            } else {
                setUser(null);
                setUserRole(null);
            }
            setLoading(false);
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
        userRole
    };


    return (
        <AuthContext.Provider value={values as AuthContextValues}>
            {!loading && children}
        </AuthContext.Provider>
    );
}