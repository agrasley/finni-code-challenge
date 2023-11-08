import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { NavLink, Outlet } from "react-router-dom";
import { getUser } from "../utils";

export default function Root() {
  const user = getUser();
  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <Grid container gap={4}>
            <Grid item>
              <Button component={NavLink} sx={{ color: "white" }} to="/">
                Patient Dashboard
              </Button>
            </Grid>
            <Grid item>
              <Button component={NavLink} sx={{ color: "white" }} to="/fields">
                Manage Fields
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ width: 100 }}>
            <Typography sx={{ color: "white", fontWeight: 500 }}>
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
