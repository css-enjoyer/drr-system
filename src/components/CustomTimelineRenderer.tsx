import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent, SchedulerHelpers } from "@aldabil/react-scheduler/types";
import { Button, DialogActions, TextField } from "@mui/material";
import { useState } from "react";

function CustomTimelineRenderer() {

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

    return (
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
    )
}

export default CustomTimelineRenderer