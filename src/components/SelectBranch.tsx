import { Grid, Paper, Typography } from '@mui/material'
import { Branch, getBranches } from '../firebase/dbHandler';
import { useEffect, useState } from 'react';

function SelectBranch() {
    const [branches, setBranches] = useState<Branch[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const branchesData = await getBranches();
            setBranches(branchesData);
        };
        fetchData();
    }, []);


    return (
        <Grid className="SelectBranch" flexDirection={{ lg: "row", md: "row", xs: "column" }} px={{ lg: "100px" }} sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "50px",
            p: "50px",
        }}>
            {branches.map((branch) => (
                <Paper key={branch.branchId} className="branch" component={Grid} item xs
                    width={{ xs: "100%" }}
                    sx={{
                        height: "80vh",
                        minWidth: "200px",
                        display: "flex",
                        alignItems: "end"
                    }}>
                    <Typography variant="h4" sx={{
                        m: "20px",
                    }}>{branch.branchTitle}</Typography>
                </Paper>
            ))}
        </Grid>
    )
}

export default SelectBranch