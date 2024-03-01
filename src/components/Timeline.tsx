import { Container, Typography } from "@mui/material";
import CustomTimelineRenderer from "./CustomTimelineRenderer";
import { useParams } from "react-router-dom";

function Timeline() {
  const { branchId } = useParams<{ branchId: string }>();

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: 20 }}>
      <Typography variant="h4" sx={{ mb: "10px", fontWeight: "500" }}>
        Timeline
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ mb: "10px", fontWeight: "500" }}
      >{`Now viewing ${branchId}, select a vacant timeframe for reservation.`}</Typography>
      {/* TODO: Route when branchId is not valid */}
      <CustomTimelineRenderer branchId={branchId || ""} />
      {/* <CustomTimelineRenderer branchId={branchId} /> */}
    </Container>
  );
}

export default Timeline;