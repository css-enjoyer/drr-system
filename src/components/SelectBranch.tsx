import { Box, Container, Grid, Paper, Typography } from '@mui/material'
import { Branch, getBranches } from '../firebase/dbHandler';
import { useContext, useEffect, useState } from 'react';
import { formatGreeting } from '../utils/formatGreeting';
import { AuthContext } from '../utils/AuthContext';

function SelectBranch() {

    const authContext = useContext(AuthContext);

    const [branches, setBranches] = useState<Branch[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const branchesData = await getBranches();
            setBranches(branchesData);
        };
        fetchData();
    }, []);


    return (
        <Container sx={{
            minHeight: "auto",
            height: "100vh",
            width: "100vw",
        }}>
            <Typography variant="h4" sx={{ mt: "10px", fontWeight: "500" }}>Welcome, {formatGreeting(authContext)}</Typography>
            <Typography variant="subtitle1">To proceed, please select a branch.</Typography>
            <Grid className="SelectBranch" flexDirection={{ lg: "row", md: "row", xs: "column" }} px={{ lg: 0, xs: "20px" }} sx={{
                display: "flex",
                height: "80vh",
                maxHeight: "auto",
                alignItems: "center",
                justifyContent: "center",
                gap: "30px",
                py: "10px", 
            }}>
                {branches.map((branch) => (
                    <Grid key={branch.branchId} className="branch" component={Paper} item xs
                        width={{ xs: "100%" }}
                        sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "end"
                        }}>
                        <Box sx={{ m: "20px" }}>
                            <Typography variant="h4">
                                {branch.branchTitle}
                            </Typography>
                            <Typography variant="subtitle">
                                {branch.branchLoc}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default SelectBranch