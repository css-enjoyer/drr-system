import { User } from "firebase/auth";

export interface AuthContextValues {
    user: User | null | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
}

export const fetchCollege = (authContext: AuthContextValues | null) => {
    const email = authContext?.user?.email;
    if (email) {
        const parts = email.split('@');
        if (parts.length === 2) {
            const localParts = parts[0].split('.');
            if (localParts.length >= 3) {
                const collegeDepartment = localParts[2];
                // Convert the formatted name to uppercase
                const formattedName = collegeDepartment.toUpperCase();
                return formattedName;
            }
        }
    }
    console.log('Invalid email format');
    return email;
}
