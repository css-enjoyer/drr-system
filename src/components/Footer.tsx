import { Box, Container, Divider, Grid, Typography } from '@mui/material';
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
                height: "275px",
                display: 'flex',
                alignItems: 'center',
                color: '#F9F6E0',
                backgroundColor: {background}
            }}>
            <Divider />
            <Container maxWidth="lg">
                <Grid container justifyContent="center" alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={6} md={6} textAlign="center">
                        <Typography variant="h6" gutterBottom>
                            Discussion Room Reservation System
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            The discussion rooms are exclusively available to currently enrolled students. Reservation requests can now be conveniently made through the DRRS website.
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', marginTop: '14px' }}>
                            {`${new Date().getFullYear()} | Pegasus | UST | CICS`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} textAlign="center">
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Contact us:
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            +63 2-8731-3034 | +63 2-8740-9709
                        </Typography>                        
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            library@ust.edu.ph
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Footer;