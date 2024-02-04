import { User } from "firebase/auth";


export interface AuthContextValues {
    user: User | null | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
}

export const formatGreeting = (authContext: AuthContextValues | null) => {
    const displayName = authContext?.user?.displayName;
    if (displayName && displayName.includes(' ')) {
        const firstSpaceIndex = displayName.indexOf(' ');
        const firstName = displayName.slice(0, firstSpaceIndex);

        // Capitalize the first character and make the rest lowercase
        const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        return formattedName;
    } else {
        console.log('Invalid full name format');
        return displayName;
    }
}
