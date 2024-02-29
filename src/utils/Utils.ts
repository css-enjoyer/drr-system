import { User } from "../Types";

// used to generate receipts
export function generateRandomSequence() {
    const length = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomSequence = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomSequence += characters.charAt(randomIndex);
    }

    return randomSequence;
}

export function toTitleCase(inputString: string | null | undefined) {
    if (inputString === null || inputString === undefined) {
        return "";
    }
    return inputString.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
}

export function isAdmin(email: string | null | undefined, admins: User[]): boolean {
    if (!email) {
        console.log("Error: Not logged in");
        return false;
    }

    return !!(admins.find((admin) => admin.userEmail === email));
}

export function isLibrarian(email: string | null | undefined, librarians: User[]): boolean {
    if (!email) {
        console.log("Error: Not logged in");
        return false;
    }

    return !!(librarians.find((librarian) => librarian.userEmail === email));
}

export function isSHS(email: string | null | undefined): boolean {
    if (!email) {
        console.log("Error: Not logged in");
        return false;
    }
    const verify = /shs/;
    return verify.test(email);
}