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
