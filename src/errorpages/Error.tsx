import React from "react";
import { Typography, Container, Grid } from "@mui/material";
import ErrorMessages from "./ErrorMessages"; // Import ErrorMessages

interface ErrorPageProps {
  messageKey: string; // Add messageKey prop
}

const ErrorPage: React.FC<ErrorPageProps> = ({ messageKey }) => {
  const handleReturn = () => {};

  // Check if messageKey exists in ErrorMessages
  const errorMessage = ErrorMessages[messageKey];
  if (!errorMessage) {
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

  // Destructure title and message from errorMessage
  const { title, message } = errorMessage;

  return (
    <Container
      maxWidth="md"
      style={{ marginTop: "80px", marginBottom: "80px", display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}
    >
      <Grid container direction="column" alignItems="center" spacing={2}>
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
      </Grid>
    </Container>
  );
};

export default ErrorPage;
