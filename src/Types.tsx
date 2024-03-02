// reservation event
export interface ReservationEvent {
    // required types for events
    event_id: string;
    title: string;
    start: Date;
    end: Date;

    // optional types for events
    color: string,
    editable: boolean,

    branchId: string;
    room_id: number;
    date: Date;
    stuRep: string;
    duration: DurationOption;
    pax: number;
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
    roomPax: number;
    roomAvailable: boolean;
    roomBranch: string;
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

// ------ Prop Types -----
export type RoomProps = {
    room_id: number,
    roomBranch: string,
    title: string,
    color: string,
}

export type DurationOption = {
    duration: number,
    label: string
}