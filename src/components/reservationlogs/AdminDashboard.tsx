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
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowUpward, ArrowDownward, DepartureBoard } from "@mui/icons-material";
import { LibrarianProp, Librarian } from "../../Types";
import { FieldValue, Timestamp } from "firebase/firestore";
import { addLibrarian, deleteLibrarian, editLibrarian, getLibrarians } from "../../firebase/dbHandler";
import BranchTable from "../BranchTable";

const Muitable = () => {
  const columns = [
    { id: "date", name: "Date Added" },
    { id: "name", name: "Name" },
    { id: "department", name: "Department" },
    { id: "email", name: "Email" },
    { id: "actions", name: "Actions" }, // Added for edit and remove buttons
  ];

  // Hardcoded data
  const MockData: LibrarianProp[] = [
  ];

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
  const [openEditDialog, setopenEditDialog] = useState(false)
  // TABLE HANDLERS
  const fetchData = async () => {
    const LibrariansData = await getLibrarians();
    const librarianProps: LibrarianProp[] = [];

    LibrariansData.forEach((librarian) => {
      const librarianProp = {
        date: librarian.dateAdded.toDate().toDateString(),
        name: librarian.librarianName,
        email: librarian.userEmail,
        department: librarian.librarianBranch
      }

      console.log(librarian)

      librarianProps.push(librarianProp);
    })
    setRows(librarianProps)
  }

  useEffect(() => {
    fetchData();
  }, [])

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
    const multiplier = sortOrder.direction === "asc" ? 1 : -1;
    if (aValue < bValue) return -1 * multiplier;
    if (aValue > bValue) return 1 * multiplier;
    return 0;
  });

  // HANDLE EDIT
  const handleEdit = (index: number) => {
    console.log("Edit row:", rows.at(index)?.email);
    setLibrarianEmailToEdit(rows.at(index)?.email as string)
    setLibrarianEmail(rows.at(index)?.email as string);
    setLibrarianName(rows.at(index)?.name as string);
    setLibrarianDepartment(rows.at(index)?.department as string);
    setopenEditDialog(true);
    
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

    fetchData();
  }

  const handleCancelEdit = () => {
    setopenEditDialog(false);
    resetAddDialog();
  };


  // HANDLE REMOVE
  const handleRemove = (index: number) => {
    // Handle remove action here
    console.log("Remove row:", rows.at(index)?.email);
    deleteLibrarian(rows.at(index)?.email as string);
    fetchData();
  };

  // HANDLE ADD
  const handleAddLibrarian = () => {
    setopenAddDialog(true);
  };

  function resetAddDialog() {
    setLibrarianEmail("");
    setLibrarianName("");
    setLibrarianDepartment("");
  }

  const handleConfirmAdd = () => {
    const newLibrarian: Librarian = {
      dateAdded: Timestamp.now(),
      librarianName: librarianName,
      userEmail: librarianEmail,
      librarianBranch: librarianDepartment
    }
    
    console.log(newLibrarian)

    addLibrarian(newLibrarian);
    setopenAddDialog(false);
    // Reset input values
    resetAddDialog;
    fetchData();
  };

  const handleCancelAdd = () => {
    setopenAddDialog(false);
    // Reset input values
    resetAddDialog();
  };

  const filteredRows = sortedRows.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3 style={{ marginBottom: "20px" }}>Admin Dashboard</h3>
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
          style={{ width: "60%" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddLibrarian}
          sx={{
            textTransform: "none",
            "@media (max-width: 600px)": {
              margin: "0px 0",
            },
          }}
        >
          Add Librarian
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddLibrarian}
          sx={{
            textTransform: "none",
            "@media (max-width: 600px)": {
              margin: "0px 0",
            },
          }}
        >
          Edit Contact
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddLibrarian}
          sx={{
            textTransform: "none",
            "@media (max-width: 600px)": {
              margin: "0px 0",
            },
          }}
        >
          Edit FAQs
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
                          row[column.id as keyof typeof row] // Corrected line
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
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        />
      </Paper>
{/* ADD DIALOG -------------------------------------------------------------------------*/}
      <Dialog open={openAddDialog} onClose={handleCancelAdd} maxWidth="lg">
        <DialogTitle>Add Librarian</DialogTitle>
        <DialogContent style={{ width: "500px", height: "275px" }}>
          <TextField
            label="Name"
            variant="outlined"
            value={librarianName}
            onChange={(e) => setLibrarianName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            variant="outlined"
            value={librarianEmail}
            onChange={(e) => setLibrarianEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="section-label">Department</InputLabel>
            <Select
              labelId="section-label"
              value={librarianDepartment}
              onChange={(e) => setLibrarianDepartment(e.target.value)}
              label="Department"
            >
              <MenuItem value={"gen-ref"}>
                Miguel de Benavides Library - General References
              </MenuItem>
              <MenuItem value={"sci-tech"}>
                Miguel de Benavides Library - Science and Technology
              </MenuItem>
              <MenuItem value={"shs"}>
                Blessed Pier Giorgio Frassati - Senior High-School
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
            margin="normal"
          />
          <TextField
            label="New Email"
            variant="outlined"
            value={librarianEmail}
            onChange={(e) => setLibrarianEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="section-label">New Department</InputLabel>
            <Select
              labelId="section-label"
              value={librarianDepartment}
              onChange={(e) => setLibrarianDepartment(e.target.value)}
              label="Department"
            >
              <MenuItem value={"gen-ref"}>
                Miguel de Benavides Library - General References
              </MenuItem>
              <MenuItem value={"sci-tech"}>
                Miguel de Benavides Library - Science and Technology
              </MenuItem>
              <MenuItem value={"shs"}>
                Blessed Pier Giorgio Frassati - Senior High-School
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

      <BranchTable></BranchTable>
    </div>

 
    
  );
};

export default Muitable;
