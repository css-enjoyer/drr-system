import './styles/App.css'
import Timeline from './components/Timeline';
import ResponsiveAppBar from './components/ResponsiveAppBar'

// Components
import LoginPage from './components/LoginPage';
import Footer from './components/Footer';

// Modules
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeContext } from './theme/ThemeContextProvider'

// Routes
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthRoute from './utils/AuthRoute';

// Protected

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
			element: <AuthRoute><Timeline/></AuthRoute>
		}
	])

	return (
		<>
			<ThemeProvider theme={ theme }>
					<CssBaseline />
					{/* Start of content */}
					<div className="App">
						<ResponsiveAppBar logoTitle={"DRRS"} />
							<RouterProvider router={router}></RouterProvider>
						<Footer />
					</div>
					{/* End of content */}
				</ThemeProvider>
		</>
	)
}

export default App
