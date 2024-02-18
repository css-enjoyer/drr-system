// Confirmation.tsx

import React from "react";
import { Button, Typography, Container, Grid } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConfirmationMessages from "./ConfirmationMessages"; // Import ConfirmationMessages

interface ConfirmationPageProps {
  messageKey: string; // Add messageKey prop
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ messageKey }) => {
  const handleReturn = () => {};

  // Check if messageKey exists in ConfirmationMessages
  const confirmationMessage = ConfirmationMessages[messageKey];
  if (!confirmationMessage) {
    // If messageKey doesn't exist, handle the error (e.g., display a default message)
    return (
      <Container
        maxWidth="md"
        style={{ marginTop: "80px", marginBottom: "80px" }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Error: Message not found
        </Typography>
      </Container>
    );
  }

  // Destructure title and message from confirmationMessage
  const { title, message } = confirmationMessage;

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
          <CheckCircleIcon sx={{ fontSize: 120, color: "	#6495ED" }} />
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center" gutterBottom>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" align="center">
            {message}
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

export default ConfirmationPage;
