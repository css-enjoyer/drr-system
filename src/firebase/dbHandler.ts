import { collection, collectionGroup, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

// Disregard warnings when adding new fields in Firebase, takes time to reflect -isaac

export async function getReservations() {
    const querySnapshot = await getDocs(collection(db, "reservation-logs"));

    const logs = new Array(querySnapshot.size)
    let data;
    querySnapshot.forEach((doc) => {
        data = doc.data()
        logs.push(data)
    });

    return logs
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