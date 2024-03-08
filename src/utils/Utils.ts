import { ProcessedEvent } from "@aldabil/react-scheduler/types";

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


export function filterReservations(
    roomId: number,
    dateStart: Date,
    dateEnd: Date,
    eventsState: ProcessedEvent[],
    dateForComparison: string
): ProcessedEvent[] {

    const res = eventsState.filter((e) => {
        const resDate = new Date(e.start);
        const formattedResDate = formatDate(
            resDate.getDate().toString(),
            resDate.getMonth().toString(),
            resDate.getFullYear().toString()
        );

        return (
            e.room_id === roomId
            && formattedResDate === dateForComparison
            && e.start !== dateStart
            && e.end !== dateEnd
        );
    });

    return res;
}

export function isOverlapping(
    filteredEvents: ProcessedEvent[],
    newStart: Date, 
    newEnd: Date
): boolean {

    const res = filteredEvents.some((e) => {
        return (
            isReservationOverlapping(
                newStart, newEnd, 
                e.start, e.end
            )
        );
    });

    return res;
}