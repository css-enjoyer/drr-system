import BranchTable from "./BranchTable";
import LibrarianDashboard from "./LibrarianDashboard";
import LibrarianTable from "./LibrarianTable";

const Muitable = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1 style={{ marginBottom: "60px" }}>Admin Dashboard</h1>
      {/* Table for Librarian */}
      <LibrarianTable></LibrarianTable>
      {/* Table for Branches */}
      <BranchTable></BranchTable>
      {/* Table for Rooms */}
      <LibrarianDashboard></LibrarianDashboard>
    </div>
  );
};

export default Muitable;
