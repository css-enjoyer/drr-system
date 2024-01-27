import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, Paper, TextField, Typography } from "@mui/material";

import heroImage from '../styles/images/login-hero-image.png';
import cicsLogo from '../styles/images/cics-logo.png';
import ustLogo from '../styles/images/ust-logo.png';
import { BorderAll } from "@mui/icons-material";

function Copyright() {
    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="body2" color="text.secondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="#">Pegasus</Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Container>
    );
}

function LoginPage() {
    return (
        <Grid container sx={{ height: '100vh' }} component="main">
            {/* Left hero image */}
            <Grid item xs={false} sm={4} md={7} sx={{
                    backgroundImage: `url("${heroImage}")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    }} />

            {/* Right sign in form */}
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>

                {/* University logos */}
                <Grid container sx={{
                    mt: 10,
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    }} >
                    <Box component="img"
                        sx={{ height: '100px', width: 'auto', }}
                        alt="CICS Logo"
                        src={cicsLogo} />
                    <Box component="img"
                        sx={{ height: '100px', width: 'auto', }}
                        alt="UST Logo"
                        src={ustLogo} />
                </Grid>

                {/* Sign in box */}
                <Box sx={{
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }} >
                    <Avatar sx={{ m: 2, bgcolor: 'secondary.main' }} />
                    <Typography component="h1" variant="h5"> Sign in </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus />
                        <TextField margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password" />
                        <FormControlLabel control={<Checkbox value="remember" color="primary" />}
                            label="Remember me" />
                        <Button type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }} >
                            Sign In
                        </Button>

                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2"> Forgot password? </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2"> {"Don't have an account? Sign Up"} </Link>
                            </Grid>
                        </Grid>

                        <Copyright />

                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default LoginPage;