import React from "react";
import PublicLayout from "../../components/layouts/PublicLayout";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <Typography
        textAlign="center"
        variant="h2"
        gutterBottom
        component="div"
        sx={{ mt: 5 }}
      >
        Welcome
      </Typography>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item>
          <Button
            fullWidth
            onClick={() => navigate("/sign-in")}
            color="secondary"
            variant="contained"
          >
            Sign in
          </Button>
        </Grid>
      </Grid>
    </PublicLayout>
  );
}

export default WelcomePage;
