import { Timestamp, collection, collectionGroup, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

// Disregard warnings when adding new fields in Firebase, takes time to reflect -isaac

export interface Reservation {
    branchId: string;
    roomId: number;
    logDate: Date;
    logStuRep: string;
    reservaitionStartTime: Date;
    reservationEndTime: Date;
    reservationPurp: string;
    logPax: number;
    logRcpt: string;
}

export async function getReservations(branch: string): Promise<Reservation[]> {
    const q = query(collection(db, "reservation-logs"), where("branchId", "==", branch))
    const querySnapshot = await getDocs(q);

    const logs = new Array(querySnapshot.size)
    const reservations: Reservation[] = [];

    querySnapshot.forEach((doc) => {
        
        const reservationData = doc.data();
        const reservation: Reservation = {
            branchId: reservationData.branchId,
            roomId: reservationData.roomId,
            logDate: (reservationData.logDate as Timestamp).toDate(),
            logStuRep: reservationData.logStuRep,
            reservaitionStartTime: (reservationData.logStartTime as Timestamp).toDate(),
            reservationEndTime: (reservationData.logEndTime as Timestamp).toDate(),
            reservationPurp: reservationData.logPurp,
            logPax: reservationData.logPax,
            logRcpt: reservationData.logRcpt
        }

        reservations.push(reservation);
    });
    console.log(...reservations)
    return reservations
}


const branchesRef = collection(db, "branches");
// fetch is firing twice, to fix
// - save retrieved data to local if unchanged remotely
export interface Branch {
    branchId: string;
    branchTitle: string;
    branchLoc: string;
}
export async function getBranches(): Promise<Branch[]> {
    const branches: Branch[] = [];

    const querySnapshot = await getDocs(branchesRef);
    querySnapshot.forEach(doc => {
        const branchData = doc.data();
        const branch: Branch = {
            branchId: branchData.branchId,
            branchTitle: branchData.branchTitle,
            branchLoc: branchData.branchLoc
        };
        branches.push(branch);
    });
    console.log(...branches);
    return branches;
}

export interface Room {
    roomId: number;
    roomTitle: string;
    roomPax: number;
    roomAvailable: boolean;
    roomBranch: string;
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










export interface BranchRoom {
    roomId: number;
    roomBranch: string;
    roomName: string;
    roomPax: number;
    roomAvailable: boolean;
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