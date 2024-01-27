import ResponsiveAppBar from './components/ResponsiveAppBar'
import Timeline from './components/Timeline';
import './styles/App.css'

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeContext } from './theme/ThemeContextProvider';

function App() {
	const { theme } = useThemeContext();

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<ResponsiveAppBar logoTitle={"DRRS"}></ResponsiveAppBar>
			<div className="App">
				<Timeline></Timeline>
				{/* <Login></Login> */}
				{/* <LoginPage></LoginPage> */}
			</div>
		</ThemeProvider>
	)
}

export default App
