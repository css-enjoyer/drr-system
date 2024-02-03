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
import { Protected } from './Routes/Protected'

// Protected
import { AuthContext } from './Context/AuthContext';

function App() {
	const { theme } = useThemeContext();
	const router = createBrowserRouter([
		{
			path: "/",
			element: <LoginPage></LoginPage>
		},
		{
			path: "/login",
			element: <LoginPage></LoginPage>
		},
		{
			path: "/timeline",
			element: <Protected><Timeline/></Protected>
		}
	])

	return (
		<>
			<ThemeProvider theme={ theme }>
					<CssBaseline />
					{/* Start of content */}
					<div className="App">
						<ResponsiveAppBar logoTitle={"DRRS"} />
							<AuthContext>
								<RouterProvider router={router}></RouterProvider>
							</AuthContext>
						<Footer />
					</div>
					{/* End of content */}
				</ThemeProvider>
		</>
	)
}

export default App
