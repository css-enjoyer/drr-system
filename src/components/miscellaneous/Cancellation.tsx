// Import the necessary dependencies
import React from "react";
import { Button, Typography, Container, Grid } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Define the CancellationPage component
const CancellationPage: React.FC = () => {
  const handleReturn = () => {};

  return (
    <Container
      maxWidth="md"
      style={{ marginTop: "80px", marginBottom: "80px" }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2} // Adjusted spacing between grid items
      >
        <Grid item>
          <CheckCircleIcon sx={{ fontSize: 120, color: "#D36161" }} />
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center" gutterBottom>
            Reservation Cancelled
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleReturn}
            style={{ marginTop: "24px" }}
          >
            Return
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CancellationPage;
