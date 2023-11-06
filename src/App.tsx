import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login, { loginAction } from "./pages/Login";
import { requireLogin } from "./utils";
import PatientDashboard, {
  patientDashboardLoader,
} from "./pages/PatientDashboard";
import Root from "./pages/Root";
import Onboarding from "./pages/Onboarding";
import Fields, { customFieldsLoader } from "./pages/Fields";

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
    element: <Root />,
    children: [
      {
        path: "",
        element: <PatientDashboard />,
        loader: requireLogin(patientDashboardLoader),
      },
      {
        path: "onboarding",
        element: <Onboarding />,
      },
      {
        path: "fields",
        element: <Fields />,
        loader: requireLogin(customFieldsLoader),
      },
    ],
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
