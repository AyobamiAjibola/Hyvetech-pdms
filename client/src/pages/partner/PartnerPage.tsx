import React from "react";
import { useParams } from "react-router-dom";
import { Grid, Stack } from "@mui/material";
import AppDataGrid from "../../components/tables/AppDataGrid";

function PartnerPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Partner {id}</h1>
      <Stack>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={12} md={6}>
            <AppDataGrid rows={[]} columns={[]} />
          </Grid>
          <Grid item xs={12} md={6}>
            <AppDataGrid rows={[]} columns={[]} />
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
}

export default PartnerPage;
