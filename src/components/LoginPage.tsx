import { Box, Divider, Grid, Link, Paper, Typography } from "@mui/material";

import bgImage from '../styles/images/loginBgImageDark.png';
import cicsLogo from '../styles/images/cics-logo.png';
import ustLogo from '../styles/images/UST_LOGO_WHT.png';

import LoginButton from './logbuttons/LoginButton';
import { AuthContext } from "../utils/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ m: 2 }}>
            {'Copyright © '}
            <Link color="inherit" href="#">Pegasus</Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function LoginPage() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(auth?.user) {
            navigate("/timeline");
            console.log("User already logged in, redirected.");
        }
    })

    return (
        <Grid container sx={{ height: '100vh' }} component="main" className="LoginPage">
            {/* Background image */}
            <Grid item xs={12} className="loginBackgroundImage" sx={{
                backgroundImage: `url("${bgImage}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>

                {/* System hero */}
                <Box component={Grid} item md={5} display={{ xs: "none", sm: "none", md: "block" }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                    }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box component="img"
                            sx={{ height: '80px', objectFit: 'contain' }}
                            alt="UST Logo"
                            src={ustLogo}
                            display={{ xs: "none", sm: "none", md: "block" }} />
                        <Box component="img"
                            sx={{ height: '80px', objectFit: 'contain' }}
                            alt="CICS Logo"
                            src={cicsLogo}
                            display={{ xs: "none", sm: "none", md: "block" }} />
                    </Box>
                    <Box color="white" sx={{ textShadow: '-2px 2px 5px rgba(0, 0, 0, 0.4)' }} display={{ xs: "none", sm: "none", md: "block" }}>
                        <Typography variant="h3" >Library Reservation System</Typography>
                        <Typography variant="h5" >By Pegasus</Typography>
                    </Box>
                </Box>

                {/* Sign in form */}
                <Grid item xs={11} sm={8} md={5} component={Paper} elevation={6} square position='relative'>
                    <Box bgcolor={'primary.main'} height={10} sx={{ zIndex: 'modal'}} />
                    {/* System hero */}
                    <Box component={Grid} display={{ xs: 'block', sm: 'block', md: 'none' }} sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: 2, gap: 2}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                            <Box component="img"
                                sx={{ height: '30px', objectFit: 'contain' }}
                                alt="UST Logo"
                                src={ustLogo} 
                                display={{ xs: 'block', sm: 'block', md: 'none' }} />
                            <Box component="img"
                                sx={{ height: '30px', objectFit: 'contain' }}
                                alt="CICS Logo"
                                src={cicsLogo} 
                                display={{ xs: 'block', sm: 'block', md: 'none' }} />
                        </Box>
                        <Box display={{ xs: 'block', sm: 'block', md: 'none' }} >
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }} >Library Reservation System</Typography>
                            <Typography variant="body2" >By Pegasus</Typography>
                        </Box>
                    </Box>
                    {/* End of hero */}
                    <Box sx={{
                        mx: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        px: 1,
                        py: 5
                    }} >
                        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}> Sign in </Typography>
                        <Typography component="p" variant="body1" > To proceed to the DRRS Website, please sign in with your UST university email account. </Typography>
                        <Box sx={{ my: 2 }}>
                            <LoginButton />
                        </Box>
                        <Typography component="p" variant="caption">
                            Need help signing in? <Link href="#">Learn more</Link>
                        </Typography>
                    </Box>
                    <Divider />
                    <Copyright />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default LoginPage;