import React, { useEffect, useState } from "react";
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	TablePagination,
	IconButton,
	Button,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Timestamp, collection, onSnapshot, query } from "firebase/firestore";
import { ReservationEvent } from "../../Types";
import { db } from "../../firebase/config";
import Loading from "../miscellaneous/Loading";
import { format } from "date-fns";
import { writeFileXLSX, utils, WorkSheet } from "xlsx"
interface LogsFormat {
	branch: string;
	date: string;
	time: string;
	room: string;
	representative: string;
	pax: number;
	participantEmails: string,
	purpose: string;
}

function LibrarianReservationLogs() {
	const [loading, setLoading] = useState<boolean>(true);

	const [rows, setRows] = useState<LogsFormat[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [sortOrder, setSortOrder] = useState({ id: "", direction: "" });
	const [resLogs, setLogs] = useState<ReservationEvent[]>([])

	useEffect(() => {
		// ----- FIRESTORE REALTIME UPDATES -----
		// setLoading(true);
		const q = query(collection(db, "reservation-event-logs"));
		const unsub = onSnapshot(q, querySnapshot => {
			const resEvents: ReservationEvent[] = [];
			querySnapshot.forEach((doc) => {
				const resEventData = doc.data();
				const resEvent = {
					...resEventData,
					start: (resEventData.start as Timestamp).toDate(),
					end: (resEventData.end as Timestamp).toDate(),
					date: (resEventData.date as Timestamp).toDate(),
				};
				resEvents.push(resEvent);
			});

			setLogs(resEvents)

			const formattedLogs: LogsFormat[] = resEvents.map((e) => ({
				branch: e.branchId,
				date: e.date.toLocaleString(),
				time: `${e.start.toLocaleString()} - ${e.end.toLocaleString().split(',')[1]}`,
				room: e.room_id.toString(),
				representative: e.stuRep,
				pax: e.pax,
				participantEmails: e.stuEmails.join(',\n'),
				purpose: e.purp
			}));
			console.log(formattedLogs[0].participantEmails)
			setRows(formattedLogs);

			// setLoading(false);
		})
		return () => unsub();
		// fetchReservationEvents();
	}, []);

	// if (loading) {
	// 	console.log("LOADING...");
	// 	<Loading></Loading>
	// }

	// console.log("LOADING DONE");

	const columns = [
		{ id: "branch", name: "Branch" },
		{ id: "date", name: "Date" },
		{ id: "time", name: "Timeslot" },
		{ id: "room", name: "Room" },
		{ id: "representative", name: "Representative" },
		{ id: "pax", name: "Pax" },
		{ id: "participantEmails", name: "Participant Emails" },
		{ id: "purpose", name: "Purpose" }
	];

	const handleSearchChange = (event: {
		target: { value: React.SetStateAction<string> };
	}) => {
		setSearchQuery(event.target.value);
	};

	const handlechangepage = (
		_event: any,
		newPage: React.SetStateAction<number>
	) => {
		setPage(newPage);
	};

	const handleRowsPerPage = (event: { target: { value: string } }) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleSort = (columnId: string) => {
		const isAsc = sortOrder.id === columnId && sortOrder.direction === "asc";
		setSortOrder({ id: columnId, direction: isAsc ? "desc" : "asc" });
	};

	const sortedRows = rows.slice().sort((a, b) => {
		const aValue = a[sortOrder.id as keyof typeof a];
		const bValue = b[sortOrder.id as keyof typeof b];
		if (sortOrder.id == "date") {
			const aValue = new Date(a[sortOrder.id as keyof typeof a] as string);
			const bValue = new Date(b[sortOrder.id as keyof typeof b] as string);
		} else if (sortOrder.id == "time") {
			const aValue = new Date((a[sortOrder.id as keyof typeof a] as string).split('-')[0].trim());
			const bValue = new Date((b[sortOrder.id as keyof typeof b] as string).split('-')[0].trim());
		}

		const multiplier = sortOrder.direction === "asc" ? 1 : -1;

		if (aValue < bValue) return -1 * multiplier;
		if (aValue > bValue) return 1 * multiplier;

		return 0;
	});

	const filteredRows = sortedRows.filter((row) =>
		Object.values(row).some((value) =>
			value.toString().toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	const downloadLogs = () => {
		let branches = [...new Set(resLogs.map(item => item.branchId))];

		const workbook = utils.book_new();
		branches.forEach(branch => {
			const logs: ReservationEvent[] = resLogs.filter((log) => {return log.branchId === branch}) 
			const worksheet = utils.json_to_sheet(logs)
			utils.book_append_sheet(workbook, worksheet, branch)
		})
		
		writeFileXLSX(workbook,	"Reservation Logs.xlsx", {compression: true})
	}

	return (
		<div style={{ textAlign: "center", marginTop: "40px" }}>
			<h3 style={{ marginBottom: "20px" }}>Librarian Reservation Logs</h3>
			<div
				style={{
					marginBottom: "20px",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					width: "90%",
					marginLeft: "5%",
				}}
			>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ flex: 1, marginRight: "20px" }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={downloadLogs}
                    sx={{
                        textTransform: "none",
                        "@media (max-width: 600px)": {
                            margin: "0px 0",
                        },
                    }}
                >
                    Download Logs
                </Button>
			</div>

			<Paper sx={{ width: "90%", marginLeft: "5%", marginBottom: "60px" }}>
				<TableContainer
					sx={{ maxHeight: "calc(150vh - 350px)", overflowX: "auto", overflowY: "auto" }}
				>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										style={{
											backgroundColor: "gray",
											color: "white",
											cursor: "pointer",
										}}
										key={column.id}
										onClick={() => handleSort(column.id)}
									>
										{column.name}
										{sortOrder.id === column.id && (
											<>
												{sortOrder.direction === "asc" ? (
													<IconButton size="small">
														<ArrowUpward fontSize="small" />
													</IconButton>
												) : (
													<IconButton size="small">
														<ArrowDownward fontSize="small" />
													</IconButton>
												)}
											</>
										)}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredRows
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => (
									<TableRow key={index}>
										{columns.map((column) => (
											<TableCell key={column.id} align="left">
												{row[column.id as keyof typeof row]}
											</TableCell>
										))}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 20, 40]}
					rowsPerPage={rowsPerPage}
					page={page}
					count={filteredRows.length}
					component="div"
					onPageChange={handlechangepage}
					onRowsPerPageChange={handleRowsPerPage}
				/>
			</Paper>
		</div>
	);
}

export default LibrarianReservationLogs;