
import ResponsiveAppBar from './components/ResponsiveAppBar'
import Timeline from './components/Timeline';
import './styles/App.css'

// Components
import LoginPage from './components/LoginPage';
import Footer from './components/Footer';

// Modules
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeContext } from './theme/ThemeContextProvider'

function App() {
	const { theme } = useThemeContext();

	return (
		<ThemeProvider theme={ theme }>
			<CssBaseline />
			{/* Start of content */}
			<div className="App">
				<Timeline></Timeline>
				{/* <LoginPage></LoginPage> */}
				<ResponsiveAppBar logoTitle={"DRRS"} />
				<Timeline></Timeline>
				<Footer />
			</div>
			{/* End of content */}
		</ThemeProvider>
	)
}

export default App
