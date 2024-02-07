import './styles/App.css'

// Components
import LoginPage from './components/LoginPage';
import Footer from './components/Footer';
import ResponsiveAppBar from './components/ResponsiveAppBar'
import Timeline from './components/Timeline';

// Modules
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeContext } from './theme/ThemeContextProvider'

// Routes
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Protected } from './utils/Protected';
import { useContext } from 'react';
import { AuthContext } from './utils/AuthContext';
import SelectBranch from './components/SelectBranch';

// Utils

function App() {
	const { theme } = useThemeContext();
	const router = createBrowserRouter([
		{
			path: "/",
			element: <LoginPage />
		},
		{
			path: "/login",
			element: <LoginPage />
		},
		{
			path: "/timeline",
			element: <Protected><Timeline /></Protected>
		},
		{
			path: "/select-branch",
			element: <Protected><SelectBranch /></Protected>
		}
	])

	const authContext = useContext(AuthContext);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<div className="App">
				{/* Show appbar and footer only when logged in */}
				{authContext?.user && <ResponsiveAppBar logoTitle={"DRRS"} />}
				<RouterProvider router={router}></RouterProvider>
				{authContext?.user && <Footer />}
			</div>
		</ThemeProvider>
	)
}

export default App
