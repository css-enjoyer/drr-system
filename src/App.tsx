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
			element: <Timeline></Timeline>
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
