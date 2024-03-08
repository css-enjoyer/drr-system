export function formatDate(date: string, month: string, year: string) {
    return date + "/" + month + "/" + year;
}

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

export function isReservationOverlapping(
    a_start: Date, 
    a_end: Date, 
    b_start: Date, 
    b_end: Date
) {

if (b_start.getTime() <= a_start.getTime() && a_end.getTime() <= b_end.getTime() 
    ||b_start.getTime() < a_end.getTime() && a_start.getTime() < b_end.getTime()) {
    
    return true;
}

return a_start.getTime() < b_start.getTime() && a_end.getTime() > b_end.getTime();
}

export function toTitleCase(inputString: string | null | undefined) {
    if (inputString === null || inputString === undefined) {
        return "";
    }
    return inputString.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
}