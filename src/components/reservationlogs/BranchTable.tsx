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
    DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Branch } from "../../Types";
import { addBranch, deleteBranch, editBranch, getBranches } from "../../firebase/dbHandler";

const BranchTable = () => {
    const columns = [
        { id: "branchTitle", name: "Name" },
        { id: "branchId", name: "ID" },
        { id: "branchLoc", name: "Location" },
        // { id: "imgSrc", name: "Image Source" },
        { id: "actions", name: "Actions" }
    ];

    // Refresh table after action/s are done
    const [refreshTable, setRefreshTable] = useState(false);

    /******************************
    *  TABLE INIT
    ******************************/
    const [rows, setRows] = useState<Branch[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState({ id: "", direction: "" });

    const [branchName, setBranchName] = useState("");
    const [branchId, setBranchId] = useState("");
    const [branchLocation, setBranchLocation] = useState("");
    const [imgSource, setImgSource] = useState("");
    const [branchToEdit, setBranchToEdit] = useState("");
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    /* --- TABLE HANDLERS --- */
    const fetchData = async () => {
        const branchData = await getBranches();
        const branchProps: Branch[] = [];

        branchData.forEach((branch) => {
            const branchProp = {
                branchId: branch.branchId,
                branchTitle: branch.branchTitle,
                branchLoc: branch.branchLoc,
                imgSrc: branch.imgSrc
            };

            // *** VERIFICATION
            console.log(branch);
            branchProps.push(branchProp);
        });

        setRows(branchProps);
    };

    useEffect(() => {
        fetchData();
    }, [refreshTable]);

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

    /* --- EDIT FUNCTIONALITIES --- */
    const handleEdit = (branchId: string) => {
        const rowToEdit = rows.find((row) => row.branchId === branchId);
        if (rowToEdit) {
            // *** VERIFIFCATION
            console.log("Edit row:", rowToEdit.branchId);
            
            setBranchToEdit(rowToEdit.branchId);
        
            setBranchId(rowToEdit.branchId);
            setBranchName(rowToEdit.branchTitle);
            setBranchLocation(rowToEdit.branchLoc);
            setImgSource(rowToEdit.imgSrc);

            setOpenEditDialog(true);
        }
    };

    const handleConfirmEdit = () => {
        const newBranch: Branch = {
            branchId: branchId,
            branchTitle: branchName,
            branchLoc: branchLocation,
            imgSrc: imgSource
        };

        editBranch(branchToEdit, newBranch);
        setOpenEditDialog(false);
        resetAddDialog();

        setRows((prevRows) =>
            prevRows.map((row) =>
              row.branchId === branchToEdit ? newBranch : row
            )
        );
    }

    const handleCancelEdit = () => {
        setOpenEditDialog(false);
        resetAddDialog();
    };


    // HANDLE REMOVE
    const handleRemove = (branchId: string) => {
        deleteBranch(branchId);
        setRows((prevRows) => prevRows.filter((row) => row.branchId !== branchId));
    };

    // HANDLE ADD
    function resetAddDialog() {
        setBranchId("");
        setBranchName("");
        setBranchLocation("");
        setImgSource("");
    }

    const handleAddBranch = () => {
        setOpenAddDialog(true);
    };

    const handleConfirmAdd = () => {
        const newBranch: Branch = {
            branchId: branchId,
            branchTitle: branchName,
            branchLoc: branchLocation,
            imgSrc: imgSource
        };

        // *** VERIFICATION
        console.log(newBranch);

        addBranch(newBranch);
        setOpenAddDialog(false);
        resetAddDialog();
        setRefreshTable(!refreshTable);
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
        <h3 style={{ marginBottom: "20px" }}>Branches</h3>
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
                onClick={handleAddBranch}
                sx={{
                    textTransform: "none",
                    "@media (max-width: 600px)": {
                        margin: "0px 0",
                    },
                }}
            >
            Add Branch
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
                    .map((row) => (
                        <TableRow key={row.branchId}>
                            {columns.map((column) => (
                                <TableCell key={`${row.branchId}-${column.id}`} style={{ height: "52px" }}>
                                    {column.id !== "actions" ? (
                                        row[column.id as keyof Branch]
                                    ) : (
                                        <div>
                                            <IconButton
                                                onClick={() => handleEdit(row.branchId)}
                                                aria-label="edit"
                                            >
                                            <EditIcon style={{ fontSize: 18 }} />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleRemove(row.branchId)}
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
            <DialogTitle>Add Branch</DialogTitle>
            <DialogContent style={{ width: "500px", height: "275px" }}>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Id"
                    variant="outlined"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Location"
                    variant="outlined"
                    value={branchLocation}
                    onChange={(e) => setBranchLocation(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="ImgSrc"
                    variant="outlined"
                    value={imgSource}
                    onChange={(e) => setImgSource(e.target.value)}
                    fullWidth
                    margin="normal"
                />
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
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogContent style={{ width: "500px", height: "340px" }}>
            <TextField
                label="Branch to Edit"
                variant="outlined"
                value={branchToEdit}
                contentEditable="false"
                fullWidth
                margin="normal"
                suppressContentEditableWarning={true}
            />
            <TextField
                label="New Name"
                variant="outlined"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="New Id"
                variant="outlined"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="New Location"
                variant="outlined"
                value={branchLocation}
                onChange={(e) => setBranchLocation(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="New Image Source"
                variant="outlined"
                value={imgSource}
                onChange={(e) => setImgSource(e.target.value)}
                fullWidth
                margin="normal"
            />
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

export default BranchTable;
