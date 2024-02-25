import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent, SchedulerHelpers } from "@aldabil/react-scheduler/types";
import { Autocomplete, Button, CircularProgress, DialogActions, Grid, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import drImage from "../styles/images/dr1.jpg";
import { AuthContext } from "../utils/AuthContext";
import { addReservationEvent, deleteReservationEvent, editReservationEvent, getReservationEvents, getRooms } from "../firebase/dbHandler";
import { TimePicker } from "@mui/x-date-pickers";
import { DurationOption, ReservationEvent, RoomProps } from "../Types";
import { generateRandomSequence, toTitleCase } from "../utils/Utils.ts"

const durationOptions: DurationOption[] = [{ duration: 30, label: "30 Minutes" }, { duration: 60, label: "1 Hour" }, { duration: 90, label: "90 Minutes" }, { duration: 120, label: "2 Hours" }]


function CustomTimelineRenderer({ branchId }: { branchId: string }) {
    const authContext = useContext(AuthContext);

    const [roomsState, setRoomsState] = useState<RoomProps[]>([]);
    const [eventsState, setEventsState] = useState<ProcessedEvent[]>([]);

    useEffect(() => {
        fetchRooms();
        fetchReservationEvents();
    }, []);

    const fetchRooms = async () => {
        // --- ROOMS --- 
        const rooms = await getRooms(branchId);
        console.log("rooms")
        console.log(rooms)
        const transformedResources: RoomProps[] = rooms.map((room) => ({
            room_id: room.roomId,
            roomBranch: room.roomBranch,
            title: room.roomTitle,
            color: "red",
        }));
        console.log("transformed rooms")
        console.log(transformedResources)
        setRoomsState(transformedResources)
        console.log('Rooms in state', roomsState, roomsState.length)
    }

    const fetchReservationEvents = async () => {
        const resEvents = await getReservationEvents(branchId);
        setEventsState(resEvents);
    }

    const handleDelete = async (deletedId: string) => {
        deleteReservationEvent(deletedId);
        fetchReservationEvents();
    }

    interface CustomEditorProps {
        scheduler: SchedulerHelpers;
    }

    const CustomEditor = ({ scheduler }: CustomEditorProps) => {
        console.log("In scheduler:");
        console.log(scheduler);

        const event = scheduler.edited;

        const [formState, setFormState] = useState({
            // event fields
            eventId: event?.event_id || "lmao",
            title: event?.title || "Discussion",
            start: event?.start || scheduler.state.start.value,
            end: event?.end || scheduler.state.end.value,

            // should come from states
            branchId: event?.branchId || branchId,
            roomId: event?.roomId || scheduler.state.room_id.value,
            date: event?.logDate || new Date(),

            // should come from form inputs
            stuRep: event?.stuRep || authContext?.user?.email,
            purp: event?.logPurp || "",
            pax: event?.logPax || 0,
            duration: event?.logDuration || durationOptions[0],

            // auto-generated
            rcpt: event?.rcpt || generateRandomSequence()
        });

        const [error, setError] = useState("");
        const handleChange = (value: string | DurationOption, name: string) => { // retrieves fields values
            setFormState((prev) => { return { ...prev, [name]: value }; });
            // console.log(value)
        };

        const handleDurationChange = (duration: number, start: Date) => {
            const newDate = new Date(start.getTime() + (duration * 60 * 1000))
            setFormState((prev) => { return { ...prev, ["end"]: newDate } })
        }

        const handleSubmit = async () => {
            console.log("in handle submit")
            try {
                scheduler.loading(true);
                const newResEvent: ReservationEvent = {
                    event_id: formState.eventId + "",
                    title: formState.title,
                    start: formState.start,
                    end: formState.end,

                    branchId: formState.branchId,
                    room_id: formState.roomId,
                    logDate: formState.date,
                    logStuRep: formState.stuRep,
                    logDuration: formState.duration,
                    logPax: formState.pax,
                    logPurp: formState.purp,
                    logRcpt: formState.rcpt
                }
                if (!event) {
                    console.log("in create");
                    await addReservationEvent(newResEvent);
                    fetchReservationEvents();
                } else {
                    console.log("in edit")
                    await editReservationEvent(event.event_id + "", newResEvent);
                    fetchReservationEvents();
                }
                scheduler.close();
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
                    <Typography variant="h4">{event ? "Edit" : "Reserve"} Room {scheduler.state.room_id.value}</Typography>
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
                        // if null return current time + 30 minutes
                        readOnly
                    />
                    <TimePicker
                        label="End time"
                        value={formState.end}
                        readOnly
                    />

                    <Autocomplete
                        options={durationOptions}
                        getOptionLabel={(option) => (option.label)}
                        renderInput={(params) => (<TextField {...params} label="Duration" variant="outlined" />)}
                        value={formState.duration}
                        disableClearable={true}
                        onChange={(e, option: DurationOption) => {
                            handleDurationChange(option.duration, formState.start);
                            handleChange(option, "duration")
                        }}
                        isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
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
                        <Button onClick={handleSubmit}>{event ? "Edit" : "Reserve"}</Button>
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
            }}
            resources={roomsState}
            resourceFields={{ idField: "room_id", textField: "title", }}
            resourceViewMode="default"
            // required to access room_id
            fields={[
                {
                    name: "room_id",
                    type: "hidden",
                },
            ]}
            onDelete={handleDelete}
        />
    );
}

export default CustomTimelineRenderer