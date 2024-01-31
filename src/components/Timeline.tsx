import { Scheduler } from '@aldabil/react-scheduler';
import { Button, Container } from '@mui/material';

function Timeline() {

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
        {
            room_id: 3,
            title: "Room 3",
            color: "darkblue"
        },
        {
            room_id: 4,
            title: "Room 4",
            color: "blue"
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 5, pb: 20 }}>
            <Button sx={{
                position: 'absolute',
                zIndex: 999,
                right: '800px',
            }}>View Mode</Button>
            <Scheduler
                view="day"
                events={[
                    {
                        event_id: 1,
                        room_id: 1,
                        title: "Event 1",
                        start: new Date("2024/1/31 011:30"),
                        end: new Date("2024/1/31 12:00"),
                    },
                    {
                        event_id: 2,
                        room_id: 1,
                        title: "Event 2",
                        start: new Date("2024/1/31 10:00"),
                        end: new Date("2024/1/31 11:00"),
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
                resourceViewMode="default">
            </Scheduler>
        </Container>
    )
}

export default Timeline;