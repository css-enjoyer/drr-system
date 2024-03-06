import { Scheduler } from "@aldabil/react-scheduler"
import { ProcessedEvent, SchedulerHelpers, SchedulerRef } from "@aldabil/react-scheduler/types";
import { Autocomplete, Box, Button, Container, DialogActions, Grid, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import drImage from "../styles/images/dr1.jpg";
import { AuthContext } from "../utils/AuthContext";
import { addReservationEvent, deleteReservationEvent, editReservationEvent, editReservationEventTitle, getReservationEvents, getRooms, toggleEventEditable } from "../firebase/dbHandler";
import { TimePicker } from "@mui/x-date-pickers";
import { DurationOption, ReservationEvent, RoomProps, UserRole } from "../Types";
import { generateRandomSequence } from "../utils/Utils.ts"
import { Numbers, Portrait, TextSnippet } from "@mui/icons-material";
import Loading from "./miscellaneous/Loading";

const durationOptions: DurationOption[] = [{ duration: 30, label: "30 Minutes" }, { duration: 60, label: "1 Hour" }, { duration: 90, label: "90 Minutes" }, { duration: 120, label: "2 Hours" }]


function CustomTimelineRenderer({ branchId }: { branchId: string }) {
    const timelineRef = useRef<SchedulerRef>(null);
    console.log("TIMELINE REF");
    console.log(timelineRef);

    const authContext = useContext(AuthContext);

    const [roomsState, setRoomsState] = useState<RoomProps[]>([]);
    const [eventsState, setEventsState] = useState<ProcessedEvent[]>([]);
    const [userRole, setUserRole] = useState<UserRole>();

    useEffect(() => {
        setUserRole(authContext?.userRole);
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
            color: "darkblue",
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
        await deleteReservationEvent(deletedId);
        fetchReservationEvents();
    }

    const updateEventTitle = async (resId: string, newTitle: string) => {
        await editReservationEventTitle(resId, newTitle);
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
            title: event?.title || "Reserved",
            start: event?.start || scheduler.state.start.value,
            end: event?.end || scheduler.state.end.value,

            // optional event fields
            color: event?.color || "darkblue",
            editable: event?.editable || false,

            // should come from states
            branchId: event?.branchId || branchId,
            roomId: event?.roomId || scheduler.state.room_id.value,
            date: event?.date || new Date(),

            // should come from form inputs
            stuRep: event?.stuRep || authContext?.user?.email,
            purp: event?.purp || "",
            pax: event?.pax || 4,
            duration: event?.duration || durationOptions[0],

            // auto-generated
            rcpt: event?.rcpt || generateRandomSequence()
        });

        // const [error, setError] = useState(false);

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
            if (formState.pax < 4 || formState.pax > 12 || formState.purp.length > 100) {
                return;
            }
            try {
                scheduler.loading(true);
                const newResEvent: ReservationEvent = {
                    event_id: formState.eventId + "",
                    title: formState.title,
                    start: formState.start,
                    end: formState.end,

                    color: formState.color,

                    branchId: formState.branchId,
                    room_id: formState.roomId,
                    date: formState.date,
                    stuRep: formState.stuRep,
                    duration: formState.duration,
                    pax: formState.pax,
                    purp: formState.purp,
                    rcpt: formState.rcpt
                }
                if (!event) {
                    console.log("in create");
                    /* TASK 3
                        ---- ADD A VERIFIER
                        if (isTimeSlotBetween(targetSlot, existingSlot))
                            throw error
                    */
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
                        value={authContext?.user?.displayName}
                        fullWidth
                        contentEditable={false}
                        inputProps={
                            { readOnly: true, }
                        }
                    />
                    <TimePicker
                        label="Start time"
                        value={formState.start}
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
                        error={formState.pax < 4 || formState.pax > 12 ? true : false}
                        helperText={formState.pax < 4 || formState.pax > 12 ? "Pax should be 4-12" : ""}
                        inputProps={{ min: 4, max: 12 }}
                        onChange={(e) => handleChange(e.target.value, "pax")}
                    />
                    <TextField
                        label="Reason for Reservation"
                        placeholder="Studying for thesis, group meeting for project, presentation practice..."
                        multiline
                        rows={3}
                        value={formState.purp}
                        error={formState.purp.length > 100 ? true : false}
                        helperText={formState.purp.length > 100 ? "Limited to 100 characters only" : ""}
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
        console.log("Bruh");
        // Render loading component
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                {/* Loading content */}
                <Loading />
            </div>
        );
    }

    const CustomViewer = (event: ProcessedEvent, close: () => void): JSX.Element => {
        return (
            <Grid sx={{
                width: "100%",
                padding: "5px",
                display: "flex",
                flexDirection: "column",
                gap: "5px"
            }}>
                {/* Values only reflect upon refresh */}
                {/* FIXME: store in useState */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <Portrait sx={{ marginLeft: "-4px", }} />
                    <Typography variant="caption" >Representative: {eventsState.find(eventState => eventState.event_id === event.event_id)?.stuRep}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <Numbers sx={{ marginLeft: "-4px", }} />
                    <Typography variant="caption" >Number of Participants: {eventsState.find(eventState => eventState.event_id === event.event_id)?.pax}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <TextSnippet sx={{ marginLeft: "-4px", }} />
                    <Typography variant="caption" >Reason for Reservation: {eventsState.find(eventState => eventState.event_id === event.event_id)?.purp}</Typography>
                </Box>
                {/* TODO: Retrieve and display all participant emails */}
                {userRole === "Admin" || userRole === "Librarian" ?
                    <Container>
                        <Container sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", my: "10px" }}>
                            <Button size="small" onClick={() => {
                                console.log("In custom edit")
                                timelineRef.current?.scheduler.triggerDialog(true, event);
                                close();
                            }}>Edit</Button>

                            <Button size="small" onClick={() => {
                                console.log("In custom delete")
                                handleDelete(event.event_id + "");
                            }}>Delete</Button>
                        </Container>
                        <Container sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", my: "10px" }}>
                            <Button size="small" onClick={() => updateEventTitle(event.event_id + "", "Unavailable")}>Set as Unavailable</Button>
                            <Button size="small" onClick={() => updateEventTitle(event.event_id + "", "Departed")}>Confirm Departure</Button>
                            <Button size="small" onClick={() => updateEventTitle(event.event_id + "", "Occupied")}>Confirm Arrival</Button>
                            {/* // TODO: Button onclick open larger view */}
                        </Container>
                    </Container>
                    : <Container></Container>
                }
            </Grid>
        );
    }

    return (
        <Scheduler dialogMaxWidth="xl"
            ref={timelineRef}
            customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
            customViewer={CustomViewer}
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
            deletable={userRole === "Admin" || userRole === "Librarian"}
        // editable={userType === "admin" || userType === "librarian"}
        />
    );
}

export default CustomTimelineRenderer