import { Box, Container, Grid, Paper, Typography } from '@mui/material'
import { getBranches } from '../firebase/dbHandler';
import { useContext, useEffect, useState } from 'react';
import { formatGreeting } from '../utils/formatGreeting';
import { AuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Branch } from '../Types';
import { isSHS } from '../utils/Utils';
import genrefImg from '../styles/images/genref-section.jpg';
import { auth } from '../firebase/config';
import Loading from './miscellaneous/Loading';

function SelectBranch() {

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // State to track loading status
    const [branches, setBranches] = useState<Branch[]>([]);

    // * CHECKER
    console.log("is SHS?");
    console.log(isSHS(authContext?.user?.email));

    useEffect(() => {
        const fetchData = async () => {
            try {
            const branchesData = await getBranches();
            const filteredBranches = !isSHS(authContext?.user?.email) 
                ? branchesData.filter((branch) => branch.branchId !== "shs") 
                : branchesData;
            setBranches(filteredBranches);
            } catch(error) {
                console.error('Error fetching branches:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authContext]);

    const redirectToTimeline = (branchId: string) => {
        navigate(`/branches/${branchId}/timeline/`);
    };

    if(loading) {
        return <Loading />;
    }

    return (
        <Container sx={{
            minHeight: "auto",
            height: "100vh",
            py: 3, pb: 20
        }}>
            <Typography variant="h4" sx={{ mb: "10px", fontWeight: "500" }}>Welcome, {formatGreeting(authContext)}</Typography>
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
                    <Grid key={branch.branchId} className="branch" item xs width={{ xs: "100%" }}
                        sx={{ height: "100%" }}>
                        <Paper
                            sx={{
                                height: "100%",
                                display: "flex",
                                alignItems: "end",
                                padding: "20px",
                                cursor: "pointer",
                                backgroundImage: `url("${branch.imgSrc}")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            onClick={() => redirectToTimeline(branch.branchId)}>
                            <Box color="#F9F6E0" 
                            sx={{ 
                                textShadow: "0px 3px 3px black" ,
                                }}>
                                <Typography variant="h4">
                                    {branch.branchTitle}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {branch.branchLoc}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default SelectBranch;