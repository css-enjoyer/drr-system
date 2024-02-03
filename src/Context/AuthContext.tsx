import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// Context with type declaration
export const Context = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}>(null); // Assign a default value of null

export function AuthContext({ children }: React.PropsWithChildren<{}>) {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null); // Initial state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined; // Type for unsubscribe

    unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setLoading(false);
      setUser(currentUser);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const values = { user, setUser, loading };

  return (
    <Context.Provider value={values}>
      {!loading && children}
    </Context.Provider>
  );
}
