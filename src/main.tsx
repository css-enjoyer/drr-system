import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeContextProvider } from "./theme/ThemeContextProvider.tsx";
import { AuthContextProvider } from "./utils/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ThemeContextProvider>
        <BrowserRouter>
            <AuthContextProvider>
                {/* <React.StrictMode> */}
                <App />
                {/* </React.StrictMode> */}
            </AuthContextProvider>
        </BrowserRouter>
    </ThemeContextProvider>
);
