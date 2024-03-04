import { Box, Container, Divider, Grid, Typography } from '@mui/material'
import { useThemeContext } from '../theme/ThemeContextProvider';

function Footer() {
    let background = "";
    const { theme } = useThemeContext();
        if(theme.palette.mode === "dark") {
            background = 'radial-gradient(circle, rgba(51,51,51,1) 0%, rgba(40,40,40,1) 100%)';
        } else {
            background = 'radial-gradient(circle, rgba(43,43,43,1) 0%, rgba(43,43,43,1) 100%)';
        }
    return (
        <Box 
            sx={{
                width: "100%",
                height: "230px",
                // paddingTop: "1rem",
                // paddingBottom: "1rem",
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                backgroundColor: {background}
            }}>
            <Divider/>
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