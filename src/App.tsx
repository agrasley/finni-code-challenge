import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login, { loginAction } from "./pages/Login";
import { requireLogin } from "./utils";
import PatientDashboard, {
  patientDashboardLoader,
} from "./pages/PatientDashboard";

const theme = createTheme({
  palette: {
    contrastThreshold: 2.9,
    primary: {
      main: "#ed762f",
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <PatientDashboard />,
    loader: requireLogin(patientDashboardLoader),
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction,
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
