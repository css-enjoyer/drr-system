import React from "react";
import { Typography, Container, Grid } from "@mui/material";
import NoInternetImage from "/src/styles/images/wifiError.png"; // Import no internet illustration

// Define the InternetConnection component
const InternetConnection: React.FC = () => {
  const handleReturn = () => {};

  return (
    <Container
      maxWidth="md"
      style={{ marginTop: "150px", marginBottom: "120px" }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2} // Adjusted spacing between grid items
      >
        <Grid item>
          <img src={NoInternetImage} alt="No Internet" style={{ width: 120 }} />
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center" gutterBottom>
            No Internet Connection
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            style={{ fontSize: "1rem" }}
          >
            Your connection appears to be offline. Try refreshing the page.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InternetConnection;
