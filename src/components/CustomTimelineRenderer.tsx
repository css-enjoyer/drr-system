import { ProcessedEvent, SchedulerHelpers } from "@aldabil/react-scheduler/types";
import { useState } from "react";

function CustomTimelineRenderer() {

    interface CustomEditorProps {
        scheduler: SchedulerHelpers;
    }
    const CustomEditor = ({ scheduler }: CustomEditorProps) => {
        const event = scheduler.edited;
        const [state, setState] = useState({
            // title: "Reservation",
            // logDate: new Date(), 
            // logStartTime: new Date(), Starting values (Only for custom fields)
            // logEndTime: new Date(),
            logPax: 4,
            logPurp: "Studying",
            logRcpt: 1234,
            logStuRep: "Isaac",
            roomId: 1
        })
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
                            eventId: event?.event_id || Math.random(),
                            logDate: scheduler.state.date.value, //????
                            logStartTime: scheduler.state.start.value,
                            logEndTime: scheduler.state.end.value,
                            logPax: state.logPax,
                            logPurp: state.logPurp,
                            logRcpt: Math.random(), //????
                            logStuRep: state.logStuRep, //retrieve auth user
                            roomId: 1, //????
                        });
                    }, 3000)
                })) as ProcessedEvent;
                scheduler.onConfirm(addedUpdatedEvent, event ? "edit" : "create");
                scheduler.close();
            } finally {
                scheduler.loading(False)
            }
        };
        return (
            <div>CustomTimelineRenderer</div>
        )
    };
}

export default CustomTimelineRenderer