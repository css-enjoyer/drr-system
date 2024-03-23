import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { DurationOption } from "../Types";

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

export function isReservationBeyondOpeningHrs(resEnd: Date): boolean {
    // year/mos/day/hr:min:sec
    const closingHrs = new Date(
        resEnd.getFullYear(), 
        resEnd.getMonth(), 
        resEnd.getDate(), 
        20, 30, 0
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

export function setDurationOptions(
    userType: string | null | undefined,
    startHour?: number, 
    endHour?: number
): DurationOption[] {

    if ((userType === "Admin" || userType === "Librarian")
        && startHour !== undefined 
        && endHour !== undefined
    ) {
        const operatingHours = (endHour - startHour) * 60;

        const privilegedOptions = [
            { duration: 30, label: "30 Minutes" }, 
            { duration: 60, label: "1 Hour" }, 
            { duration: 90, label: "90 Minutes" }, 
            { duration: 120, label: "2 Hours" },
            { duration: operatingHours, label: "Whole Day"}
        ]

        return privilegedOptions;
    }
    
    const studentOptions = [
        { duration: 30, label: "30 Minutes" }, 
        { duration: 60, label: "1 Hour" }, 
        { duration: 90, label: "90 Minutes" }, 
        { duration: 120, label: "2 Hours" }
    ];

    return studentOptions;
}

export function isWholeDay(duration: number): boolean {
    if (duration <= 120) {
        return false;
    }

    return true;
}

export function setWholeDayUnavailable(
    startTime: number,
    endTime: number
): { start: Date, end: Date, title: string, color: string } {

    const hrsOpen = endTime - startTime;
    const newStartTime = new Date();
    const newEndTime = new Date();

    newStartTime.setSeconds(0);
    newStartTime.setMinutes(0);
    newStartTime.setHours(startTime);

    newEndTime.setSeconds(0);
    newEndTime.setMinutes(0);
    newEndTime.setHours((startTime + hrsOpen));

    return (
        {
            start: newStartTime,
            end: newEndTime,
            title: "Unavailable",
            color: "gray"
        }
    );
}