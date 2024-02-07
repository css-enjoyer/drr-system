import { Scheduler } from '@aldabil/react-scheduler';
import { Container, Typography } from '@mui/material';
import { getReservations } from '../firebase/dbHandler';
import { formatGreeting } from '../utils/formatGreeting';
import { AuthContext } from '../utils/AuthContext';
import { useContext } from 'react';
import CustomTimelineRenderer from './CustomTimelineRenderer';

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

    return (
        <Container maxWidth="xl" sx={{ py: 3, pb: 20 }}>
            <Typography variant="h4" sx={{ mb: "10px", fontWeight: "500" }}>Welcome, {formatGreeting(authContext)}</Typography>
            <CustomTimelineRenderer />
            {/* <Scheduler
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
                resources={ RESOURCES }
                resourceFields={{ idField: "room_id", textField: "title", }}
                resourceViewMode="default" /> */}
        </Container>
    )
}

export default Timeline;