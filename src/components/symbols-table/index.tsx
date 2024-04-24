import React, { useEffect, useState, useContext } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Paper, Button, Box } from "@mui/material";
import BinanceApi from "../../apis/binance";
import { userContext } from "../../contexts/userContext";
import { IRows } from "../interfaces";
import { purple } from "@mui/material/colors";

const SymbolsTable = () => {
  const context = useContext(userContext);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState<Array<any>>([]);

  const columns: GridColDef[] = [
    {
      field: "symbol",
      headerName: "Symbol",
      headerClassName: "header",
      flex: 1,
    },
  ];

  const registerSymbols = () => {
    context.addSymbols(selectedRows.map((sym) => ({ id: sym, symbol: sym })));
  };

  const footerComponent = () => {
    return (
      <div
        style={{
          padding: 15,
        }}
      >
        <Button
          variant="contained"
          size="small"
          fullWidth
          style={{ borderRadius: 15, backgroundColor: purple[500] }}
          onClick={() => registerSymbols()}
        >
          Add to List
        </Button>
      </div>
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
    <Paper elevation={2} style={{ height: "80vh" }}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          "& .header": {
            backgroundColor: "#E8E9EB",
            fontWeight: "strong",
          },
        }}
      >
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
      </Box>
    </Paper>
  );
};

export default SymbolsTable;
