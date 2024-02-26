import "./styles/App.css";

// Components
import React from "react";
import LoginPage from "./components/LoginPage";
import Footer from "./components/Footer";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Timeline from "./components/Timeline";
import LibrarianReservationLogs from "./components/reservationlogs/LibrarianReservationLogs";
import AdminDashboard from "./components/reservationlogs/AdminDashboard";
import Confirmation from "./components/miscellaneous/Confirmation";
import Cancellation from "./components/miscellaneous/Cancellation";
import Loading from "./components/miscellaneous/Loading";

// Modules
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useThemeContext } from "./theme/ThemeContextProvider";

// Routes
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Protected } from "./utils/Protected";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./utils/AuthContext";
import SelectBranch from "./components/SelectBranch";
import { Cancel, Login } from "@mui/icons-material";

// Utils

function App() {
  const { theme } = useThemeContext();
  const authContext = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Show appbar and footer only when logged in */}
            {authContext?.user && <ResponsiveAppBar logoTitle={"DRRS"} />}
            <Routes>
              <Route
                path="/"
                element={
                  authContext?.user ? (
                    <Navigate to="/branches" />
                  ) : (
                    <LoginPage />
                  )
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/branches"
                element={
                  authContext?.user ? (
                    <Protected>
                      <SelectBranch />
                    </Protected>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/branches/:branchId/timeline"
                element={
                  authContext?.user ? (
                    <Protected>
                      <Timeline />
                    </Protected>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />

              {/* librarian reservation logs */}
              <Route
                path="/librarianLogs"
                element={
                  authContext?.user ? (
                    <Protected>
                      <LibrarianReservationLogs />
                    </Protected>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />

              {/* admin dashboard */}
              <Route
                path="/adminDashboard"
                element={
                  authContext?.user ? (
                    <Protected>
                      <AdminDashboard />
                    </Protected>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />

              {/* confirmation page */}
              <Route
                path="/confirmation"
                element={
                  authContext?.user ? (
                    <Protected>
                      <Confirmation messageKey="reservationSuccess" />
                    </Protected>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />

              {/* cancellation page */}
              <Route
                path="/cancellation"
                element={
                  authContext?.user ? (
                    <Protected>
                      <Cancellation />
                    </Protected>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />

            </Routes>
            {authContext?.user && <Footer />}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;

// function App() {
//   const { theme } = useThemeContext();
//   const authContext = useContext(AuthContext);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <div className="App">
//         {/* Show appbar and footer only when logged in */}
//         {authContext?.user && <ResponsiveAppBar logoTitle={"DRRS"} />}
//         <Routes>
//           <Route
//             path="/"
//             element={<LoginPage />}
//             // element={<Confirmation messageKey="reservationSuccess" />}
//           />
//           <Route
//             path="*"
//             element={
//               <Protected>
//                 <SelectBranch />
//               </Protected>
//             }
//           />
//           <Route
//             path="/login"
//             element={<LoginPage />}
//             // element={<Confirmation messageKey="reservationSuccess" />}
//           />
//           <Route
//             path="/branches"
//             element={
//               <Protected>
//                 <SelectBranch />
//               </Protected>
//             }
//           />
//           <Route
//             path="/branches/:branchId/timeline"
//             element={
//               <Protected>
//                 <Timeline />
//               </Protected>
//             }
//           />
//         </Routes>
//         {authContext?.user && <Footer />}
//       </div>
//     </ThemeProvider>
//   );
// }

// export default App;
