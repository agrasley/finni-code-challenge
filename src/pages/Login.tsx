import React from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Form, ActionFunctionArgs, redirect } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { postData } from "../utils";

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = await postData("/login/password", Object.fromEntries(formData));
  window.localStorage.setItem("user", JSON.stringify(user));
  return redirect(`/`);
}

export default function Login() {
  return (
    <Grid
      container
      sx={{ width: 1, height: "100vh", bgcolor: "#f1eade" }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <Paper elevation={3} sx={{ width: 500, height: 500 }}>
          <Form method="post" id="login-form">
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
                  name="username"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  name="password"
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained">
                  Log In
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Paper>
      </Grid>
    </Grid>
  );
}
