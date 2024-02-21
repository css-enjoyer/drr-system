import { Scheduler } from "@aldabil/react-scheduler";
import { EventActions, ProcessedEvent, SchedulerHelpers } from "@aldabil/react-scheduler/types";
import { Button, CircularProgress, DialogActions, Grid, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import drImage from "../styles/images/dr1.jpg";
import { AuthContext } from "../utils/AuthContext";
import { Reservation, ReservationEvent, addReservationDB, getReservations, getRooms } from "../firebase/dbHandler";
import { DatePicker, DateTimeField, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { ro } from "date-fns/locale";

type RoomProps = {
    room_id: number,
    roomBranch: string,
    title: string,
    color: string,
}

type EventProps = {
    event_id: number,
    room_id: number,
    title: string
    start: Date,
    end: Date
}

function CustomTimelineRenderer({ branchId }: { branchId: string }) {
    const authContext = useContext(AuthContext);

    const [roomsState, setRoomsState] = useState<RoomProps[]>([]);
    const [eventsState, setEventsState] = useState<EventProps[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // --- ROOMS --- 
        const rooms = await getRooms(branchId);
        const transformedResources: RoomProps[] = rooms.map((room) => ({
            room_id: room.roomId,
            roomBranch: room.roomBranch,
            title: room.roomTitle,
            color: "red",
        }));
        setRoomsState(transformedResources)
        // console.log('Rooms in state', roomsState, roomsState.length)

        // --- RESERVATIONS --- 
        const reservations = await getReservations(branchId);
        let event_i = 0;
        const transformedRoomResources: EventProps[] = reservations.map((reservation) => ({
            event_id: ++event_i,
            room_id: reservation.roomId,
            title: "Discussion",
            start: reservation.logStart,
            end: reservation.logEnd,
        }));
        setEventsState(transformedRoomResources)
        // console.log('Reservations in state', eventsState);
    }

    // TODO ADD DB FUNCTIONALITY
    const addReservation = (res: Reservation, action: EventActions) => {
        if (action === "create") {
            console.log("IN CREATE RES");
            addReservationDB(res);
        } else if (action === "edit") {
            console.log("IN EDIT RES");
        }

        fetchData();
    }

    function generateRandomSequence() {
        const length = 10;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomSequence = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomSequence += characters.charAt(randomIndex);
        }

        return randomSequence;
    }

    interface CustomEditorProps {
        scheduler: SchedulerHelpers;
    }
    const CustomEditor = ({ scheduler }: CustomEditorProps) => {
        // console.log("find clicked room id")
        // console.log(scheduler.state.room_id.value);

        // console.log("auth context:")
        // console.log(authContext)

        const event = scheduler.edited;
        const [formState, setFormState] = useState({  // set custom input fields and event properties here?
            // should come from states
            // TODO remove optional on non-form inputs
            branchId: event?.branchId || branchId,
            roomId: event?.roomId || scheduler.state.room_id.value,
            date: event?.date || new Date(),

            // should come from form inputs
            stuRep: event?.stuRep || authContext?.user?.email,
            start: event?.start || scheduler.state.start.value,
            end: event?.end || scheduler.state.end.value,
            purp: event?.purp || "",
            pax: event?.pax || 0,

            // auto-generated
            rcpt: event?.rcpt || generateRandomSequence()
        });

        const [error, setError] = useState("");
        const handleChange = (value: string, name: string) => { // retrieves fields values
            setFormState((prev) => { return { ...prev, [name]: value }; });
            // console.log(value)
        };

        function printState() {
            console.log(formState);
        }

        function toTitleCase(inputString: string | null | undefined) {
            if (inputString === null || inputString === undefined) {
                return ""; // Or you can return a default value
            }
            return inputString.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
        }

        const handleSubmit = async () => {
            try {
                scheduler.loading(true);
                // const addedUpdatedEvent = (await new Promise((res) => {
                // setTimeout(() => {
                //     res({
                // event_id: event?.event_id || Math.random(),
                // title: state.title,
                // start: scheduler.state.start.value,
                // end: scheduler.state.end.value,
                // description: state.description,
                // pax: state.pax,

                //             event_id: Math.random(),
                //             title: "Discussion",
                //             start: formState.start,
                //             end: formState.end,

                //             branchId: formState.branchId,
                //             roomId: formState.roomId,
                //             logDate: formState.date,
                //             logStuRep: formState.stuRep,
                //             reservationPurp: formState.purp,
                //             logPax: formState.pax,
                //             logRcpt: formState.rcpt
                //         });
                //     }, 3000)
                // })) as ProcessedEvent;
                // scheduler.onConfirm(addedUpdatedEvent, event ? "edit" : "create"); // no idea
                // TODO: implement promise event
                const newResEvent: ReservationEvent = {
                    // required types for event
                    event_id: Math.random(),
                    title: "Discussion",
                    start: formState.start,
                    end: formState.end,

                    branchId: formState.branchId,
                    roomId: formState.roomId,
                    logDate: formState.date,
                    logStuRep: formState.stuRep,
                    logPurp: formState.purp,
                    logPax: formState.pax,
                    logRcpt: formState.rcpt
                }
                const newRes: Reservation = {
                    branchId: formState.branchId,
                    roomId: formState.roomId,
                    logDate: formState.date,
                    logStuRep: formState.stuRep,
                    logStart: formState.start,
                    logEnd: formState.end,
                    logPurp: formState.purp,
                    logPax: formState.pax,
                    logRcpt: formState.rcpt
                }
                addReservation(newRes, "create");
                // printState();
                scheduler.close(); // maybe the form?
            } finally {
                scheduler.loading(false);
            }
        };

        return ( // return custom form
            <Grid
                width={{ lg: "80vw", md: "80vw", sm: "100%" }}
                height={{ lg: "90vh", md: "90vh", sm: "100%", }}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}>
                <Grid item sx={{
                    p: "35px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}>
                    {/* <p>Reserve Room</p> */}
                    <Typography variant="h4">Reserve Room {scheduler.state.room_id.value}</Typography>
                    <TextField
                        label="Group Representative"
                        // NOTE: the email is saved to db
                        value={toTitleCase(authContext?.user?.displayName)}
                        fullWidth
                        contentEditable={false}
                        inputProps={
                            { readOnly: true, }
                        }
                    />
                    <TimePicker
                        label="Start time"
                        value={formState.start}
                    />
                    <TimePicker
                        label="End time"
                        value={formState.end}
                    />
                    <TextField
                        label="Number of participants"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={formState.pax}
                        onChange={(e) => handleChange(e.target.value, "pax")}
                    />
                    <TextField
                        label="Reason for Reservation"
                        placeholder="Studying for thesis, group meeting for project, presentation practice..."
                        multiline
                        rows={3}
                        value={formState.purp}
                        onChange={(e) => handleChange(e.target.value, "purp")}
                    />
                    <DialogActions>
                        <Button onClick={scheduler.close}>Cancel</Button>
                        <Button onClick={handleSubmit}>Confirm</Button>
                        {/* <Button onClick={addReservation}>Confirm</Button> */}
                    </DialogActions>
                </Grid>
                <Grid item
                    width={{ lg: "150vw", md: "120vw", sm: "80vw", xs: "0" }}
                    height={{ lg: "90vh", md: "90vh", sm: "90vh", xs: "0" }}
                    sx={{
                        backgroundImage: `url("${drImage}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }} />
            </Grid>
        );
    };

    if (roomsState.length === 0) {
        console.log("Bruh")
        return <CircularProgress></CircularProgress>;
    }

    return (
        <Scheduler dialogMaxWidth="xl"
            customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
            viewerExtraComponent={(fields, event) => {
                return (
                    <Grid>
                        <p>Useful to render custom fields...</p>
                        <p>Description: {event.description || "Nothing..."}</p>
                    </Grid>
                );
            }}
            view="day"
            events={eventsState}
            day={{
                startHour: 8, endHour: 21, step: 30,
                // causes cell design to change, idk why
                // cellRenderer: () => {
                //     return (
                //         <button
                //             onClick={() => alert("iskrrt")}
                //         >
                //         </button>
                //     );
                // }
            }}
            resources={roomsState}
            resourceFields={{ idField: "room_id", textField: "title", }}
            resourceViewMode="default"
            // required to access room_id
            fields={[
                {
                    name: "room_id",
                    type: "hidden",
                    // default: roomsState[0].room_id,
                    // options: roomsState.map((rs) => {
                    //     return {
                    //         id: rs.room_id,
                    //         text: `Room ${rs.room_id}`,
                    //         value: rs.room_id
                    //     };
                    // }),
                    // config: { label: "Room", required: true }
                },
            ]}
        />
    );
}

export default CustomTimelineRenderer