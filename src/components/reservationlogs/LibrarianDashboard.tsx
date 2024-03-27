import { useEffect, useState} from 'react';
import { getBranches } from "../../firebase/dbHandler";
import { Branch } from "../../Types";
import { Container, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import RoomTable from './RoomTable';

// Fetch branches
// const [branches, setBranches] = useState<Branch[]>([]);
function LibrarianDashboard() {
    const [selectedBranch, setSelectedBranch] = useState('');
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const branchesData = await getBranches();
                setBranches(branchesData);
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Container sx={{
            minHeight: "auto",
            height: "100vh",
            py: 3, pb: 20
        }}>
        <Typography variant="h4">Select a branch</Typography>
        <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="section-label">Branch</InputLabel>
            <Select 
              labelId="section-label"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              label="Department"
            >
                {branches.map((branch) => (
                    <MenuItem key={branch.branchId} value={branch.branchId}>
                        {branch.branchTitle}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <RoomTable selectedBranch={selectedBranch}></RoomTable>
        </Container>
    );
};

export default LibrarianDashboard;