import React, { useState } from "react";
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
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const Muitable = () => {
  const columns = [
    { id: "date", name: "Date Added" },
    { id: "name", name: "Name" },
    { id: "department", name: "Department" },
    { id: "email", name: "Email" },
    { id: "actions", name: "Actions" }, // Added for edit and remove buttons
  ];

  // Hardcoded data
  const MockData = [
    {
      date: "02-03-2024",
      name: "Edriech Balajadia",
      department: "MDBL-ST",
      email: "librarian@ust.edu.ph",
    },
    {
      date: "02-03-2024",
      name: "Ralph Alba Jerson",
      department: "MDBL-ST",
      email: "librarian@ust.edu.ph",
    },
    {
      date: "02-02-2024",
      name: "James Ivan Opao",
      department: "MDBL-GR",
      email: "librarian@ust.edu.ph",
    },
    {
      date: "01-28-2024",
      name: "Isaac John Reyes",
      department: "MDBL-ST",
      email: "librarian@ust.edu.ph",
    },
    {
      date: "01-28-2024",
      name: "Reece Jaucquin Valera",
      department: "FRST-SHS",
      email: "librarian@ust.edu.ph",
    },
    {
      date: "01-28-2024",
      name: "Ryan Louis Refugia",
      department: "MDBL-GR",
      email: "librarian@ust.edu.ph",
    },
    {
      date: "01-27-2024",
      name: "Kyle Molinyawe",
      department: "FRST-SHS",
      email: "librarian@ust.edu.ph",
    },
    {
      date: "01-27-2024",
      name: "Patrick Louis Rivera",
      department: "MDBL-GR",
      email: "librarian@ust.edu.ph",
    },
    {
      date: "01-27-2024",
      name: "Dave Chapelle",
      department: "MDBL-ST",
      email: "librarian@ust.edu.ph",
    },
    {
      date: "01-27-2024",
      name: "Marie Santos",
      department: "MDBL-ST",
      email: "librarian@ust.edu.ph",
    },
    // Add more data as needed
  ];

  const [rows, setRows] = useState(MockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [librarianEmail, setLibrarianEmail] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [sortOrder, setSortOrder] = useState({ id: "", direction: "" });

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
    const aValue = a[sortOrder.id];
    const bValue = b[sortOrder.id];
    const multiplier = sortOrder.direction === "asc" ? 1 : -1;
    if (aValue < bValue) return -1 * multiplier;
    if (aValue > bValue) return 1 * multiplier;
    return 0;
  });

  const handleEdit = (index: number) => {
    // Handle edit action here
    console.log("Edit row:", index);
  };

  const handleRemove = (index: number) => {
    // Handle remove action here
    console.log("Remove row:", index);
  };

  const handleAddLibrarian = () => {
    setOpenDialog(true);
  };

  const handleConfirmAdd = () => {
    // Handle adding librarian here
    console.log("Email:", librarianEmail);
    console.log("Section:", selectedSection);
    setOpenDialog(false);
    // Reset input values
    setLibrarianEmail("");
    setSelectedSection("");
  };

  const handleCancelAdd = () => {
    setOpenDialog(false);
    // Reset input values
    setLibrarianEmail("");
    setSelectedSection("");
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
                          row[column.id]
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

      <Dialog open={openDialog} onClose={handleCancelAdd} maxWidth="lg">
        <DialogTitle>Add Librarian</DialogTitle>
        <DialogContent style={{ width: "500px", height: "200px" }}>
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
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              label="Department"
            >
              <MenuItem value={1}>
                Miguel de Benavides Library - General References
              </MenuItem>
              <MenuItem value={2}>
                Miguel de Benavides Library - Science and Technology
              </MenuItem>
              <MenuItem value={3}>
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
    </div>
  );
};

export default Muitable;
