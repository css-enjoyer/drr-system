import { Timestamp } from "firebase/firestore";

// reservation event
export interface ReservationEvent {
    // required types for events
    event_id: string;
    title: string;
    start: Date;
    end: Date;

    // optional types for events
    color: string,

    branchId: string;
    room_id: number;
    date: Date;
    stuRep: string;
    duration: number;
    pax: number;
    stuEmails: string[];
    purp: string;
    rcpt: string;
}

export interface Branch {
    branchId: string;
    branchTitle: string;
    branchLoc: string;
    imgSrc: string;
}

export interface Room {
    roomId: number;
    roomTitle: string;
    roomAvailable: boolean;
    roomBranch: string;
    roomMinPax: number;
    roomMaxPax: number;
}

export interface BranchRoom {
    roomId: number;
    roomBranch: string;
    roomName: string;
    roomPax: number;
    roomAvailable: boolean;
}

export interface User {
    userEmail: string;
}

export interface Librarian extends User {
    dateAdded: Timestamp;
    librarianName: string;
    librarianBranch: string;
}


// ------ Prop Types -----
export type RoomProps = {
    room_id: number,
    roomBranch: string,
    title: string,
    roomMinPax: number,
    roomMaxPax: number,
    color: string,
}

export interface LibrarianProp {
    date: string;
    name: string;
    email: string;
    department: string;
}

export type DurationOption = {
    duration: number,
    label: string
}

export type UserRole = "Admin" | "Librarian" | "Student" | "SHS-Student" | null | undefined