import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Branch, Room, ReservationEvent } from "../../Types";
import { getAllReservationEvents, getAllRooms, getBranches, getRooms } from "../../firebase/dbHandler";
import Loading from "./Loading";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { Gauge, PieChart, pieArcLabelClasses } from "@mui/x-charts";
import { BarChart } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";

export interface PieChartData {
    id: number,
    value: number,
    label: string
}

export interface PieChartGeneratorProps {
    PieChartLabel: string,
    PieChartData: PieChartData[]
}

export interface GaugeGeneratorProps {
    GaugeLabel: string,
    GaugeData: number
}

function Analytics() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [rooms, setRooms] = useState<Room[]>([])
    const [resEvents, setResEvents] = useState<ProcessedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [timeGranularity, setTimeGranularity] = useState<string>("All")
    const [startDate, setStartDate] = useState<Date>(new Date())
    const [endDate, setEndDate] = useState<Date>(new Date())
    const [filteredResEvents, setFilteredResEvents] = useState<ProcessedEvent[]>([]);

    const [formState, setFormState] = useState({
        timeGranularity: "All"
    });

    const [customStart, setCustomStart] = useState(new Date());
    const [customEnd, setCustomEnd] = useState(new Date());
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleTimeGranularityChange = (event: SelectChangeEvent) => {
        setTimeGranularity(event.target.value as string)
        setFormState((prev) => { return { ...prev, ["timeGranularity"]: event.target.value }; });
    }

    // ----- CHART DATAs -----
    useEffect(() => {
        const fetchData = async () => {
            try {
                const branchesData = await getBranches().then();
                const resEventsData = await getAllReservationEvents();
                const allRooms = await getAllRooms()
                resEventsData.sort((a, b) => {
                    if (a.start < b.start) {
                        return -1
                    }
                    if (a.start > b.start) {
                        return 1
                    }
                    return 0});
                
                setStartDate(resEventsData[0].start)
                setEndDate(resEventsData[resEventsData.length-1].start)
                setBranches(branchesData);
                setResEvents(resEventsData);
                setFilteredResEvents(resEventsData)
                setRooms(allRooms)
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

    const getResPerBranchData = (): PieChartData[] => {
        const branchCountMap: Record<string, number> = {};

        filteredResEvents.forEach((event) => {
            const branchId: string = event.branchId;
            if (branchCountMap[branchId]) {
                branchCountMap[branchId]++;
            } else {
                branchCountMap[branchId] = 1;
            }
        });

        const resPerBranch: PieChartData[] = [];
        let i = 0
        branches.forEach((branch) => {
            const resPerBranchData = {
                id: i++,
                value: branchCountMap[branch.branchId],
                label: branch.branchTitle,
            }
            resPerBranch.push(resPerBranchData);
        });
        return resPerBranch;
    }

    const getResPerCollege = (): PieChartData[] => {
        const collegeCountMap: Record<string, number> = {};

        filteredResEvents.forEach((event) => {
            const college: string = event.stuRep.split('.')[2].split('@')[0].toUpperCase();
            if (collegeCountMap[college]) {
                collegeCountMap[college]++;
            } else {
                collegeCountMap[college] = 1;
            }
        });

        const resPerBranch: PieChartData[] = [];
        let i = 0
        for (let college in collegeCountMap) {
            const resPerBranchData = {
                id: i++,
                value: collegeCountMap[college],
                label: college,
            }
            resPerBranch.push(resPerBranchData);
        }
        return resPerBranch;
    }

    const PieChartGenerator = ({ PieChartLabel, PieChartData }: PieChartGeneratorProps): JSX.Element => {
        return (
            <Container>
                <Typography variant="h3" sx={{ fontSize: "25px" }}>
                    {PieChartLabel}
                </Typography>
                <PieChart
                    series={[
                        {
                            arcLabel: (item) => `${item.value}`,
                            arcLabelMinAngle: 10,
                            data: PieChartData
                        },
                    ]}
                    width={800}
                    height={300}
                    sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                            fill: 'white',
                            fontWeight: 'bold',
                            fontSize: "20px"
                        }
                    }}
                />
            </Container>
        );
    }

    const GaugeGenerator = ({ GaugeLabel, GaugeData }: GaugeGeneratorProps): JSX.Element => {
        return (
            <Container>
                <Gauge width={100} height={100} value={GaugeData} />
                <Typography>
                    {GaugeLabel}
                </Typography>
            </Container>

        );
    }

    function getRoomUsage(room: Room, branchId: string): number {
        const roomReservations: ProcessedEvent[] = filteredResEvents.filter(event =>
            event.room_id == room.roomId
            && event.branchId == branchId
            && event.title == "Departed"
        )
        var hours: number = 0
        roomReservations.forEach(resEvent => {
            hours += Math.abs(resEvent.start.getTime() - resEvent.end.getTime()) / 3600000
        })
        const percentage: number = hours / (10 * Math.ceil(Math.abs(startDate.getTime() - endDate.getTime()) / 86400000))
        console.log(percentage)
        return (Number.isNaN(percentage) || percentage > 100) ? 0 : percentage * 100
    }


    function formatDate(d: date) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return `${year}/${month}/${day}`;
    }

    return (
        <>
            <Container sx={{ marginTop: "40px" }}>
                <Typography variant="h1" sx={{ marginBottom: "10px", fontSize: "40px", fontWeight: "Bold" }}>
                    Analytics and Reports
                </Typography>
                <Container>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                        sx={{
                            marginTop: "20px",
                            marginBottom: "20px",
                            textTransform: "none",
                            "@media (max-width: 600px)": {
                                margin: "0px 0",
                            },
                        }}
                    >
                        Change Date Range
                    </Button>
                </Container>
                <Typography variant="h2" sx={{ fontSize: "20px" }}>
                    Date Start: <strong>{formatDate(startDate)}</strong>
                </Typography>
                <Typography variant="h2" sx={{ fontSize: "20px" }}>
                    Date End: <strong>{formatDate(endDate)}</strong>
                </Typography>
                <Typography variant="h2" sx={{ fontSize: "30px" }}>
                    Total number of reservations: <strong>{filteredResEvents.length}</strong>
                </Typography>
            </Container>

            <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>
                <PieChartGenerator PieChartLabel={"Reservations per branch"} PieChartData={getResPerBranchData()} />
            </Container>

            <Container sx={{ marginTop: "40px" }} >
                <Typography variant="h3" sx={{ fontSize: "25px" }}>
                    Room Analytics
                </Typography>
                {branches.map(branch =>
                    <Container>
                        <Typography variant="h3" sx={{ fontSize: "25px" }}>
                            {branch.branchTitle}
                        </Typography>
                        <Stack direction={"row"}>
                            {rooms?.filter(room => room.roomBranch == branch.branchId).sort((a, b) => { if (a.roomId < b.roomId) { return -1 } else { return 1 } }).map(room => <GaugeGenerator GaugeLabel={"Room" + room.roomId} GaugeData={getRoomUsage(room, branch.branchId)} />)}
                        </Stack>
                    </Container>)}
            </Container>

            <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>
                <PieChartGenerator PieChartLabel={"Utilization Per College"} PieChartData={getResPerCollege()} />
            </Container>


            <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>

            </Container>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        console.log(formJson)
                        var start = new Date()
                        var end = new Date()

                        if (formJson['timeGranularity'] == 'Daily') {
                            start = new Date(formJson['day'])
                            end = new Date(formJson['day'])

                        } else if (formJson['timeGranularity'] == 'Weekly') {
                            start = new Date(formJson['weekStart'])
                            end = new Date(formJson['weekStart'])
                            end.setDate(end.getDate() + 7)

                        } else if (formJson['timeGranularity'] == 'Monthly') {
                            const monthNames = ["January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"
                            ];
                            const month = monthNames.indexOf(formJson['month'].split(" ")[0])
                            const year = formJson['month'].split(" ")[1]
                            start = new Date(year as number, month, 1);
                            end = new Date(year as number, month + 1, 0)

                        } else if (formJson['timeGranularity'] == 'Annually') {
                            start = new Date(formJson['year'] as number, 0, 1);
                            end = new Date(formJson['year'] as number, 11, 31)

                        } else if (formJson['timeGranularity'] == 'Custom') {
                            start = new Date(formJson['customStart'])
                            end = new Date(formJson['customEnd'])

                        } else {
                            resEvents.sort((a, b) => {
                                if (a.start < b.start) {
                                    return -1
                                }
                                if (a.start > b.start) {
                                    return 1
                                }
                                return 0
                            })
                            start = (resEvents[0].start)
                            end = (resEvents[resEvents.length - 1].start)

                        }
                        end.setHours(23, 59, 59)
                        console.log(start)
                        console.log(end)

                        const events = resEvents.filter((log) => log.start >= start && log.start <= end)
                        setFilteredResEvents(events)
                        console.log(events)
                        setStartDate(start)
                        setEndDate(end)
                        console.log(rooms)
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Change Date Range</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose a date range to view the Analytics.
                    </DialogContentText>
                    <div style={{ marginBottom: '16px' }}></div>
                    <Select
                        name="timeGranularity"
                        value={timeGranularity}
                        label="Time Granularity"
                        onChange={handleTimeGranularityChange}
                        style={{ minWidth: '130px', marginRight: '10px' }}
                    >
                        <MenuItem value={"Daily"}>Daily</MenuItem>
                        <MenuItem value={"Weekly"}>Weekly</MenuItem>
                        <MenuItem value={"Monthly"}>Monthly</MenuItem>
                        <MenuItem value={"Annually"}>Annually</MenuItem>
                        <MenuItem value={"Custom"}>Custom</MenuItem>
                        <MenuItem value={"All"}>All</MenuItem>
                    </Select>
                    {formState.timeGranularity == "Daily" ?
                        <DatePicker
                            name="day"
                            label={"Day"}
                            defaultValue={new Date()}
                        />
                        : formState.timeGranularity == "Weekly" ?
                            <DatePicker
                                name="weekStart"
                                label={"Week Start"}
                                defaultValue={new Date()}
                            />
                            : formState.timeGranularity == "Monthly" ?
                                <DatePicker
                                    name="month"
                                    label={'Month'}
                                    views={['month', 'year']}
                                    defaultValue={new Date()}
                                />
                                : formState.timeGranularity == "Annually" ?
                                    <DatePicker
                                        name="year"
                                        label={"Year"}
                                        views={['year']}
                                        openTo="year"
                                        defaultValue={new Date()}
                                    />
                                    : formState.timeGranularity == "Custom" ?
                                        <>
                                            <div style={{ display: 'flex', marginTop: '16px' }}>
                                                <DatePicker
                                                    name="customStart"
                                                    label="Start"
                                                    value={customStart}
                                                    defaultValue={new Date()}
                                                    onChange={(newValue) => setCustomStart(newValue)}
                                                />
                                                <div style={{ marginRight: '10px' }}></div>
                                                <DatePicker
                                                    name="customEnd"
                                                    label="End"
                                                    minDate={customStart}
                                                    value={customEnd}
                                                    defaultValue={new Date()}   
                                                    onChange={(newValue) => setCustomEnd(newValue)}
                                                />
                                            </div>
                                        </>

                                        :

                                        null
                    }

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Change Date Range</Button>
                </DialogActions>
            </Dialog>
        </>

    )
}

export default Analytics;