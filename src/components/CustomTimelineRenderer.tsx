import { Scheduler } from "@aldabil/react-scheduler"
import { ProcessedEvent, SchedulerHelpers, SchedulerRef } from "@aldabil/react-scheduler/types";
import { Alert, Autocomplete, Box, Button, Container, DialogActions, Grid, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../utils/AuthContext";
import { addReservationEvent, deleteReservationEvent, editReservationEvent, editReservationEventTitle, getRooms } from "../firebase/dbHandler";
import { TimePicker } from "@mui/x-date-pickers";
import { DurationOption, ReservationEvent, RoomProps, Room } from "../Types";
import { generateRandomSequence, isReservationBeyondOpeningHrs, isReservationOverlapping, isStudentReservationConcurrent } from "../utils/Utils.ts"
import { Numbers, Portrait, School, TextSnippet } from "@mui/icons-material";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import Loading from "./miscellaneous/Loading";

import { fetchCollege } from '../utils/fetchCollege';
import { useThemeContext } from "../theme/ThemeContextProvider";
import { Divider } from "@mui/material";
import RunCircleOutlinedIcon from '@mui/icons-material/RunCircleOutlined';
import { Timestamp, collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config.ts";

import shsroom from "../styles/images/Shsroom.jpeg";
import scitechroom from "../styles/images/scitechroom.jpeg";
import genrefroom from "../styles/images/genrefroom.jpeg";
import { max } from "date-fns";

function CustomTimelineRenderer({ branchId }: { branchId: string }) {
    const timelineRef = useRef<SchedulerRef>(null);
    const { theme } = useThemeContext();

    const authContext = useContext(AuthContext);

    const startTime = 8;
    const endTime = 18;
    const [roomsState, setRoomsState] = useState<RoomProps[]>([]);
    const [eventsState, setEventsState] = useState<ProcessedEvent[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            // ----- ROOMS ----- 
            setLoading(true);
            const rooms = await getRooms(branchId);
            console.log("rooms")
            console.log(rooms)
            const transformedResources: RoomProps[] = rooms.map((room) => ({
                room_id: room.roomId,
                roomBranch: room.roomBranch,
                title: room.roomTitle,
                roomMinPax: room.roomMinPax,
                roomMaxPax: room.roomMaxPax,
                color: "white",
            }));
            console.log("transformed rooms")
            console.log(transformedResources)
            setRoomsState(transformedResources)
            setLoading(false);
            console.log('Rooms in state', roomsState, roomsState.length)
        }

        fetchRooms();

    }, [])


    useEffect(() => {
        // ----- FIRESTORE REALTIME UPDATES -----
        // goes brrr
        const q = query(collection(db, "reservation-event"), where("branchId", "==", branchId));
        const unsub = onSnapshot(q, querySnapshot => {
            const resEvents: ReservationEvent[] = [];
            querySnapshot.forEach((doc) => {
                const resEventData = doc.data();
                const resEvent = {
                    ...resEventData,
                    start: (resEventData.start as Timestamp).toDate(),
                    end: (resEventData.end as Timestamp).toDate(),
                    date: (resEventData.date as Timestamp).toDate(),
                };
                resEvents.push(resEvent);
            });
            setEventsState(resEvents);
        })
        return () => unsub();

        // fetchReservationEvents();
    }, []);

    // const fetchReservationEvents = async () => {
    //     const resEvents = await getReservationEvents(branchId);
    //     setEventsState(resEvents);
    // }

    // ----- LOADING STATE WHILE FETCHING ROOMS -----
    if (loading) {
        // if (roomsState.length === 0) {
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

    // ----- CUSTOM FUNCTIONS -----
    const handleDelete = async (deletedId: string) => {
        await deleteReservationEvent(deletedId);
        // fetchReservationEvents();
    }

    const updateEventTitle = async (resId: string, newTitle: string) => {
        await editReservationEventTitle(resId, newTitle);
        // fetchReservationEvents();
    }

    function checkParticipantEmails(pax: number, text: string) {
        if (!text.match("^([a-zA-Z]+\\.[a-zA-Z]+\\.[a-zA-Z]+@ust\\.edu\\.ph(\\n| ))*[a-zA-Z]+\\.[a-zA-Z]+\\.[a-zA-Z]+@ust\\.edu\\.ph$")) {
            return true
        } else if (text.split('\n').length != pax) {
            return true
        } else {
            return false
        }
    }

    /******************************
     *  CUSTOM FORM EDITOR
     ******************************/
    interface CustomEditorProps {
        scheduler: SchedulerHelpers;
    }
    function getMinMax(roomsState: RoomProps[], roomId: number): number[] {
        let min = 0;
        let max = 0;
        roomsState.forEach(room => {
            if (room.room_id == roomId) {
                min = room.roomMinPax
                max = room.roomMaxPax
            }

        });
        return [min, max]
    }

    const CustomEditor = ({ scheduler }: CustomEditorProps) => {
        console.log("In scheduler:");
        console.log(scheduler.state);

        const event = scheduler.edited;


        const [formState, setFormState] = useState({
            // event fields

            eventId: event?.event_id || "lmao",
            title: event?.title || "Reserved",
            start: event?.start || scheduler.state.start.value,
            end: event?.end || new Date(scheduler.state.end.value - 15 * 60000),

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
            pax: event?.pax || getMinMax(roomsState, scheduler.state.room_id.value)[0],
            participantEmails: event?.participantEmails || "",
            duration: event?.duration || 15,

            // pax requirements
            minPax: event?.minPax || getMinMax(roomsState, scheduler.state.room_id.value)[0],
            maxPax: event?.maxPax || getMinMax(roomsState, scheduler.state.room_id.value)[1],

            // auto-generated
            rcpt: event?.rcpt || generateRandomSequence()
        });

        const [errorMessage, setErrorMessage] = useState("");

        const handleChange = (value: string | number, name: string) => { // retrieves fields values
            setFormState((prev) => { return { ...prev, [name]: value }; });
            // console.log(value)
        };

        const handleDurationChange = (duration: number, start: Date) => {
            const newDate = new Date(start.getTime() + (duration * 60 * 1000));
            setFormState((prev) => { return { ...prev, ["end"]: newDate } });
        }

        const setRoomUnavailable = async () => {
            try {
                const startOfDay = new Date(formState.date.getFullYear(), formState.date.getMonth(), formState.date.getDate(), startTime, 0);
                const endOfDay = new Date(formState.date.getFullYear(), formState.date.getMonth(), formState.date.getDate(), endTime, 0);

                const newEvent: ReservationEvent = {
                    event_id: formState.eventId + "",
                    title: "Unavailable",
                    start: startOfDay,
                    end: endOfDay,

                    color: "gray",

                    branchId: formState.branchId,
                    room_id: formState.roomId,
                    date: formState.date,
                    stuRep: formState.stuRep,
                    duration: 0, // Set duration to 0 for whole day
                    pax: 0,
                    stuEmails: [],
                    purp: "Room unavailable for the day",
                    rcpt: formState.rcpt
                };

                await addReservationEvent(newEvent);
                scheduler.close();
            } catch (error) {
                console.error("Error setting room unavailable:", error);
            }
        };

        // ----- FORM SUBMIT HANDLER -----
        const handleSubmit = async () => {
            console.log("in handle submit");

            // TODO: Seperate all errors into a function
            if (checkParticipantEmails(formState.pax, formState.participantEmails)) {
                setErrorMessage("Error! Your reservation must include all valid emails of the participants.");
                console.log(formState.participantEmails)
                return
            }

            if (isReservationBeyondOpeningHrs(formState.end)) {
                setErrorMessage("Error! Your reservation exceeds library hours.");
                return;
            }

            if (isStudentReservationConcurrent(formState.eventId, formState.stuRep, eventsState)) {
                setErrorMessage("Error! You already have a reservation.");
                return;
            }

            if (formState.start < new Date() &&
                (authContext?.userRole === "Student" || authContext?.userRole === "SHS-Student")) {
                setErrorMessage("Error! Your reservation is before the current time!");
                return;
            }

            let today = new Date()
            if (formState.start.getDate() > new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getDate()) {
                setErrorMessage("Error! Room reservations can only be done a day ahead of current time!");
                return;
            }


            if (formState.duration < 15 || formState.duration > 120) {
                setErrorMessage("Error! Duration should be within 15 minutes to 2 hours!");
                return;
            }

            today = new Date(formState.end)
            today.setHours(endTime)
            today.setMinutes(0) 
            if (formState.end > today) {
                setErrorMessage("Error! Cannot reserve past closing time");
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
                    stuEmails: formState.participantEmails.split('\n'),
                    purp: formState.purp,
                    rcpt: formState.rcpt
                }
                if (!event) {
                    console.log("in create");
                    const overlapping = isReservationOverlapping(
                        eventsState,
                        formState.start,
                        formState.end,
                        formState.roomId,
                    );

                    if (!overlapping) {
                        scheduler.close();
                        await addReservationEvent(newResEvent);
                        // fetchReservationEvents();
                    }
                    else {
                        setErrorMessage("Reservation will overlap!");
                        return;
                    }
                } else {
                    console.log("in edit")
                    const overlapping = isReservationOverlapping(
                        eventsState,
                        newResEvent.start,
                        newResEvent.end,
                        newResEvent.room_id,
                        true
                    );

                    if (!overlapping) {
                        scheduler.close();
                        await editReservationEvent(event.event_id + "", newResEvent);
                        // fetchReservationEvents();
                    }
                    else {
                        setErrorMessage("Editing this reservation will result in an overlap!")
                        return;
                    }
                }
                // scheduler.close();
            } finally {
                scheduler.loading(false);
            }
        };

        // ----- CUSTOM FORM -----
        return (
            <Grid
                width={{ lg: "80vw", md: "80vw", sm: "100%" }}
                height={{ lg: "90vh", md: "90vh", sm: "100%", }}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    background: theme.palette.mode === 'dark' ? "#1E1F20" : "#FFFFFF",
                }}>
                <Grid item sx={{
                    p: "35px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    overflowY: "auto",
                    pb: "100px"
                }}>
                    <Typography variant="h4" sx={{ marginBottom: '30px' }}>{event ? "Edit" : "Reserve"} Room {scheduler.state.room_id.value}</Typography>
                    <TextField
                        label="Group Representative"
                        value={event?.stuRep}
                        fullWidth
                        contentEditable={false}
                        inputProps={
                            { readOnly: true }
                        }
                        sx={{
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                                borderColor: "#F2F2F2", // Change the color to your desired color
                            },
                        }}
                    />
                    {errorMessage ?
                        <Alert severity="error">
                            {errorMessage}
                        </Alert>
                        :
                        <></>
                    }
                    <TimePicker
                        label="Start time"
                        value={formState.start}
                        readOnly
                        sx={{
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                                borderColor: "#F2F2F2", // Change the color to your desired color
                            },
                        }}
                    />
                    <TimePicker
                        label="End time"
                        value={formState.end}
                        readOnly
                        sx={{
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                                borderColor: "#F2F2F2", // Change the color to your desired color
                            },
                        }}
                    />
                    {/* <Autocomplete
                        options={durationOptions}
                        getOptionLabel={(option) => (option.label)}
                        renderInput={(params) => (<TextField {...params} label="Duration" variant="outlined" />)}
                        value={formState.duration}
                        disableClearable={true}
                        onChange={(e, option: DurationOption) => {
                            handleDurationChange(option.duration, formState.start);
                            handleChange(option, "duration");
                            setErrorMessage("");
                        }}
                        isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                    /> */}
                    <TimePicker
                        label="Duration"
                        ampm={false}
                        minTime={new Date(0, 0, 0, 0, 15)}
                        maxTime={new Date(0, 0, 0, 2)}
                        skipDisabled={true}
                        value={new Date(0, 0, 0, 0, formState.duration)}
                        onChange={(e) => {
                            const minsToAdd = ((e!.getHours() * 60) + e!.getMinutes());
                            handleChange(minsToAdd, "duration");
                            handleDurationChange(minsToAdd, formState.start);
                        }} sx={{
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                                borderColor: "#F2F2F2", // Change the color to your desired color
                            },
                        }}

                    />
                    <TextField
                        label="Number of participants"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={formState.pax}
                        error={formState.pax < formState.minPax || formState.pax > formState.maxPax ? true : false}
                        helperText={formState.pax < formState.minPax || formState.pax > formState.maxPax ? `Pax should be ${formState.minPax}-${formState.maxPax}` : ""}
                        inputProps={{ min: formState.minPax, max: formState.maxPax }}
                        onChange={(e) => handleChange(e.target.value, "pax")}
                        sx={{
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                                borderColor: "#F2F2F2", // Change the color to your desired color
                            },
                        }}
                    />

                    <TextField
                        label="Emails of included participants"
                        placeholder=""
                        multiline
                        rows={3}
                        value={formState.participantEmails}
                        error={checkParticipantEmails(formState.pax, formState.participantEmails)}
                        helperText={checkParticipantEmails(formState.pax, formState.participantEmails) ? "Must include all valid emails of the participants. Separate emails with [enter]." : ""}
                        onChange={(e) => handleChange(e.target.value, "participantEmails")}
                        sx={{
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                                borderColor: "#F2F2F2", // Change the color to your desired color
                            },
                        }}
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
                        sx={{
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                                borderColor: "#F2F2F2", // Change the color to your desired color
                            },
                        }}
                    />

                    <DialogActions sx={{ justifyContent: 'space-around' }}>
                        <Button onClick={scheduler.close}
                            sx=
                            {{
                                marginTop: '50px',
                                width: "100%",
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'
                            }}>
                            Cancel
                        </Button>

                        <Button onClick={handleSubmit}
                            sx=
                            {{
                                marginTop: '50px',
                                width: "100%",
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'
                            }}>
                            {event ? "Edit" : "Reserve"}
                        </Button>
                    </DialogActions>

                    {authContext?.userRole === "Admin" || authContext?.userRole === "Librarian"
                        ? <Button
                            onClick={setRoomUnavailable}
                            sx=
                            {{
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'red'
                            }}>
                            Set Room Unavailable
                        </Button>
                        : <></>
                    }
                </Grid>
                <Grid item
                    width={{ lg: "150vw", md: "120vw", sm: "80vw", xs: "0" }}
                    height={{ lg: "90vh", md: "90vh", sm: "90vh", xs: "0" }}
                    sx={{
                        backgroundImage:
                            branchId === "scitech" ? `url("${scitechroom}")` :
                                branchId === "genref" ? `url("${genrefroom}")` :
                                    `url("${shsroom}")`,

                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }} />
            </Grid>
        );
    };

    /******************************
     *  CUSTOM EVENT VIEWER 
     ******************************/
    const CustomViewer = (event: ProcessedEvent, close: () => void): JSX.Element => {
        return (
            <Grid sx={{
                width: "100%",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                color: '#000000',
                background: theme.palette.mode === 'dark' ? '#1B1B1B' : '#E3E3E3'
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <Portrait sx={{ marginLeft: "-4px", }} />
                    <Typography variant="caption" >Representative: {event?.stuRep}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <School sx={{ marginLeft: "-4px", }} />
                    <Typography variant="caption" >Representative's College: {event?.stuRep.split('.')[2].split('@')[0].toUpperCase()}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <Numbers sx={{ marginLeft: "-4px", }} />
                    <Typography variant="caption" >Number of Participants: {event?.pax}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <TextSnippet sx={{ marginLeft: "-4px", }} />
                    <Typography variant="caption" >Reason for Reservation: {event?.purp}</Typography>
                </Box>

                <Box sx={{ mt: 2, mb: 1 }}>
                    <Divider variant="middle" sx={{ backgroundColor: "#1E1F20" }} />
                </Box>

                {/* TODO: Retrieve and display all participant emails */}
                {authContext?.userRole === "Admin" || authContext?.userRole === "Librarian" ?
                    <Container sx={{ display: "flex", justifyContent: "space-between", my: "5px" }}>

                        <Box sx={{ mt: 2, mb: 3, color: '#1E1F20' }}>
                            <Divider variant="middle" />
                        </Box>

                        {/* 1st Column */}
                        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-evenly", marginLeft: "-85px" }}>

                            <Button size="small" onClick={() => {
                                console.log("In custom edit")
                                timelineRef.current?.scheduler.triggerDialog(true, event);
                                close();
                            }} sx={{ color: '#1E1F20', lineHeight: "1" }}>
                                <EditNoteOutlinedIcon sx={{ marginRight: "10px" }} />
                                Edit Reservation
                            </Button>

                            <Button size="small" onClick={() => {
                                console.log("In custom delete")
                                handleDelete(event.event_id + "");
                            }} sx={{ marginLeft: '-2.5px', color: '#1E1F20', lineHeight: "1" }}>
                                <DeleteOutlineOutlinedIcon sx={{ color: '#D22B2B', marginRight: "10px" }} />
                                Delete Reservation
                            </Button>
                        </Container>

                        {/* Spacer */}
                        <div style={{ width: '50px' }}></div> {/* Adjust width as needed for spacing between columns */}

                        {/* 2nd Column */}
                        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-evenly", marginRight: "-45px" }}>
                            <Button size="small" onClick={() => updateEventTitle(event.event_id + "", "Unavailable")} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} sx={{ color: '#1E1F20', lineHeight: "1" }}>
                                <EventBusyOutlinedIcon sx={{ color: '#D22B2B', marginRight: "10px" }} />
                                Set as Unavailable
                            </Button>

                            {event.title === "Reserved" &&
                                <Button size="small" onClick={() => updateEventTitle(event.event_id + "", "Occupied")} sx={{ color: '#1E1F20', lineHeight: "1" }}>
                                    <CheckBoxOutlinedIcon sx={{ color: '#009E60', marginRight: "10px" }} />
                                    Confirm Arrival
                                </Button>
                            }

                            {event.title === "Occupied" &&
                                <Button size="small" onClick={() => updateEventTitle(event.event_id + "", "Departed")} sx={{ color: '#1E1F20', lineHeight: "1" }}>
                                    <RunCircleOutlinedIcon />
                                    Confirm Departure
                                </Button>
                            }
                        </Container>
                    </Container>


                    : authContext?.user?.email === event?.stuRep ?
                        <Container sx={{ display: "flex", justifyContent: "space-between", my: "5px" }}>

                            <Box sx={{ mt: 2, mb: 3, color: '#1E1F20' }}>
                                <Divider variant="middle" />
                            </Box>

                            {/* 1st Column */}
                            <Container sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-evenly", marginLeft: "-85px" }}>
                                <Button size="small" onClick={() => {
                                    console.log("In custom delete")
                                    handleDelete(event.event_id + "");
                                }} sx={{ marginLeft: '-2.5px', color: '#1E1F20', lineHeight: "1" }}>
                                    <CancelIcon sx={{ color: '#D22B2B', marginRight: "10px" }} />
                                    Cancel Reservation
                                </Button>
                            </Container>
                        </Container> 
                        : <></>
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
                startHour: startTime,
                endHour: endTime,
                step: 30
            }}


            resources={roomsState}
            resourceFields={{ idField: "room_id", textField: "title" }}
            resourceViewMode="default"
            // required to access room_id
            fields={[
                {
                    name: "room_id",
                    type: "hidden",
                },
            ]}
            eventRenderer={({ event, ...props }) => {
                // when an event is only 15 mins long, the details are compressed
                if (event?.duration === 15) {
                    return (
                        <div
                            style={{
                                // display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "100%",
                                width: "100%",
                                background: `${event?.color}`,
                                fontSize: "0.8em",
                                color: "White",
                            }}
                            {...props}
                        >
                            <div
                                style={{ margin: "5px" }}
                            >
                                {event.title} &nbsp;
                                {event.start.toLocaleTimeString("en-US", { timeStyle: "short" })} - {event.end.toLocaleTimeString("en-US", { timeStyle: "short" })}
                            </div>
                        </div>
                    );
                }
                return null;
            }}
        />
    );
}

export default CustomTimelineRenderer