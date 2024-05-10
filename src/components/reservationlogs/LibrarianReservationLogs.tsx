import React, { useContext, useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
import { AuthContext } from "../../utils/AuthContext";
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
	const authContext = useContext(AuthContext);
	const [loading, setLoading] = useState<boolean>(true);

	const [rows, setRows] = useState<LogsFormat[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [sortOrder, setSortOrder] = useState({ id: "", direction: "" });
	const [resLogs, setLogs] = useState<ReservationEvent[]>([])

	const [open, setOpen] = React.useState(false);
	const [timeGranularity, setTimeGranularity] = useState<string>("Daily")

	const [formState, setFormState] = useState({
		timeGranularity: "Daily"
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
	function formatDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}/${month}/${day}`;
	}
	const downloadLogs = (formJson: any) => {
		let branches = [...new Set(resLogs.map(item => item.branchId))];
		var startDate = new Date();
		var endDate = new Date();
		const workbook = utils.book_new();
		branches.forEach(branch => {

			const logs: ReservationEvent[] = resLogs.filter((log) => { return log.branchId === branch })
			const logHeaders = [[
				"Reservation ID",
				"Student Representative",
				"College",
				"Room ID",
				"Date",
				"Timeslot Start",
				"Timeslot End",
				"Duration",
				"Reservation State",
				"Pax",
				"Participant Emails"
			]]


			var logaoa: any[][] = []
			logs.forEach(log => {
				logaoa.push([
					log.event_id,
					log.stuRep,
					log.stuRep.split('.')[2].split('@')[0].toUpperCase(),
					log.room_id,
					log.date,
					log.start,
					log.end,
					log.duration,
					log.title,
					log.pax,
					log.stuEmails.join(" ")
				])
			})

			if (formJson['timeGranularity'] == 'Daily') {
				startDate = new Date(formJson['day'])
				endDate = new Date(formJson['day'])

			} else if (formJson['timeGranularity'] == 'Weekly') {
				startDate = new Date(formJson['weekStart'])
				endDate = new Date(formJson['weekStart'])
				endDate.setDate(endDate.getDate() + 7)

			} else if (formJson['timeGranularity'] == 'Monthly') {
				const monthNames = ["January", "February", "March", "April", "May", "June",
					"July", "August", "September", "October", "November", "December"
				];
				const month = monthNames.indexOf(formJson['month'].split(" ")[0])
				const year = formJson['month'].split(" ")[1]
				startDate = new Date(year as number, month, 1);
				endDate = new Date(year as number, month + 1, 0)

			} else if (formJson['timeGranularity'] == 'Yearly') {
				startDate = new Date(formJson['year'] as number, 0, 1);
				endDate = new Date(formJson['year'] as number, 11, 31)

			} else if (formJson['timeGranularity'] == 'Custom') {
				startDate = new Date(formJson['customStart'])
				endDate = new Date(formJson['customEnd'])

			} else {
				logaoa.sort((a, b) => {
					if (a[5] < b[5]) {
						return -1
					}
					if (a[5] > b[5]) {
						return 1
					}
					return 0
				})
				startDate = logaoa[0][5]
				endDate = logaoa[logaoa.length - 1][5]
			}

			endDate.setHours(23, 59, 59)
			logaoa = logaoa.filter((log) => log[5] >= startDate && log[5] <= endDate)

			console.log(startDate)
			console.log(endDate)

			const logCredInf = [["Logs Generated By: ", authContext?.user?.displayName],
			["Logs Generated On: ", new Date()],
			["Logs Generated Between", formatDate(startDate) + " - " + formatDate(endDate)]]
			const worksheet = utils.aoa_to_sheet(logCredInf, { dateNF: "m/d/yy h:mm", cellDates: true })
			utils.sheet_add_aoa(worksheet, logHeaders, { origin: "A5", dateNF: "m/d/yy h:mm", cellDates: true })
			utils.sheet_add_aoa(worksheet, logaoa, { origin: "A6", dateNF: "m/d/yy h:mm", cellDates: true })
			utils.book_append_sheet(workbook, worksheet, branch)
		})

		writeFileXLSX(workbook, "Reservation Logs.xlsx", { compression: true })
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
					onClick={handleClickOpen}
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

			<Dialog
				open={open}
				onClose={handleClose}
				PaperProps={{
					component: 'form',
					onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
						event.preventDefault();
						const formData = new FormData(event.currentTarget);
						const formJson = Object.fromEntries((formData as any).entries());
						downloadLogs(formJson)
						handleClose();
					},
				}}
			>
				<DialogTitle>Download Logs</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Choose a date range to generate the reservation logs.
					</DialogContentText>
					<Select
						name="timeGranularity"
						value={timeGranularity}
						label="Time Granularity"
						onChange={handleTimeGranularityChange}
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
						/>
						: formState.timeGranularity == "Weekly" ?
							<DatePicker
								name="weekStart"
								label={"Week Start"}
							/>
							: formState.timeGranularity == "Monthly" ?
								<DatePicker
									name="month"
									label={'Month'}
									views={['month', 'year']}
								/>
								: formState.timeGranularity == "Annually" ?
									<DatePicker
										name="year"
										label={"Year"}
										views={['year']}
										openTo="year"
									/>
									: formState.timeGranularity == "Custom" ?
										<>
											<DatePicker
												name="customStart"
												label="Start"
												value={customStart}
												onChange={(newValue) => setCustomStart(newValue)}
											/>
											<DatePicker
												name="customEnd"
												label="End"
												minDate={customStart}
												value={customEnd}
												onChange={(newValue) => setCustomEnd(newValue)}
											/>
										</>

										:

										null
					}

				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button type="submit">Download Logs</Button>
				</DialogActions>
			</Dialog>

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