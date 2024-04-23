import React, { useEffect, useState, useContext } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Paper, Button } from "@mui/material";
import BinanceApi from "../../apis/binance";
import { userContext } from "../../contexts/userContext";
import { IRows } from "../interfaces";

const SymbolsTable = () => {
  const context = useContext(userContext);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState<Array<any>>([]);
  const columns: GridColDef[] = [{ field: "symbol", headerName: "Symbol" }];

  const registerSymbols = () => {
    context.addSymbols(selectedRows.map((sym) => ({ id: sym, symbol: sym })));
  };

  const footerComponent = () => {
    return (
      <Button variant="contained" onClick={() => registerSymbols()}>
        Add to List
      </Button>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await BinanceApi().getExchangeInfo();

      const data = result.map((sym: IRows) => {
        return {
          id: sym.symbol,
          symbol: sym.symbol,
        };
      });

      setRows(data);
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   setSelectedRows([]);
  //   setRows(rows);
  //   console.log(context.currentList);
  // }, [context.currentList]);

  return (
    <Paper elevation={2}>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar, footer: footerComponent }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableColumnResize
        disableColumnSorting
        disableColumnMenu
        checkboxSelection
        onRowSelectionModelChange={(ids) => {
          setSelectedRows(ids);
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
      />
    </Paper>
  );
};

export default SymbolsTable;
