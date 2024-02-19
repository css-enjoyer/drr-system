import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent, SchedulerHelpers } from "@aldabil/react-scheduler/types";
import { Button, CircularProgress, DialogActions, Grid, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import drImage from "../styles/images/dr1.jpg";
import { AuthContext } from "../utils/AuthContext";
import { getReservations, getRooms } from "../firebase/dbHandler";

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
                title: "TBD",
                start: reservation.reservaitionStartTime,
                end: reservation.reservationEndTime
            }));
            setEventsState(transformedRoomResources)
            // console.log('Reservations in state', eventsState);
        }
        fetchData();
    }, []);

    interface CustomEditorProps {
        scheduler: SchedulerHelpers;
    }
    const CustomEditor = ({ scheduler }: CustomEditorProps) => {
        const event = scheduler.edited;
        const [state, setState] = useState({  // set custom input fields and event properties here?
            title: "Title",
            description: "Description",
            pax: 4,
        });
        const [error, setError] = useState("");
        const handleChange = (value: string, name: string) => { // retrieves fields values
            setState((prev) => { return { ...prev, [name]: value }; });
            console.log(value)
        };
        
        const handleSubmit = async () => {
            try {
                scheduler.loading(true);
                const addedUpdatedEvent = (await new Promise((res) => {
                    setTimeout(() => {
                        res({
                            event_id: event?.event_id || Math.random(),
                            title: state.title,
                            start: scheduler.state.start.value,
                            end: scheduler.state.end.value,
                            description: state.description,
                            pax: state.pax,
                        });
                    }, 3000)
                })) as ProcessedEvent;
                scheduler.onConfirm(addedUpdatedEvent, event ? "edit" : "create"); // no idea
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
                    <Typography variant="h4">Reserve Room</Typography>
                    <TextField
                        label="Group Representative"
                        value={authContext?.user?.email}
                        fullWidth
                        contentEditable={false}
                        inputProps={
                            { readOnly: true, }
                        }
                    />
                    <TextField
                        label="Participant #1"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Reason for Reservation"
                        placeholder="Studying for thesis, group meeting for project, presentation practice..."
                        multiline
                        rows={3}
                    />
                    <DialogActions>
                        <Button onClick={scheduler.close}>Cancel</Button>
                        <Button onClick={handleSubmit}>Confirm</Button>
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
            day={{ startHour: 8, endHour: 21, step: 30 }}
            resources={roomsState}
            resourceFields={{ idField: "room_id", textField: "title", }}
            resourceViewMode="default"
        />
    );
}

export default CustomTimelineRenderer