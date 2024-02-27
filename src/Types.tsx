// reservation event
export interface ReservationEvent {
    // required types for events
    event_id: string;
    title: string;
    start: Date;
    end: Date;

    branchId: string;
    room_id: number;
    logDate: Date;
    logStuRep: string;
    logDuration: DurationOption;
    logPax: number;
    logPurp: string;
    logRcpt: string;
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