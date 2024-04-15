import axios from "axios";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function sendReminderEmail(start: Date, stuRep: string, roomId: number,
    branchId: string, minsBeforeNotif: number) {

    const minsBeforeRes = Math.ceil((start.getTime() - new Date().getTime()) / 60000);
    let delaySent = 0;
    console.log("MINUTES BEFORE RESERVATION");
    console.log(minsBeforeRes);

    // no delay if less than 30 mins
    if (minsBeforeRes > minsBeforeNotif) {
        delaySent = minsBeforeRes - minsBeforeNotif;
    }

    try {
        const response = await axios.post(`${VITE_BACKEND_URL}/api/functions/email`,
            {
                to: stuRep,
                subject: "DRRS: Upcoming reservation",
                html: `<h1>${minsBeforeRes < minsBeforeNotif ? minsBeforeRes : minsBeforeNotif} minutes before your reservation in room ${roomId} at ${branchId}</h1>`,
                minutesDelay: delaySent,
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        console.log(`SUCCESS: Reservation reminder sent to: ${stuRep} after ${delaySent} minutes delay`);
    } catch (error) {
        console.error(error);
    }
}

// add Access-Control-Allow-Origin: on header.
export async function autoCancel(token: string, eventId: string, start: Date, stuRep: string,
    roomId: number, branchId: string, minsAfterCancellation: number) {

    const cancellationDelay = Math.ceil((start.getTime() - new Date().getTime()) / 60000) + minsAfterCancellation;
    console.log("MINUTES BEFORE RESERVATION IS CANCELLED");
    console.log(cancellationDelay);

    try {
        const response = await axios.post(`${VITE_BACKEND_URL}/api/functions/autoCancel`,
            {
                eventId: eventId,
                to: stuRep,
                subject: "DRRS: Reservation Cancellation",
                html: `<h1>Your reservation has been cancelled after not being occupied for ${minsAfterCancellation} minutes in room ${roomId} at ${branchId}</h1>`,
                minutesDelay: cancellationDelay,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
        console.log(`SUCCESS: Auto cancel has been set ${stuRep} after ${cancellationDelay} minutes delay`);
    } catch (error) {
        console.error(error);
    }

}