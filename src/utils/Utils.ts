import { ProcessedEvent } from "@aldabil/react-scheduler/types";

export function checkReservationTimeOverlap(
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

export function filterReservations(
    roomId: number,
    dateForComparison: string,
    eventsState: ProcessedEvent[],
    dateStart?: Date,
    dateEnd?: Date
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
            && e.title !== "Departed"
            && formattedResDate === dateForComparison
            && (dateStart === undefined || e.start !== dateStart)
            && (dateEnd === undefined || e.end !== dateEnd)
        );
    });

    return res;
}

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

export function isReservationBeyondOpeningHrs(resEnd: Date, closingHour: number): boolean {
    // year/mos/day/hr:min:sec
    const closingHrs = new Date(
        resEnd.getFullYear(), 
        resEnd.getMonth(), 
        resEnd.getDate(), 
        closingHour, 0, 0
    );

    if (resEnd > closingHrs) {
        return true;
    }
    return false;
}

export function isReservationOverlapping(
    eventsState: ProcessedEvent[],
    dateStart: Date, 
    dateEnd: Date,
    roomId: number,
    editOperation?: boolean
): boolean {

    const formattedResDate = formatDate(
        dateStart.getDate().toString(),
        dateStart.getMonth().toString(),
        dateStart.getFullYear().toString()
    );

    // Add functionality: Ignore if titles are "Departed"
    const filteredEvents = filterReservations(
        roomId,
        formattedResDate,
        eventsState,
        editOperation ? dateStart : undefined,
        editOperation ? dateEnd : undefined
    );

    const res = filteredEvents.some((e) => {
        return (
            checkReservationTimeOverlap(
                dateStart, dateEnd, 
                e.start, e.end
            )
        );
    });

    return res;
}

export function isStudentReservationConcurrent(
    eventId: string | number,
    stuRepEmail: string,
    eventsState: ProcessedEvent[]
): boolean {

    const isExistingEvent = eventsState.some((e) => {
        return (
            e.event_id === eventId
        );
    });

    if (isExistingEvent) {
        return false;
    }

    const isConcurrent = eventsState.some((e) => {
        return (
            e.stuRep === stuRepEmail
            && (e.title === "Reserved" || e.title === "Occupied")
        );
    });

    return isConcurrent;
}

export function toTitleCase(inputString: string | null | undefined) {
    if (inputString === null || inputString === undefined) {
        return "";
    }
    return inputString.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
}