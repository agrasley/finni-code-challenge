import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import { User, userContext } from "./store/user";

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
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <userContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        <RouterProvider router={router} />
      </userContext.Provider>
    </ThemeProvider>
  );
}

export default App;
