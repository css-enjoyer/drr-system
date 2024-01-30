import { Scheduler } from '@aldabil/react-scheduler';
import { Container } from '@mui/material';

function Timeline() {

    const RESOURCES = [
        {
            room_id: 1,
            title: "Room 1",
            color: "#ab2d2d"
        },
        {
            room_id: 2,
            title: "Room 2",
            color: "#58ab2d"
        },
        {
            room_id: 3,
            title: "Room 3",
            color: "red"
        },
        {
            room_id: 4,
            title: "Room 4",
            color: "blue"
        },
    ];

    return (
        <Container maxWidth="xl">
            <Scheduler
                view="day"
                events={[
                    {
                        event_id: 1,
                        title: "Event 1",
                        start: new Date("2021/5/2 09:30"),
                        end: new Date("2021/5/2 10:30"),
                    },
                    {
                        event_id: 2,
                        title: "Event 2",
                        start: new Date("2021/5/4 10:00"),
                        end: new Date("2021/5/4 11:00"),
                    },
                ]}
                day={
                    {
                        startHour: 8,
                        endHour: 21,
                        step: 30,
                    }
                }
                resources={RESOURCES}
                resourceFields={{
                    idField: "room_id",
                    textField: "title",
                }}
                resourceViewMode="tabs">
            </Scheduler>
        </Container>
    )
}

export default Timeline;