import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeContextProvider } from "./theme/ThemeContextProvider.tsx";
import { AuthContextProvider } from "./utils/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
// If you are using date-fns v2.x, please import `AdapterDateFns`
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeContextProvider>
            <BrowserRouter>
                <AuthContextProvider>
                    {/* <React.StrictMode> */}
                    <App />
                    {/* </React.StrictMode> */}
                </AuthContextProvider>
            </BrowserRouter>
        </ThemeContextProvider>
    </LocalizationProvider>
);
