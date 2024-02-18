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
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const Muitable = () => {
  const columns = [
    { id: "date", name: "Date" },
    { id: "time", name: "Time" },
    { id: "room", name: "Room" },
    { id: "representative", name: "Representative" },
  ];

  // Hardcoded data
  const MockData = [
    {
      date: "02-03-2024",
      time: "11:00 AM - 01:00 PM",
      room: "ROOM 1",
      representative: "representative.college@ust.edu.ph",
    },
    {
      date: "02-03-2024",
      time: "11:00 AM - 01:00 PM",
      room: "ROOM 3",
      representative: "representative.college@ust.edu.ph",
    },
    {
      date: "02-02-2024",
      time: "02:00 PM - 03:00 PM",
      room: "ROOM 2",
      representative: "representative.college@ust.edu.ph",
    },
    {
      date: "01-28-2024",
      time: "10:00 AM - 12:00 PM",
      room: "ROOM 3",
      representative: "representative.college@ust.edu.ph",
    },
    {
      date: "01-28-2024",
      time: "05:00 PM - 06:00 PM",
      room: "ROOM 3",
      representative: "representative.college@ust.edu.ph",
    },
    {
      date: "01-28-2024",
      time: "08:30 AM - 10:30 AM",
      room: "ROOM 1",
      representative: "representative.college@ust.edu.ph",
    },
    {
      date: "01-27-2024",
      time: "09:30 AM - 11:00 AM",
      room: "ROOM 1",
      representative: "representative.college@ust.edu.ph",
    },
    {
      date: "01-27-2024",
      time: "09:30 AM - 11:00 AM",
      room: "ROOM 2",
      representative: "representative.college@ust.edu.ph",
    },
    {
      date: "01-27-2024",
      time: "11:00 AM - 01:00 PM",
      room: "ROOM 3",
      representative: "representative.college@ust.edu.ph",
    },
    {
      date: "01-27-2024",
      time: "12:00 PM - 02:00 PM",
      room: "ROOM 2",
      representative: "representative.college@ust.edu.ph",
    },
    // Add more data as needed
  ];

  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState({ id: "", direction: "" });

  useEffect(() => {
    setRows(MockData);
  }, []);

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
    const aValue = a[sortOrder.id];
    const bValue = b[sortOrder.id];
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

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3 style={{ marginBottom: "20px" }}>Librarian Reservation Logs</h3>
      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: "90%", marginBottom: "20px" }}
      />

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
                      <TableCell key={column.id}>{row[column.id]}</TableCell>
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
};

export default Muitable;
