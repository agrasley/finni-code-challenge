import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login, { loginAction } from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import RequireAuth from "./components/RequireAuth";

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
    element: (
      <RequireAuth>
        <PatientDashboard />
      </RequireAuth>
    ),
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
