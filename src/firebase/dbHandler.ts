import { Timestamp, collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from './config';
import { Branch, BranchRoom, ReservationEvent, Room } from '../Types';
import { ProcessedEvent } from '@aldabil/react-scheduler/types';

// Disregard warnings when adding new fields in Firebase, takes time to reflect -isaac

/*********************
 * RESERVATION EVENT
**********************/

// ----- ADD RESERVATION EVENT -----
export async function addReservationEvent(resEvent: ProcessedEvent): Promise<ProcessedEvent> {
    console.log("Reservation Event:");
    console.log(resEvent);

    const resEventRef = collection(db, "reservation-event");
    try {
        // note: doc and setDoc is similar to addDoc
        // create unique id for new res event
        const newResEventsRef = doc(resEventRef);
        // assign unique id to new res event
        await setDoc(newResEventsRef, resEvent);
        // set the event id to be equivalent to firestore generated uid
        await updateDoc(newResEventsRef, {
            event_id: newResEventsRef.id
        });
    } catch (error) {
        console.log(error);
    }

    return resEvent;
}

// ----- GET RESERVATIONS EVENTS -----
export async function getReservationEvents(branch: string): Promise<ProcessedEvent[]> {
    const q = query(collection(db, "reservation-event"), where("branchId", "==", branch))
    const querySnapshot = await getDocs(q);

    const resEvents: ReservationEvent[] = []

    try {
        querySnapshot.forEach((doc) => {
            const resEventData = doc.data();
            const resEvent: ReservationEvent = {
                event_id: resEventData.event_id,
                title: resEventData.title,
                start: (resEventData.start as Timestamp).toDate(),
                end: (resEventData.end as Timestamp).toDate(),

                branchId: resEventData.branchId,
                room_id: resEventData.room_id,
                date: (resEventData.date as Timestamp).toDate(),
                stuRep: resEventData.stuRep,
                duration: resEventData.duration,
                pax: resEventData.pax,
                purp: resEventData.purp,
                rcpt: resEventData.rcpt
            }

            resEvents.push(resEvent);
        })
    } catch (error) {
        console.error(error);
    }

    return resEvents;
}

// ----- GET SPECIFIC RESERVATION EVENT BY ID -----
export async function getReservationEventById(resEventId: string): Promise<ProcessedEvent> {
    const resEventRef = doc(db, "reservation-event", resEventId);
    const errorEvent: ReservationEvent = {
        event_id: 'error',
        title: '',
        start: new Date(),
        end: new Date(),
        branchId: '',
        room_id: 0,
        date: new Date(),
        stuRep: '',
        duration: {
            duration: 0,
            label: ''
        },
        pax: 0,
        purp: '',
        rcpt: ''
    };

    try {
        const docSnap = await getDoc(resEventRef);
        if (docSnap.exists()) {
            const resEventData = docSnap.data();
            const resEvent: ReservationEvent = {
                event_id: resEventData.event_id,
                title: resEventData.title,
                start: (resEventData.start as Timestamp).toDate(),
                end: (resEventData.end as Timestamp).toDate(),

                branchId: resEventData.branchId,
                room_id: resEventData.room_id,
                date: (resEventData.date as Timestamp).toDate(),
                stuRep: resEventData.stuRep,
                duration: resEventData.duration,
                pax: resEventData.pax,
                purp: resEventData.purp,
                rcpt: resEventData.rcpt
            }
            console.log(resEvent);
            return resEvent;
        }
    } catch (error) {
        console.error(error);
    }

    // if there's an error it should return an empty event
    return errorEvent;
}

// ----- EDIT RESERVATION EVENT -----
export async function editReservationEvent(resEventId: string, resEvent: ProcessedEvent): Promise<ProcessedEvent> {
    const resEventDoc = doc(db, "reservation-event", resEventId);
    try {
        await updateDoc(resEventDoc, {
            start: resEvent.start,
            end: resEvent.end,
            date: resEvent.date,
            duration: resEvent.duration,
            pax: resEvent.pax,
            purp: resEvent.purp
        });
    } catch (error) {
        console.log(error);
    }

    // for error checking return updated id
    return getReservationEventById(resEventId);
}

// ----- UPDATE TITLE IN RESERVATION EVENT
export async function editReservationEventTitle(resEventId: string, value: string): Promise<ProcessedEvent> {
    const resEventDoc = doc(db, "reservation-event", resEventId);
    try {
        await updateDoc(resEventDoc, {
            title: value
        });
    } catch (error) {
        console.log(error);
    }

    // for error checking return updated id
    return getReservationEventById(resEventId);
}

// ----- DELETE RESERVATION EVENT -----
export async function deleteReservationEvent(resEventId: string): Promise<string> {
    let idDeleted: string = "";
    const resEventDoc = doc(db, "reservation-event", resEventId);
    try {
        await deleteDoc(resEventDoc);
        idDeleted = resEventId;
    } catch (error) {
        console.error;
    }

    return idDeleted;
}

/*********************
 * BRANCHES
 *********************/

export async function getBranches(): Promise<Branch[]> {
    const branchesRef = collection(db, "branches");
    // fetch is firing twice, to fix
    // - save retrieved data to local if unchanged remotely

    const branches: Branch[] = [];

    const querySnapshot = await getDocs(branchesRef);
    querySnapshot.forEach(doc => {
        const branchData = doc.data();
        const branch: Branch = {
            branchId: branchData.branchId,
            branchTitle: branchData.branchTitle,
            branchLoc: branchData.branchLoc,
            imgSrc: branchData.imgSrc
        };
        branches.push(branch);
    });
    console.log(...branches);
    return branches;
}

export async function getRooms(branch: string): Promise<Room[]> {
    const roomsArray: Room[] = [];

    const rooms = query(collectionGroup(db, 'rooms'), where("roomBranch", "==", branch));
    const querySnapshot = await getDocs(rooms);
    querySnapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        const roomData = doc.data();
        const room: Room = {
            roomId: roomData.roomId,
            roomBranch: roomData.roomBranch,
            roomTitle: roomData.roomTitle,
            roomPax: roomData.roomPax,
            roomAvailable: roomData.roomAvailable,
        };
        roomsArray.push(room);
    })
    return roomsArray;
}

export async function getBranchRooms(branchId?: string): Promise<BranchRoom[]> {
    const branchRooms: BranchRoom[] = [];

    const querySnapshot = await getDocs(collection(db, "rooms"));
    querySnapshot.forEach(doc => {
        const roomData = doc.data();
        const room: BranchRoom = {
            roomId: roomData.roomId,
            roomBranch: roomData.roomBranch,
            roomName: roomData.roomName,
            roomPax: roomData.roomPax,
            roomAvailable: roomData.roomAvailable,
        };
        if (room.roomBranch === branchId) {
            branchRooms.push(room);
        }
        console.log(`Selected branch room id: ${branchId}`)
    })
    console.log(...branchRooms);
    return branchRooms;
}