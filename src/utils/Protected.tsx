import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

// ignore es-lint warnings
export function Protected({ children }) {
    const { user } = useContext(AuthContext);
    if (!user) {
        return <Navigate to="/" replace />
    } else {
        return children;
    }
}