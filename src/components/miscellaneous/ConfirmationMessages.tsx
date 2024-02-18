// ConfirmationMessages.tsx

interface ConfirmationMessage {
  title: string;
  message: string;
}

const ConfirmationMessages: Record<string, ConfirmationMessage> = {
  reservationSuccess: {
    title: "Reservation Success!",
    message: "Receipt Code: R4-R35rV3-P3G4s0z",
  },
  roomChangesConfirmed: {
    title: "Room 1 Changes Confirmed!",
    message: "Room is Un/available.",
  },
  roomArrivalConfirmed: {
    title: "Room 4 Arrival Confirmed!",
    message: "Room is now occupied.",
  },
  roomDepartureConfirmed: {
    title: "Room 4 Departure Confirmed!",
    message: "Room is now vacant.",
  },
};

export default ConfirmationMessages;
