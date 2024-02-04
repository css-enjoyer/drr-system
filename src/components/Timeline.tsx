import { Scheduler } from '@aldabil/react-scheduler';
import { Container, Typography } from '@mui/material';
import { getReservations } from '../firebase/dbHandler';
import { formatGreeting } from '../utils/formatGreeting';
import { AuthContext } from '../utils/AuthContext';
import { useContext } from 'react';

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
        <Container maxWidth="xl" sx={{ py: 3, pb: 20 }}>
            <Typography variant="h4" sx={{
                mb: "10px",
                fontWeight: "500"
            }}>Welcome, {formatGreeting(authContext)}</Typography>
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