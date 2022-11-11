import React, { createContext, useState } from "react";
import { EstimatePageContextProps } from "@app-interfaces";
import { IRideShareDriver } from "@app-models";
import { Grid, Typography } from "@mui/material";
import AppDataGrid from "../../components/tables/AppDataGrid";

export const EstimatePageContext = createContext<EstimatePageContextProps | null>(null);

function EstimatesPage() {
  const [driver, setDriver] = useState<IRideShareDriver | null>(null);

  return (
    <EstimatePageContext.Provider value={{ driver, setDriver }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Estimates
          </Typography>
        </Grid>
        <Grid item />
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <AppDataGrid rows={[]} columns={[]} showToolbar />
        </Grid>
      </Grid>
    </EstimatePageContext.Provider>
  );
}

export default EstimatesPage;
