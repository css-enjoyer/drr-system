import "./styles/App.css";

// Components
import React from "react";
import LoginPage from "./components/LoginPage";
import Footer from "./components/Footer";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Timeline from "./components/Timeline";
import AdminDashboard from "./components/reservationlogs/AdminDashboard";
import LibrarianDashboard from "./components/reservationlogs/LibrarianDashboard";
import LibrarianReservationLogs from "./components/reservationlogs/LibrarianReservationLogs";
import Confirmation from "./components/miscellaneous/Confirmation";
import Cancellation from "./components/miscellaneous/Cancellation";
import About from "./components/miscellaneous/About";
import FAQs from "./components/miscellaneous/FAQs";
import NoInternetComponent from "./components/miscellaneous/internetError";


// Modules
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useThemeContext } from "./theme/ThemeContextProvider";
import { IconButton } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';


// Routes
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Protected } from "./utils/Protected";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./utils/AuthContext";
import SelectBranch from "./components/SelectBranch";
import { Cancel, Login } from "@mui/icons-material";

//Images
import ustLogo from '/src/styles/images/UST_LOGO_WHT.png';

// Utils


function App() {
  const { theme } = useThemeContext();
  const authContext = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();

  const [showScrollButton, setShowScrollButton] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollThreshold = 200;

      if (scrollY > scrollThreshold) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* Show appbar and footer only when logged in */}
        {authContext?.user && <ResponsiveAppBar logoTitle={<img src={ustLogo} />} />}
        <div className="App-content">
        <Routes>
          <Route
            path="/"
            element={
              authContext?.user ? <Navigate to="/branches" /> : <LoginPage />
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

          {/* librarian dashboard */}
          <Route
            path="/librarianDashboard"
            element={
              authContext?.user ? (
                <Protected>
                  <LibrarianDashboard />
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

          {/* FAQs page */}
          <Route
            path="/FAQs"
            element={
              authContext?.user ? (
                <Protected>
                  <FAQs />
                </Protected>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* About page */}
          <Route
            path="/About"
            element={
              authContext?.user ? (
                <Protected>
                  <About />
                </Protected>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* No Internet Connection Page */}
          <Route
            path="/netError"
            element={
              authContext?.user ? (
                <Protected>
                  <NoInternetComponent />
                </Protected>
              ) : (
                <Navigate to="/" />
              )
            }
          />

        </Routes>
        </div>
        {authContext?.user && <Footer />}
        {/* Scroll to Top Button */}
        {showScrollButton && (
        <IconButton
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#ffffff"
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
        )}
      </div>
    </ThemeProvider>
  );
}


export default App;
