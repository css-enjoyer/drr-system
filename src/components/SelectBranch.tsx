import { Box, Container, Grid, Paper, Typography } from '@mui/material'
import { getBranches } from '../firebase/dbHandler';
import { useContext, useEffect, useState } from 'react';
import { fetchCollege } from '../utils/fetchCollege';
import { formatGreeting } from '../utils/formatGreeting';
import { AuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Branch } from '../Types';
import Loading from './miscellaneous/Loading';

function SelectBranch() {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const college = fetchCollege(authContext);

    const [loading, setLoading] = useState(true); // State to track loading status
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const branchesData = await getBranches();
                const filteredBranches = authContext?.userRole === "Student"
                    ? branchesData.filter((branch) => {
                            if (college === "CRS" || college === "MED" || college === "NUR") {
                                return branch.branchId !== "shs";
                            }
                            return (
                                branch.branchId !== "shs" 
                                && branch.branchId !== "healthSci"
                            );
                        }
                    )
                    : branchesData
                setBranches(filteredBranches);
            } catch (error) {
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

    if (loading) {
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
                            <Box color="#FFFFFF" 
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