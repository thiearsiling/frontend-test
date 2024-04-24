import React from "react";
import Grid from "@mui/material/Grid";
import "./App.css";
import SymbolsTable from "./components/symbols-table";
import UserTable from "./components/user-table";
import UserContextComponent from "./contexts/userContext";

function App() {
  return (
    <UserContextComponent>
      <Grid container spacing={1} p={2}>
        <Grid item xs={12} lg={2}>
          <SymbolsTable />
        </Grid>
        <Grid item xs={12} lg={10}>
          <UserTable />
        </Grid>
      </Grid>
    </UserContextComponent>
  );
}

export default App;
