import React, { useEffect, useState } from "react";
import {
    Alert,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
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
    DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Branch, Librarian, LibrarianProp } from "../../Types";
import { addLibrarian, deleteLibrarian, editLibrarian, getBranches, getLibrarians } from "../../firebase/dbHandler";
import { Timestamp } from "firebase/firestore";

const LibrarianTable = () => {
    const columns = [
        { id: "date", name: "Date Added" },
        { id: "name", name: "Name" },
        { id: "department", name: "Department" },
        { id: "email", name: "Email" },
        { id: "actions", name: "Actions" },
    ];

    const [branches, setBranches] = useState<Branch[]>([]);
    
    const [rows, setRows] = useState<LibrarianProp[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState({ id: "", direction: "" });

    const [librarianName, setLibrarianName] = useState("");
    const [librarianEmail, setLibrarianEmail] = useState("");
    const [librarianDepartment, setLibrarianDepartment] = useState("");
    const [librarianEmailToEdit, setLibrarianEmailToEdit] = useState("");
    const [openAddDialog, setopenAddDialog] = useState(false);
    const [openEditDialog, setopenEditDialog] = useState(false);
    // Refresh table after action/s are done
    const [refreshTable, setRefreshTable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    /******************************
     *  TABLE INIT                 *
     ******************************/
    const fetchData = async () => {
        const LibrariansData = await getLibrarians();
        const librarianProps: LibrarianProp[] = []

        LibrariansData.forEach((librarian) => {
            const librarianProp = {
                date: librarian.dateAdded.toDate().toDateString(),
                name: librarian.librarianName,
                email: librarian.userEmail,
                department: librarian.librarianBranch
            }

            console.log(librarian);
            librarianProps.push(librarianProp);
        });

        setRows(librarianProps);
    }

    useEffect(() => {
        fetchData();
    }, [refreshTable]);

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

    const handleSearchChange = (event: {
        target: { value: React.SetStateAction<string> };
    }) => {
        setSearchQuery(event.target.value);
    };

    const handlechangepage = (
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
        const isAsc = sortOrder.id === columnId && sortOrder.direction === "asc";
        setSortOrder({ id: columnId, direction: isAsc ? "desc" : "asc" });
    };

    const sortedRows = rows.slice().sort((a, b) => {
        const aValue = a[sortOrder.id as keyof typeof a];
        const bValue = b[sortOrder.id as keyof typeof b];

        if (sortOrder.id == "date") {
            const aValue = new Date(a[sortOrder.id as keyof typeof a]);
            const bValue = new Date(b[sortOrder.id as keyof typeof b]);
        }

        const multiplier = sortOrder.direction === "asc" ? 1 : -1;

        if (aValue < bValue) return -1 * multiplier;
        if (aValue > bValue) return 1 * multiplier;

        return 0;
    });

    /******************************
     *  EDIT HANDLER               *
     ******************************/
    const handleEdit = (email: string) => {
        const rowToEdit = rows.find((row) => row.email === email);

        if (rowToEdit) {
            console.log("Edit row:", rowToEdit.email);

            setLibrarianEmailToEdit(rowToEdit.email);
            setLibrarianEmail(rowToEdit.email);
            setLibrarianName(rowToEdit.name);
            setLibrarianDepartment(rowToEdit.department)

            setopenEditDialog(true);
        }
    };

    const handleConfirmEdit = () => {
        const newLibrarian: Librarian = {
            dateAdded: Timestamp.now(),
            librarianName: librarianName,
            userEmail: librarianEmail,
            librarianBranch: librarianDepartment
        }

        editLibrarian(librarianEmailToEdit, newLibrarian)
        setopenEditDialog(false);
        resetAddDialog();

        // --- UPDATE: Does not always reflect in real time --- //
        setRefreshTable(!refreshTable);
    };

    const handleCancelEdit = () => {
        setopenEditDialog(false);
        resetAddDialog();
    };


    /******************************
     *  CRUD HANDLER
     ******************************/
    const handleRemove = (email: string) => {
        const rowToRemove = rows.find((row) => row.email === email);

        console.log("Remove row: ", rowToRemove);

        deleteLibrarian(rowToRemove?.email as string);
        setRefreshTable(!refreshTable);
    };

    const handleAddLibrarian = () => {
        setopenAddDialog(true);
    };

    function resetAddDialog() {
        setLibrarianEmail("");
        setLibrarianName("");
        setLibrarianDepartment("");
    }

    const handleConfirmAdd = () => {
        console.log(rows)
        if (rows.some(librarian => librarian.email === librarianEmail)) {
            setErrorMessage("Error! Librarian Already Exists");
            return
        }
        const newLibrarian: Librarian = {
            dateAdded: Timestamp.now(),
            librarianName: librarianName,
            userEmail: librarianEmail,
            librarianBranch: librarianDepartment
        }

        console.log(newLibrarian);

        addLibrarian(newLibrarian);
        setopenAddDialog(false);
        resetAddDialog();
        setRefreshTable(!refreshTable);
    };

    const handleCancelAdd = () => {
        setopenAddDialog(false);
        resetAddDialog();
    };

    const filteredRows = sortedRows.filter((row) =>
        Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    return (
        <div style={{ textAlign: "center", marginTop: "60px" }}>
            <h3 style={{ marginBottom: "20px" }}>Librarians</h3>
            <div
                style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "90%",
                marginLeft: "5%",
                }}>
                <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ flex: 1, marginRight: "20px" }} />
                <Button
                variant="contained"
                color="primary"
                onClick={handleAddLibrarian}
                sx={{
                    textTransform: "none",
                    "@media (max-width: 600px)": {
                    margin: "0px 0",
                    },
                }}>
                Add Librarian
                </Button>
            </div>

            <Paper sx={{ width: "90%", marginLeft: "5%", marginBottom: "60px" }}>
                <TableContainer
                sx={{ maxHeight: "calc(150vh - 350px)", overflowX: "auto", overflowY: "auto" }}>
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
                            onClick={() => handleSort(column.id)}>
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
                        .map((row) => (
                        <TableRow key={row.email}>
                            {columns.map((column) => (
                            <TableCell key={`${row.email}-${column.id}`} style={{ height: "52px" }}>
                                {column.id !== "actions" ? (
                                row[column.id as keyof LibrarianProp]
                                ) : (
                                <div>
                                    <IconButton
                                    onClick={() => handleEdit(row.email)}
                                    aria-label="edit"
                                    >
                                    <EditIcon style={{ fontSize: 18 }} />
                                    </IconButton>
                                    <IconButton
                                    onClick={() => handleRemove(row.email)}
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
                onPageChange={handlechangepage}
                onRowsPerPageChange={handleRowsPerPage} />
            </Paper>
            {/* ADD DIALOG -------------------------------------------------------------------------*/}
            <Dialog open={openAddDialog} onClose={handleCancelAdd} maxWidth="lg">
                <DialogTitle>Add Librarian</DialogTitle>
                <DialogContent style={{ width: "500px", height: "275px" }}>
                { errorMessage 
                    ? <Alert severity="error">
                        {errorMessage}
                      </Alert>
                    : <></>
                }
                <TextField
                    label="Name"
                    variant="outlined"
                    value={librarianName}
                    onChange={(e) => setLibrarianName(e.target.value)}
                    fullWidth
                    margin="normal" />
                <TextField
                    label="Email"
                    variant="outlined"
                    value={librarianEmail}
                    onChange={(e) => setLibrarianEmail(e.target.value)}
                    fullWidth
                    margin="normal" />
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel id="section-label">Department</InputLabel>
                    <Select
                        labelId="section-label"
                        value={librarianDepartment}
                        onChange={(e) => setLibrarianDepartment(e.target.value)}
                        label="Department">
                        {/* <MenuItem value={"gen-ref"}>
                            Miguel de Benavides Library - General References
                        </MenuItem>
                        <MenuItem value={"sci-tech"}>
                            Miguel de Benavides Library - Science and Technology
                        </MenuItem>
                        <MenuItem value={"shs"}>
                            Blessed Pier Giorgio Frassati - Senior High-School
                        </MenuItem> */}
                        {branches.map((branch) => (
                            <MenuItem 
                                key={branch.branchId} value={branch.branchId}>
                                {branch.branchTitle}
                            </MenuItem>
                        ))}
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
                <DialogTitle>Edit Librarian</DialogTitle>
                <DialogContent style={{ width: "500px", height: "340px" }}>
                <TextField
                    label="Librarian to Edit"
                    variant="outlined"
                    value={librarianEmailToEdit}
                    contentEditable="false"
                    fullWidth
                    margin="normal"
                    suppressContentEditableWarning={true}
                />
                <TextField
                    label="New Name"
                    variant="outlined"
                    value={librarianName}
                    onChange={(e) => setLibrarianName(e.target.value)}
                    fullWidth
                    margin="normal" />
                <TextField
                    label="New Email"
                    variant="outlined"
                    value={librarianEmail}
                    onChange={(e) => setLibrarianEmail(e.target.value)}
                    fullWidth
                    margin="normal" />
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel id="section-label">New Department</InputLabel>
                    <Select
                        labelId="section-label"
                        value={librarianDepartment}
                        onChange={(e) => setLibrarianDepartment(e.target.value)}
                        label="Department">
                        {/* <MenuItem value={"gen-ref"}>
                            Miguel de Benavides Library - General References
                        </MenuItem>
                        <MenuItem value={"sci-tech"}>
                            Miguel de Benavides Library - Science and Technology
                        </MenuItem>
                        <MenuItem value={"shs"}>
                            Blessed Pier Giorgio Frassati - Senior High-School
                        </MenuItem> */}
                        {branches.map((branch) => (
                            <MenuItem 
                                key={branch.branchId} value={branch.branchId}>
                                {branch.branchTitle}
                            </MenuItem>
                        ))}
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

export default LibrarianTable;