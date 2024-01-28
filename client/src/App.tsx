import ResponsiveAppBar from './components/ResponsiveAppBar'
import Timeline from './components/Timeline';
import './styles/App.css'

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeContext } from './theme/ThemeContextProvider';
import { Divider } from '@mui/material';
// import { Copyright } from '@mui/icons-material';

import LoginPage from './components/LoginPage';
import Footer from './components/Footer';

function App() {
	const { theme } = useThemeContext();

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<ResponsiveAppBar logoTitle={"DRRS"}></ResponsiveAppBar>
			<div className="App">
				<Timeline></Timeline>
				{/* <LoginPage></LoginPage> */}
				{/* <Login></Login> */}
			</div>
			<Divider />
			<Footer />
		</ThemeProvider>
	)
}

export default App
