import * as React from "react";
// import Login from './logbuttons/Login';
import ustLogo from '../styles/images/UST_LOGO_WHT.png';

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NightmodeToggle from "./NightmodeToggle";
import LogoutButton from "./logbuttons/LogoutButton";
import { useThemeContext } from "../theme/ThemeContextProvider";
import { AuthContext } from "../utils/AuthContext";
import BusinessIcon from "@mui/icons-material/Business";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import InfoIcon from "@mui/icons-material/Info";
import { Link, useNavigate } from "react-router-dom";

let pages = ["Branches", "FAQs", "About"]; // change these to components in the future
let pageRoutes = ["/branches", "/FAQs", "/About"];
const adminPages = ["Branches", "Admin Dashboard", "Librarian Dashboard", "Logs", "FAQs", "About"]
const adminPageRoutes = ["/branches", "/adminDashboard", "/librarianDashboard", "/librarianLogs", "/FAQs", "/About"];
const librarianPages = ["Branches", "Librarian Dashboard", "Logs", "FAQs", "About"]
const librarianPageRoutes = ["/branches", "/librarianDashboard", "/librarianLogs", "/FAQs", "/About"];

const pageIcons: React.ReactNode[] = []; // change these to components in the future

type AppBarProps = {
  logoTitle: React.ReactNode;
};

function ResponsiveAppBar({ logoTitle }: AppBarProps) {
  const authContext = React.useContext(AuthContext);

  if (authContext?.userRole === "Admin") {
    pages = adminPages;
    pageRoutes = adminPageRoutes;
  } else if (authContext?.userRole === "Librarian") {
    pages = librarianPages;
    pageRoutes = librarianPageRoutes;
  }

  const navigate = useNavigate();
  const userPhoto = authContext?.user?.photoURL;

  // On-click, set reference position of navigation links to current target (menu icon)
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  let background = "";
  let textColor= "";

  const { theme } = useThemeContext();
  if (theme.palette.mode === "dark") {
    background =
      "radial-gradient(circle, #2b2b2b -90%, #0e1111 80%)";
      textColor=
      "#FFFFFF";
  } else {
    background = 
      "radial-gradient(circle, rgb(232, 172, 65) 100%, rgb(226, 202, 118) 50%);"
    textColor = 
      "#000000";  
  }

  // On-click, set reference position of menu component to current target (avatar)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: { background }
      }}>

      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo with Text */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Box component="img"
              sx={{ height: '50px', objectFit: 'contain' }}
              alt="UST Logo"
              src={ustLogo}
              display={{ xs: "none", sm: "none", md: "block" }} />
          </Typography>

          {/* Logo with Text for Mobile Views */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  {pageIcons[index]}
                  <Typography textAlign="center" sx={{ ml: "8px" }}>
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Box component="img"
              sx={{ height: '50px', objectFit: 'contain' }}
              alt="UST Logo"
              src={ustLogo}
              display={{ xs: "none", sm: "none", md: "block" }} />

          </Typography>

          {/* Expanded nav menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                component={Link} // Use Link component instead of button
                to={pageRoutes[index]} // Specify the route for each page
                onClick={handleCloseNavMenu}
                startIcon={pageIcons[index]}
                sx=
                {{ 
                  mx: 2, 
                  color: 
                  theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000', 
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* User avatar and menu */}
          <Box>
            <Tooltip title="Open user settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src={`${userPhoto}`} />
              </IconButton>
            </Tooltip>
            <Menu
              open={Boolean(anchorElUser)}
              anchorEl={anchorElUser}
              onClose={handleCloseUserMenu}
              keepMounted
              sx={{
                width: "300px",
                height: "auto",
                padding: 0,
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem>
                <LogoutButton>
                  <Typography sx={{ ml: "5px" }}>Logout</Typography>
                </LogoutButton>
              </MenuItem>
              <MenuItem>
                <NightmodeToggle>
                  <Typography sx={{ ml: "5px" }}>Toggle Mode</Typography>
                </NightmodeToggle>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
