import { Scheduler } from '@aldabil/react-scheduler';
import { Button, Container, DialogActions, TextField, Typography } from '@mui/material';
import { getReservations } from '../firebase/dbHandler';
import { formatGreeting } from '../utils/formatGreeting';
import { AuthContext } from '../utils/AuthContext';
import { useContext, useState } from 'react';
import { ProcessedEvent, SchedulerHelpers } from '@aldabil/react-scheduler/types';

function Timeline() {
    const authContext = useContext(AuthContext);

    const logs = getReservations();
    logs.then((log) => {
        log.forEach(reservation => {
            if (reservation != null) {
                console.log(reservation)
            }
        })
    })

    interface CustomEditorProps {
        scheduler: SchedulerHelpers;
    }
    const CustomEditor = ({ scheduler }: CustomEditorProps) => {
        const event = scheduler.edited;
        const [state, setState] = useState({  // set custom input fields and event properties here?
            title: "Title",
            description: "Description",
            pax: 4
        });
        const [error, setError] = useState("");
        const handleChange = (value: string, name: string) => {
            setState((prev) => { return { ...prev, [name]: value }; });
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
            <div>
                <div style={{ padding: "1rem" }}>
                    <p>Reserve Room</p>
                    <TextField
                        label="Title"
                        value={state.title}
                        onChange={(e) => handleChange(e.target.value, "title")}
                        error={!!error}
                        helperText={error}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={state.description}
                        onChange={(e) => handleChange(e.target.value, "description")}
                        fullWidth
                    />
                    <TextField
                        label="Number of Participants"
                        value={state.pax}
                        onChange={(e) => handleChange(e.target.value, "pax")}
                        fullWidth
                    />
                </div>
                <DialogActions>
                    <Button onClick={scheduler.close}>Cancel</Button>
                    <Button onClick={handleSubmit}>Confirm</Button>
                </DialogActions>
            </div>
        );
    };

    const RESOURCES = [
        {
            room_id: 1,
            title: "Room 1",
            color: "darkblue"
        },
        {
            room_id: 2,
            title: "Room 2",
            color: "#black"
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 3, pb: 20 }}>
            <Typography variant="h4" sx={{ mb: "10px", fontWeight: "500" }}>Welcome, {formatGreeting(authContext)}</Typography>
            <Scheduler
                customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
                viewerExtraComponent={(fields, event) => {
                    return (
                        <div>
                            <p>Useful to render custom fields...</p>
                            <p>Description: {event.description || "Nothing..."}</p>
                            <p>Pax: {event.pax || "Nothing..."}</p>
                        </div>
                    );
                }}
            />

            <Scheduler
                view="day"
                events={[
                    {
                        event_id: 1,
                        room_id: 1,
                        title: "Event 1",
                        start: new Date("2024/2/4 011:30"),
                        end: new Date("2024/2/4 12:00"),
                    },
                ]}
                day={{ startHour: 8, endHour: 21, step: 30 }}
                resources={RESOURCES}
                resourceFields={{ idField: "room_id", textField: "title", }}
                resourceViewMode="default">
            </Scheduler>
        </Container>
    )
}

export default Timeline;