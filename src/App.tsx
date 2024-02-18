import "./styles/App.css";

// Components
import LoginPage from "./components/LoginPage";
import Footer from "./components/Footer";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Timeline from "./components/Timeline";
import LibrarianReservationLogs from "./components/reservationlogs/LibrarianReservationLogs";
import AdminDashboard from "./components/reservationlogs/AdminDashboard";
import Confirmation from "./components/miscellaneous/Confirmation";
import Cancellation from "./components/miscellaneous/Cancellation";

// Modules
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useThemeContext } from "./theme/ThemeContextProvider";

// Routes
import { Route, Routes } from "react-router-dom";
import { Protected } from "./utils/Protected";
import { useContext } from "react";
import { AuthContext } from "./utils/AuthContext";
import SelectBranch from "./components/SelectBranch";
import { Cancel, Login } from "@mui/icons-material";

// Utils

function App() {
  const { theme } = useThemeContext();
  const authContext = useContext(AuthContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* Show appbar and footer only when logged in */}
        {authContext?.user && <ResponsiveAppBar logoTitle={"DRRS"} />}
        <Routes>
          <Route
            path="/"
            element={<LoginPage />}
            // element={<Confirmation messageKey="reservationSuccess" />}
          />
          <Route
            path="*"
            element={
              <Protected>
                <SelectBranch />
              </Protected>
            }
          />
          <Route
            path="/login"
            element={<LoginPage />}
            // element={<Confirmation messageKey="reservationSuccess" />}
          />
          <Route
            path="/branches"
            element={
              <Protected>
                <SelectBranch />
              </Protected>
            }
          />
          <Route
            path="/branches/:branchId/timeline"
            element={
              <Protected>
                <Timeline />
              </Protected>
            }
          />
        </Routes>
        {authContext?.user && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;
