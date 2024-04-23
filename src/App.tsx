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
        <Grid item md={4}>
          <SymbolsTable />
        </Grid>
        <Grid item md={8}>
          <UserTable />
        </Grid>
      </Grid>
    </UserContextComponent>
  );
}

export default App;
