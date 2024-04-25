import React, { useEffect, useState } from "react";
import {
    Alert,
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
    DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { User } from "../../Types";
import { addAdmin, deleteAdmin, editAdmin, getAdmins } from "../../firebase/dbHandler";

const AdminTable = () => {
    const columns = [
        { id: "userEmail", name: "Email" },
        { id: "actions", name: "Actions" },
    ];
    
    /* --- TABLE DECLARATIONS --- */
    const [rows, setRows] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState({ id: "", direction: "" });

    /* --- TABLE CONTENT DECLARATIONS --- */
    const [adminEmail, setAdminEmail] = useState("");
    const [adminEmailToEdit, setAdminEmailToEdit] = useState("");

    /* --- DIALOG DECLARATIONS --- */
    const [openAddDialog, setopenAddDialog] = useState(false);
    const [openEditDialog, setopenEditDialog] = useState(false);

    // Refresh table after action/s are done
    const [refreshTable, setRefreshTable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    /******************************
     *  TABLE INIT                 *
     ******************************/
    const fetchData = async () => {
        const adminsData = await getAdmins();
        const adminProps: User[] = [];

        adminsData.forEach((admin) => {
            const adminProp = {
                userEmail: admin.userEmail
            };

            console.log(admin);
            adminProps.push(adminProp);
        });
        setRows(adminProps);
    }

    useEffect(() => {
        fetchData();
    }, [refreshTable]);

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
        const rowToEdit = rows.find((row) => row.userEmail === email);

        if (rowToEdit) {
            console.log("Edit row:", rowToEdit.userEmail);
            setAdminEmailToEdit(rowToEdit.userEmail);
            setAdminEmail(rowToEdit.userEmail);

            setopenEditDialog(true);
        }
    };

    const handleConfirmEdit = () => {
        const newAdmin: User = {
            userEmail: adminEmail
        };

        editAdmin(adminEmailToEdit, newAdmin);
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
        const rowToRemove = rows.find((row) => row.userEmail === email);

        console.log("Remove row: ", rowToRemove);

        deleteAdmin(rowToRemove?.userEmail as string);
        setRefreshTable(!refreshTable);
    };

    const handleAddAdmin = () => {
        setopenAddDialog(true);
    };

    function resetAddDialog() {
        setAdminEmail("");
    };

    const handleConfirmAdd = () => {
        console.log(rows);

        if (rows.some(admin => admin.userEmail === adminEmail)) {
            setErrorMessage("Error! Admin already exists.");
            return;
        }

        const newAdmin: User = {
            userEmail: adminEmail
        };

        console.log(newAdmin);
        addAdmin(newAdmin);
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
            <h3 style={{ marginBottom: "20px" }}>Admins</h3>
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
                    onClick={handleAddAdmin}
                    sx={{
                        textTransform: "none",
                        "@media (max-width: 600px)": {
                        margin: "0px 0",
                        },
                    }}>
                Add Admin
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
                            <TableRow key={row.userEmail}>
                                {columns.map((column) => (
                                <TableCell 
                                    key={`${row.userEmail}-${column.id}`} 
                                    style={{ height: "52px" }}>
                                    {column.id !== "actions" ? (
                                        row[column.id as keyof User]
                                    ) : (
                                    <div>
                                        <IconButton
                                            onClick={() => handleEdit(row.userEmail)}
                                            aria-label="edit"
                                        >
                                        <EditIcon style={{ fontSize: 18 }} />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleRemove(row.userEmail)}
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
            <Dialog 
                open={openAddDialog} 
                onClose={handleCancelAdd} maxWidth="lg">
                <DialogTitle>Add Admin</DialogTitle>
                <DialogContent style={{ width: "500px", height: "275px" }}>
                { errorMessage 
                    ? <Alert severity="error">
                        {errorMessage}
                      </Alert>
                    : <></>
                }
                <TextField
                    label="Email"
                    variant="outlined"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    fullWidth
                    margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelAdd}>Cancel</Button>
                    <Button onClick={handleConfirmAdd} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
            
            {/* EDIT DIALOG -------------------------------------------------------------------------*/}
            <Dialog 
                open={openEditDialog} 
                onClose={handleCancelEdit} maxWidth="lg">
                <DialogTitle>Edit Admin</DialogTitle>
                <DialogContent style={{ width: "500px", height: "340px" }}>
                <TextField
                    label="Admin to Edit"
                    variant="outlined"
                    value={adminEmailToEdit}
                    contentEditable="false"
                    fullWidth
                    margin="normal"
                    suppressContentEditableWarning={true}
                />
                <TextField
                    label="New Email"
                    variant="outlined"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    fullWidth
                    margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelEdit}>Cancel</Button>
                    <Button onClick={handleConfirmEdit} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminTable;