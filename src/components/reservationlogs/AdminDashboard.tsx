import BranchTable from "./BranchTable";
import LibrarianDashboard from "./LibrarianDashboard";
import LibrarianTable from "./LibrarianTable";

const AdminDashboard = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {/* TABLE FOR LIBRARIANS */}
      <LibrarianTable></LibrarianTable>
      {/* TABLE FOR BRANCHES */}
      <BranchTable></BranchTable>
      {/* TABLE FOR ROOMS */}
      <LibrarianDashboard></LibrarianDashboard>
    </div>
  );
};

export default AdminDashboard;
