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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl, 
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Room } from "../../Types";
import { addRoom, deleteRoom, editRoom, getRooms } from "../../firebase/dbHandler";

interface RoomTableProps {
    selectedBranch: string;
}

const RoomTable: React.FC<RoomTableProps> = ({ selectedBranch }) => {
    const columns = [
        { id: "roomTitle", name: "Name" },
        { id: "roomId", name: "ID" },
        { id: "roomPax", name: "Capacity" },
        { id: "roomBranch", name: "Branch" },
        { id: "roomAvailable", name: "Available" },
        { id: "actions", name: "Actions" }, // Added for edit and remove buttons
    ];

    /******************************
    *  TABLE INIT
    ******************************/
    const [rows, setRows] = useState<Room[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState({ id: "", direction: "" });

    const [roomTitle, setRoomTitle] = useState("");
    const [roomId, setRoomId] = useState<number | string>("");
    const [roomPax, setRoomPax] = useState<number | string>("");
    const [roomBranch, setRoomBranch] = useState("");
    const [roomAvailable, setRoomAvailable] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState(0);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    /* --- TABLE HANDLERS --- */
    useEffect(() => {
        fetchData();
    }, [selectedBranch]);

    const fetchData = async () => {
        if (selectedBranch) {
            const roomData = await getRooms(selectedBranch);
            const roomProps: Room[] = [];

            roomData.forEach((room) => {
                const branchProp = {
                    roomId: room.roomId,
                    roomTitle: room.roomTitle,
                    roomPax: room.roomPax,
                    roomAvailable: room.roomAvailable,
                    roomBranch: room.roomBranch
                };

                // *** VERIFICATION
                console.log(room);
                roomProps.push(branchProp);
            });

            setRows(roomProps);
        }
    };

    const handleSearchChange = (event: {
        target: { value: React.SetStateAction<string> };
    }) => {
        setSearchQuery(event.target.value);
    };

    const handleChangePage = (
        event: any,
        newPage: React.SetStateAction<number>
    ) => {
        setPage(newPage);
    };

    const handleRowsPerPage = (event: { target: { value: string } }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (columnId: string) => {
        const isAsc = (sortOrder.id === columnId) && (sortOrder.direction === "asc");
        setSortOrder({ id: columnId, direction: isAsc ? "desc" : "asc" });
    };

    const sortedRows = rows.slice().sort((a, b) => {
        const aValue = a[sortOrder.id as keyof typeof a];
        const bValue = b[sortOrder.id as keyof typeof b];
        const multiplier = sortOrder.direction === "asc" ? 1 : -1;

        if (aValue < bValue) return -1 * multiplier;
        if (aValue > bValue) return 1 * multiplier;
        
        return 0;
    });

    const renderAvailable = (value: boolean) => {
        return (
            value 
            ? <span>True</span> 
            : <span>False</span>
        );
    };

    /* --- EDIT FUNCTIONALITIES --- */
    const handleEdit = (index: number) => {
        // *** VERIFIFCATION
        console.log("Edit row:", rows.at(index)?.roomId);

        setRoomToEdit(rows.at(index)?.roomId as number);
        
        setRoomTitle(rows.at(index)?.roomTitle as string);
        setRoomId(rows.at(index)?.roomId as number);
        setRoomBranch(rows.at(index)?.roomBranch as string);
        setRoomPax(rows.at(index)?.roomPax as number);
        setRoomAvailable(rows.at(index)?.roomAvailable as boolean);

        setOpenEditDialog(true);
    };

    const handleConfirmEdit = () => {
        const newRoom: Room = {
            roomId: +roomId,
            roomTitle: roomTitle,
            roomPax: +roomPax,
            roomAvailable: roomAvailable,
            roomBranch: roomBranch
        };

        editRoom(selectedBranch, roomToEdit, newRoom);
        setOpenEditDialog(false);
        resetAddDialog();
        fetchData();
    }

    const handleCancelEdit = () => {
        setOpenEditDialog(false);
        resetAddDialog();
    };

    // HANDLE REMOVE
    const handleRemove = (index: number) => {
        // *** VERIFICATION
        console.log("Remove row:", rows.at(index)?.roomId);

        deleteRoom(selectedBranch, rows.at(index)?.roomId as number);
        fetchData();
    };

    // HANDLE ADD
    function resetAddDialog() {
        setRoomId("");
        setRoomTitle("");
        setRoomBranch("");
        setRoomPax("");
        setRoomAvailable(false);
    }

    const handleAddBranch = () => {
        setOpenAddDialog(true);
    };

    const handleConfirmAdd = () => {
        const newRoom: Room = {
            roomId: +roomId,
            roomTitle: roomTitle,
            roomPax: +roomPax,
            roomAvailable: roomAvailable,
            roomBranch: roomBranch
        };

        // *** VERIFICATION
        console.log(newRoom);

        addRoom(selectedBranch, newRoom);
        setOpenAddDialog(false);
        resetAddDialog();
        fetchData();
    };

    const handleCancelAdd = () => {
        setOpenAddDialog(false);
        resetAddDialog();
    };

    const filteredRows = sortedRows.filter((row) =>
        Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3 style={{ marginBottom: "20px" }}>Room Management</h3>
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
                style={{ width: "85%" }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddBranch}
                sx={{
                    textTransform: "none",
                    "@media (max-width: 600px)": {
                        margin: "0px 0",
                    },
                }}
                disabled={!selectedBranch}
            >
            Add Room
            </Button>
        </div>

        <Paper sx={{ width: "90%", marginLeft: "5%", marginBottom: "60px" }}>
            <TableContainer
                sx={{ maxHeight: "calc(150vh - 350px)", overflow: "hidden" }}
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
                                <TableCell key={column.id} style={{ height: "52px" }}>
                                    {column.id !== "actions" ? (
                                        column.id === "roomAvailable" ? (
                                            renderAvailable(!!row[column.id as keyof typeof row])
                                        ) : (
                                            row[column.id as keyof typeof row]
                                        )
                                    ) : (
                                        <div>
                                            <IconButton
                                                onClick={() => handleEdit(index)}
                                                aria-label="edit"
                                            >
                                            <EditIcon style={{ fontSize: 18 }} />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleRemove(index)}
                                                aria-label="delete"
                                            >
                                            <DeleteIcon style={{ fontSize: 18 }} />
                                            </IconButton>
                                        </div>
                                    )}
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
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleRowsPerPage}
            />
        </Paper>

        {/* ADD DIALOG ------------------------------------------------------------------------- */}
        <Dialog open={openAddDialog} onClose={handleCancelAdd} maxWidth="lg">
            <DialogTitle>Add Room</DialogTitle>
            <DialogContent style={{ width: "500px", height: "275px" }}>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Id"
                    type="number"
                    inputProps={{ min: 1, max: 20 }}
                    variant="outlined"
                    value={roomId}
                    onChange={(e) => setRoomId(+e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Pax Capacity"
                    type="number"
                    inputProps={{ min: 1, max: 12 }}
                    variant="outlined"
                    value={roomPax}
                    onChange={(e) => setRoomPax(+e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel id="section-label">Available</InputLabel>
                        <Select
                        labelId="section-label"
                        value={roomAvailable}
                        onChange={(e) => setRoomAvailable(!!e.target.value)}
                        label="Available"
                        >
                            <MenuItem value={"false"}>
                                False
                            </MenuItem>
                            <MenuItem value={"true"}>
                                True
                            </MenuItem>
                        </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCancelAdd}>Cancel</Button>
            <Button onClick={handleConfirmAdd} color="primary">
                Confirm
            </Button>
            </DialogActions>
        </Dialog>

        {/* EDIT DIALOG -------------------------------------------------------------------------*/}
        <Dialog open={openEditDialog} onClose={handleCancelEdit} maxWidth="lg">
            <DialogTitle>Edit Room</DialogTitle>
            <DialogContent style={{ width: "500px", height: "340px" }}>
                <TextField
                    label="Room to Edit"
                    variant="outlined"
                    value={roomToEdit}
                    contentEditable="false"
                    fullWidth
                    margin="normal"
                    suppressContentEditableWarning={true}
                />
                <TextField
                    label="New Name"
                    variant="outlined"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="New Id"
                    type="number"
                    inputProps={{ min: 1, max: 20 }}
                    variant="outlined"
                    value={roomId}
                    onChange={(e) => setRoomId(+e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="New Branch Id"
                    variant="outlined"
                    value={roomBranch}
                    onChange={(e) => setRoomBranch(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="New Pax Capacity"
                    type="number"
                    inputProps={{ min: 1, max: 12 }}
                    variant="outlined"
                    value={roomPax}
                    onChange={(e) => setRoomPax(+e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel id="section-label">Available</InputLabel>
                        <Select
                        labelId="section-label"
                        value={roomAvailable}
                        onChange={(e) => setRoomAvailable(!!e.target.value)}
                        label="Available"
                        >
                            <MenuItem value={"false"}>
                                False
                            </MenuItem>
                            <MenuItem value={"true"}>
                                True
                            </MenuItem>
                        </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelEdit}>Cancel</Button>
                <Button onClick={handleConfirmEdit} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
};

export default RoomTable;
