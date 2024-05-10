import { Container, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Branch, ReservationEvent } from "../../Types";
import { getAllReservationEvents, getBranches } from "../../firebase/dbHandler";
import Loading from "./Loading";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";

function Analytics() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [resEvents, setResEvents] = useState<ProcessedEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const branchesData = await getBranches();
                const resEventsData = await getAllReservationEvents();
                setBranches(branchesData);
                setResEvents(resEventsData);
            } catch (error) {
                console.error('Error fetching branches:', error);
                console.error('Error fetching reservation events:', error);
            }
            setLoading(false);
        };
        fetchData()
    }, []);

    if (loading) {
        return <Loading></Loading>
    }

    console.log(resEvents);

    return(
        <Container sx={{marginTop: "60px"}}>
            <Typography variant="h1" sx={{fontSize: "40px", fontWeight: "Bold"}}>
                Analytics and Reports
            </Typography>
            <Typography variant="h3" sx={{fontSize: "30px"}}>
                Total number of reservations: {resEvents.length}
            </Typography>
        </Container>
    )
}

export default Analytics;