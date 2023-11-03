import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { postData } from "../utils";
import Typography from "@mui/material/Typography";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Grid
      container
      sx={{ width: 1, height: "100vh", bgcolor: "#f1eade" }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <Paper elevation={3} sx={{ width: 500, height: 500 }}>
          <Grid
            container
            direction="column"
            alignItems="center"
            spacing={3}
            justifyContent="center"
            sx={{ height: 1 }}
          >
            <Grid item>
              <Typography variant="h3" color="primary">
                Welcome!
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                label="Username"
                variant="outlined"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Button
                onClick={() =>
                  postData("/login/password", {
                    username,
                    password,
                  })
                }
                variant="contained"
              >
                Log In
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
