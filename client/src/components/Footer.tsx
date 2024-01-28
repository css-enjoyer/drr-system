import { Box, Container, Grid, Typography } from '@mui/material'
import React from 'react'

function Footer() {
    return (
        <Box
            sx={{
                width: "100%",
                height: "auto",
                backgroundColor: "inherit",
                paddingTop: "1rem",
                paddingBottom: "1rem",
            }}
        >
            <Container maxWidth="lg">
                <Grid container direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h6" align={'center'}>
                            Discussion Room Reservation
                            System
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            {`${new Date().getFullYear()} | Pegasus | UST | CICS`}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default Footer