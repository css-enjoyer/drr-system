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
        console.log(`SUCCESS: Reservation reminder sent to: ${response.data.to} after ${response.data.minutesDelay} minutes delay`);
    } catch (error) {
        console.error(error);
    }
}