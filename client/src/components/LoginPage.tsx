import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, Paper, TextField, Typography } from "@mui/material";

import heroImage from '../styles/images/login-hero-image.png';
import cicsLogo from '../styles/images/cics-logo.png';
import ustLogo from '../styles/images/ust-logo.png';

import Login from './logbuttons/Login';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2}}>
            {'Copyright © '}
            <Link color="inherit" href="#">Pegasus</Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function LoginPage() {
    return (
        <Grid container sx={{ height: '100vh' }} component="main">
            {/* Left hero image */}
            <Grid item xs={12} sx={{
                backgroundImage: `url("${heroImage}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }} >
                {/* <Grid item component={Paper} elevation={6} square /> */}
                {/* Sign in form */}
                <Grid item xs={12} md={8} lg={4} component={Paper} elevation={6} square>
                    {/* University logos */}
                    {/* <Grid container sx={{
                        display: 'flex',
                        gap: '200px',
                        justifyContent: 'center',
                        alignItems: 'center', }} >
                        <Box component="img"
                            sx={{ height: '100px', width: 'auto', }}
                            alt="CICS Logo"
                            src={cicsLogo} />
                        <Box component="img"
                            sx={{ height: '100px', width: 'auto', }}
                            alt="UST Logo"
                            src={ustLogo} />
                    </Grid> */}

                    {/* Sign in box */}
                    <Box bgcolor={'primary.main'} height={10} sx={{ zIndex: 'modal' }} />
                    <Box sx={{
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        p: 5
                    }} >
                        <Typography component="h1" variant="h4" > Sign in </Typography>
                        <Typography component="p" variant="body1" > To proceed to the DRRS Website, please sign in with your UST university email account. </Typography>
                        <Box component="form" noValidate sx={{ my: 2 }}>
                            <Login />
                        </Box>
                        <Typography component="p" variant="caption">
                            Need help signing in? <Link href="#">Learn more</Link>
                        </Typography>
                    </Box>
                    <Copyright />
                </Grid>
            </Grid>
        </Grid>



    )
}

export default LoginPage;