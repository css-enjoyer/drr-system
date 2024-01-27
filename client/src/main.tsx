import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeContextProvider } from './theme/ThemeContextProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<GoogleOAuthProvider clientId="162525236672-ev7e0qalfa9m3tp5c9djcb72igj78fnn.apps.googleusercontent.com">
		<ThemeContextProvider>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</ThemeContextProvider>
	</GoogleOAuthProvider>
)
