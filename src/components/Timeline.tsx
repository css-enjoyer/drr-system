import { Container, Typography } from '@mui/material';
import { getReservations } from '../firebase/dbHandler';
import { formatGreeting } from '../utils/formatGreeting';
import { AuthContext } from '../utils/AuthContext';
import { useContext } from 'react';
import CustomTimelineRenderer from './CustomTimelineRenderer';
import { useParams } from 'react-router-dom';

function Timeline() {
    const { branchId } = useParams<{ branchId: string }>();
    const authContext = useContext(AuthContext);

    return (
        <Container maxWidth="xl" sx={{ py: 3, pb: 20 }}>
            <Typography variant="h4" sx={{ mb: "10px", fontWeight: "500" }}>Welcome, {formatGreeting(authContext)}</Typography>
            <Typography variant="h4" sx={{ mb: "10px", fontWeight: "500" }}>{`${branchId}`}</Typography>
            {/* TODO: Route when branchId is not valid */}
            <CustomTimelineRenderer branchId={branchId} />
        </Container>
    )
}

export default Timeline;