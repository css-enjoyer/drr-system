import { useState } from 'react';

import ResponsiveAppBar from './components/ResponsiveAppBar'
import Login from './components/logbuttons/Login';
import LoginPage from './components/LoginPage';
import Timeline from './components/Timeline';

import './styles/App.css'

function App() {

	const [authorized, setAuthorized] = useState(null);

	return (
		<div className="App">
			<ResponsiveAppBar logoTitle={"DRRS"}></ResponsiveAppBar>
			{/* <Login></Login> */}
			{/* <Timeline></Timeline> */}
			<LoginPage></LoginPage>
		</div>
	)
}

export default App
