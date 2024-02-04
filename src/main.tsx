import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeContextProvider } from './theme/ThemeContextProvider.tsx'
import { AuthContext, AuthContextProvider } from './utils/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<ThemeContextProvider>
		<AuthContextProvider>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</AuthContextProvider>
	</ThemeContextProvider>
)
