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

import { max } from "date-fns";

//genref room images
import genrefroom1 from "../styles/images/genref-room1.jpeg";
import genrefroom2 from "../styles/images/genref-room2.jpeg";
import genrefroom3 from "../styles/images/genref-room3.jpeg";

//scitech room images
import scitechroom1 from "../styles/images/scitech-room1.jpeg";
import scitechroom2 from "../styles/images/scitech-room2.jpeg";
import scitechroom3 from "../styles/images/scitech-room3.jpeg";
import scitechroom4 from "../styles/images/scitech-room4.jpeg";

//shs room images
import shsroom1 from "../styles/images/shs-room1.jpeg";
import shsroom2 from "../styles/images/shs-room2.jpeg";
import shsroom3 from "../styles/images/shs-room3.jpeg";
import shsroom4 from "../styles/images/shs-room4.jpeg";
import shsroom5 from "../styles/images/shs-room5.jpeg";
import { autoCancel, sendReminderEmail } from "../utils/Functions.ts";

function CustomTimelineRenderer({ branchId }: { branchId: string }) {
    const timelineRef = useRef<SchedulerRef>(null);
    const { theme } = useThemeContext();

    const authContext = useContext(AuthContext);

    // --- TIMELINE: START & ENDING HOUR --- //
    const startTime = 8;
    const endTime = 18;
    const interval = 30;

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
            end: event?.end || interval > 15 ? new Date(scheduler.state.end.value - 15 * 60000) : scheduler.state.end.value,

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
        const [suggestionMsg, setSuggestionMsg] = useState("");

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

            const checkErrors = (): boolean => {
                if (checkParticipantEmails(formState.pax, formState.participantEmails)) {
                    setErrorMessage("Error! Your reservation must include all valid emails of the participants.");
                    console.log(formState.participantEmails)
                    return true;
                }

                if (isReservationBeyondOpeningHrs(formState.end, endTime)) {
                    setErrorMessage("Error! Your reservation exceeds library hours.");
                    return true;
                }

                if (isStudentReservationConcurrent(formState.eventId, formState.stuRep, eventsState) && (authContext?.userRole !== "Admin" && authContext?.userRole !== "Librarian")) {
                    setErrorMessage("Error! You already have a reservation.");
                    return true;
                }

                if (formState.start < new Date() &&
                    (authContext?.userRole === "Student" || authContext?.userRole === "SHS-Student")) {
                    setErrorMessage("Error! Your reservation is before the current time!");
                    return true;
                }

                let today = new Date()
                if (formState.start.getDate() > new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getDate()) {
                    setErrorMessage("Error! Room reservations can only be done a day ahead of current time!");
                    return true;
                }


                if (formState.duration < 15 || formState.duration > 120) {
                    setErrorMessage("Error! Duration should be within 15 minutes to 2 hours!");
                    return true;
                }

                today = new Date(formState.end)
                today.setHours(endTime)
                today.setMinutes(0)
                if (formState.end > today) {
                    setErrorMessage("Error! Cannot reserve past closing time");
                    return true;
                }

                return false;
            }
            
            // const showSuggestion = () => {
            //     const tipNumber = Math.floor(Math.random() * 3);
            //     if (tipNumber == 0) {
            //         setSuggestionMsg("Tip: You can reserve with the same time but in a different room");
            //     } else if (tipNumber == 1) {
            //         setSuggestionMsg("Tip: You can reserve on the next available time, in the same room");
            //     } else if (tipNumber == 2) {
            //         setSuggestionMsg("Tip: You can reserve with the same time but in a different branch");
            //     }
            // };

            const showSuggestion2 = (start: Date, branchId: string, roomId: string | number, duration: number) => {
                // TODO: ADD SUGGESTION LOGIC HERE
                const sameTimeDifferentRoom = eventsState.filter((event) => 
                    event.start.getFullYear() === start.getFullYear() &&
                    event.start.getMonth() === start.getMonth() &&
                    event.start.getDate() === start.getDate() &&
                    event.start.getHours() === start.getHours() &&
                    event.start.getMinutes() === start.getMinutes()
                    // event.end.getHours() === end.getHours() &&
                    // event.end.getMinutes() === end.getMinutes()
                );

                const sameRoomNextAvailTime = eventsState.filter((event) =>
                    event.branchId === branchId &&
                    event.room_id === roomId &&
                    event.start.getFullYear() === start.getFullYear() &&
                    event.start.getMonth() === start.getMonth() &&
                    event.start.getDate() === start.getDate()
                );
                sameRoomNextAvailTime.sort((a, b) => a.start.valueOf() - b.end.valueOf());
                // console.log(sameRoomNextAvailTime);

                const lastResInSameRoom = sameRoomNextAvailTime.slice((-1));
                // console.log(lastResInSameRoom);
                const lastResInSameRoomTime = new Date(lastResInSameRoom[0].start.getTime() + (duration * 60 * 1000));
                const closingTime = new Date();
                closingTime.setHours(endTime, 0, 0, 0);

                // console.log("========== SAME ROOM NEXT AVAILABLE TIME");
                // console.log(`${lastResInSameRoomTime} < ${closingTime}`);
                if (roomsState.length - sameTimeDifferentRoom.length - 1 > 0) {
                    setSuggestionMsg("Tip: You can reserve with the same time but in a different room");
                } else if (lastResInSameRoomTime < closingTime) {
                    setSuggestionMsg("Tip: You can reserve on the next available time, in the same room");
                } else {
                    setSuggestionMsg("Tip: You can reserve tomorrow with the same time and room");
                }
            };

            if (checkErrors()) {
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
                        const newAddedEventId = await addReservationEvent(newResEvent);
                        console.log("Newly Added Event ID: " + newAddedEventId);
                        // TODO: should be for students only, for checking its avail on all roles
                        // ----- REMINDER EMAIL -----
                        sendReminderEmail(
                            newResEvent.start,
                            newResEvent.stuRep,
                            newResEvent.room_id,
                            newResEvent.branchId,
                            0 // NO MINUTES DELAY BEFORE REMINDER, INSTANT EMAIL
                        );
                        // ----- AUTO CANCEL -----
                        autoCancel(
                            authContext?.user?.accessToken,
                            newAddedEventId,
                            newResEvent.start,
                            newResEvent.stuRep,
                            newResEvent.room_id,
                            newResEvent.branchId,
                            10 // 10 MINUTES DELAY AFTER RESERVATION START
                        );
                        // fetchReservationEvents();
                    }
                    else {
                        // showSuggestion();
                        showSuggestion2(newResEvent.start, newResEvent.branchId, newResEvent.room_id, newResEvent.duration);
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
                        // showSuggestion();
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
                }}>
                <Grid item sx={{
                    p: "35px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    overflowY: "auto",
                    pb: "30px",
                    background: theme.palette.mode === 'dark' ? '#1E1F20' : '#E3E3E3'

                }}>
                    <Typography variant="h4" sx={{}}>{event ? "Edit" : "Reserve"} Room {scheduler.state.room_id.value}</Typography>
                    <TextField
                        label="Group Representative"
                        value={authContext?.user?.email}
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
                    {suggestionMsg &&
                        <Alert severity="info">
                            {suggestionMsg}
                        </Alert>
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
                                marginTop: '20px',
                                width: "100%",
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'
                            }}>
                            Cancel
                        </Button>

                        <Button onClick={handleSubmit}
                            sx=
                            {{
                                marginTop: '20px',
                                width: "100%",
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'
                            }}>
                            {event ? "Edit" : "Reserve"}
                        </Button>
                    </DialogActions>

                    {authContext?.userRole === "Admin" || authContext?.userRole === "Librarian"
                        ? <Button
                            onClick={setRoomUnavailable}
                            sx={{
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'red',
                                "&:hover": {
                                    borderColor: "red", // Red outline
                                    backgroundColor: "rgba(255, 0, 0, 0.1)" // Red shade
                                }
                            }}
                        >
                            Set Room Unavailable
                        </Button>

                        : <></>
                    }
                </Grid>

                <Grid item
                    width={{ lg: "150vw", md: "120vw", sm: "80vw", xs: "0" }}
                    height={{ lg: "90vh", md: "90vh", sm: "90vh", xs: "0" }}
                    sx={{
                        //scheduler.state.room_id.value
                        backgroundImage:
                            branchId === "genref"
                                ? scheduler.state.room_id.value === 1 ? `url("${genrefroom1}")` :
                                    scheduler.state.room_id.value === 2 ? `url("${genrefroom2}")` :
                                        scheduler.state.room_id.value === 3 ? `url("${genrefroom3}")` :
                                            scheduler.state.room_id.value === 4 ? `url("${genrefroom3}")` :
                                                `url("${genrefroom3}")`

                                : branchId === "scitech"
                                    ? scheduler.state.room_id.value === 1 ? `url("${scitechroom1}")` :
                                        scheduler.state.room_id.value === 2 ? `url("${scitechroom2}")` :
                                            scheduler.state.room_id.value === 3 ? `url("${scitechroom3}")` :
                                                scheduler.state.room_id.value === 4 ? `url("${scitechroom4}")` :
                                                    `url("${scitechroom4}")`

                                    // update when shs rooms are added
                                    : branchId === "shs"
                                        ? scheduler.state.room_id.value === 1 ? `url("${shsroom1}")` :
                                            scheduler.state.room_id.value === 2 ? `url("${shsroom2}")` :
                                                scheduler.state.room_id.value === 3 ? `url("${shsroom3}")` :
                                                    scheduler.state.room_id.value === 4 ? `url("${shsroom4}")` :
                                                        scheduler.state.room_id.value === 5 ? `url("${shsroom5}")` :
                                                            `url("${shsroom5}")` :

                                        `url("${shsroom5}")`,

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
                color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000',
                background: theme.palette.mode === 'dark' ? '#1B1B1B' : '#E3E3E3'
            }}>

                <Box sx={{ display: "flex", alignItems: "center", gap: "7px", color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000' }}>
                    <Portrait sx={{ marginLeft: "-4px" }} />
                    <Typography variant="caption"  >Representative: {event?.stuRep}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px", color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000' }}>
                    <School sx={{ marginLeft: "-4px", }} />
                    <Typography variant="caption" >Representative's College: {event?.stuRep.split('.')[2].split('@')[0].toUpperCase()}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px", color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000' }}>
                    <Numbers sx={{ marginLeft: "-4px", }} />
                    <Typography variant="caption" >Number of Participants: {event?.pax}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px", color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000' }}>
                    <TextSnippet sx={{ marginLeft: "-4px", }} />
                    <Typography variant="caption" >Reason for Reservation: {event?.purp}</Typography>
                </Box>

                <Box sx={{ mt: 2, mb: 1, color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000' }}>
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
                            }} sx={{ color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000', lineHeight: "1" }}>
                                <EditNoteOutlinedIcon sx={{ marginRight: "10px", color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000' }} />
                                Edit Reservation
                            </Button>

                            <Button size="small" onClick={() => {
                                console.log("In custom delete")
                                handleDelete(event.event_id + "");
                            }} sx={{ marginLeft: '-2.5px', color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000', lineHeight: "1" }}>
                                <DeleteOutlineOutlinedIcon sx={{ color: '#D22B2B', marginRight: "10px" }} />
                                Delete Reservation
                            </Button>
                        </Container>

                        {/* Spacer */}
                        <div style={{ width: '50px' }}></div> {/* Adjust width as needed for spacing between columns */}

                        {/* 2nd Column */}
                        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-evenly", marginRight: "-45px" }}>
                            <Button size="small" onClick={() => updateEventTitle(event.event_id + "", "Unavailable")} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} sx={{ color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000', lineHeight: "1" }}>
                                <EventBusyOutlinedIcon sx={{ color: '#D22B2B', marginRight: "10px" }} />
                                Set as Unavailable
                            </Button>

                            {event.title === "Reserved" &&
                                <Button size="small" onClick={() => updateEventTitle(event.event_id + "", "Occupied")}
                                    sx={{ color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000', lineHeight: "1" }}>
                                    <CheckBoxOutlinedIcon sx={{ color: '#009E60', marginRight: "10px" }} />
                                    Confirm Arrival
                                </Button>
                            }

                            {event.title === "Occupied" &&
                                <Button size="small" onClick={() => updateEventTitle(event.event_id + "", "Departed")} sx={{ color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000', lineHeight: "1" }}>
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
                                }} sx={{ marginLeft: '-2.5px', color: theme.palette.mode === 'dark' ? '#E3E3E3' : '#000000', lineHeight: "1" }}>
                                    <CancelIcon sx={{ color: '#D22B2B', marginRight: "10px" }} />
                                    Cancel Reservation
                                </Button>
                            </Container>
                        </Container>
                        : <></>
                }
            </Grid >
        );
    }

    return (
        <Scheduler dialogMaxWidth="xl"
            ref={timelineRef}
            customEditor={(scheduler) => <CustomEditor scheduler={scheduler}
            />}
            customViewer={CustomViewer}
            view="day"
            events={eventsState}
            day={{
                startHour: startTime,
                endHour: endTime,
                step: interval
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
                                color: "#FFFFFF",
                            }}
                            {...props}
                        >
                            <div style={{ margin: "5px", color: "#FFFFFF", }}>
                                {event.title} &nbsp;
                                {event.start.toLocaleTimeString("en-US", { timeStyle: "short" })} - {event.end.toLocaleTimeString("en-US", { timeStyle: "short" })}
                            </div>

                        </div>
                    );
                }
                if (event?.duration > 15) {
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
                                color: "#FFFFFF",
                            }}
                            {...props}
                        >
                            <div style={{ margin: "5px", color: "#FFFFFF", }}>
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