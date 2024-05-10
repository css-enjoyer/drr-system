import { Container, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Branch, ReservationEvent } from "../../Types";
import { getAllReservationEvents, getBranches } from "../../firebase/dbHandler";
import Loading from "./Loading";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { PieChart } from "@mui/x-charts";

function Analytics() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [resEvents, setResEvents] = useState<ProcessedEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const branchesData = await getBranches();
                const resEventsData = await getAllReservationEvents();
                setBranches(branchesData);
                setResEvents(resEventsData);
            } catch (error) {
                console.error('Error fetching branches:', error);
                console.error('Error fetching reservation events:', error);
            }
            setLoading(false);
        };
        fetchData()
    }, []);

    if (loading) {
        return <Loading></Loading>
    }

    console.log(resEvents);

    // console.log("========== BRANCH MAP");
    const branchCountMap: Record<string, number> = {};

    resEvents.forEach((event) => {
        const branchId: string = event.branchId;
        if (branchCountMap[branchId]) {
            branchCountMap[branchId]++;
        } else {
            branchCountMap[branchId] = 1;
        }
    });
    // console.log(branchCountMap);

    const resPerBranch = [{}];
    branches.forEach((branch) => {
        let i = 0;
        const resPerBranchData = {
            id: i,
            value: branchCountMap[branch.branchId],
            label: branch.branchTitle,
        } 
        resPerBranch.push(resPerBranchData);
        i++;
    });
    console.log("========== RES PER BRANCH")
    console.log(resPerBranch);


    return (
        <>
            <Container sx={{ marginTop: "60px" }}>
                <Typography variant="h1" sx={{ fontSize: "40px", fontWeight: "Bold" }}>
                    Analytics and Reports
                </Typography>
                <Typography sx={{ fontSize: "30px" }}>
                    Total number of reservations: {resEvents.length}
                </Typography>
            </Container>

            <Container>
                <Typography variant="h2" sx={{ marginTop: "20px", fontSize: "25px" }}>
                    Reservation per branch
                </Typography>
                <PieChart
                    series={[
                        {
                            data: [
                                { id: 0, value: 10, label: 'series A' },
                                { id: 1, value: 15, label: 'series B' },
                                { id: 2, value: 20, label: 'series C' },
                            ],
                            // data: resPerBranch,
                        },
                    ]}
                    width={400}
                    height={200}
                />
            </Container>
        </>
    )
}

export default Analytics;