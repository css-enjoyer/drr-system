import { Box, Container, Divider, Grid, Typography } from '@mui/material'
import { useThemeContext } from '../theme/ThemeContextProvider';

function Footer() {
    let background = "";
    const { theme } = useThemeContext();
        if(theme.palette.mode === "dark") {
            background = 'radial-gradient(circle,#000000 100%, #ffea76 20%, #fff394 30%)';
        } else {
            background = 'radial-gradient(circle, #2b2b2b 0%, #2b2b2b 100%)';
        }
    return (
        <Box 
            sx={{
                width: "100%",
                height: "230px",
                display: 'flex',
                alignItems: 'center',
                color: '#F9F6E0',
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