import React, { useState, useContext, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { userContext } from "../../contexts/userContext";
import { IRows, IStream } from "../interfaces";
import {
  MenuItem,
  Select,
  Chip,
  Grid,
  FormControl,
  IconButton,
} from "@mui/material";
import { purple } from "@mui/material/colors";

import useWebSocket, { ReadyState } from "react-use-websocket";
import { Add as AddIcon } from "@mui/icons-material";

function UserTable() {
  const context = useContext(userContext);
  const [rows, setRows] = useState<Array<IRows>>([]);
  const [currentList, setCurrentList] = useState("A");
  const columns: GridColDef[] = [
    {
      field: "symbol",
      headerName: "Symbol",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "header",
    },
    {
      field: "c",
      headerName: "Last Price",
      flex: 1,
      align: "center",
      headerClassName: "header",
      headerAlign: "center",
    },
    {
      field: "b",
      headerName: "Bid Price",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "header",
    },
    {
      field: "a",
      headerName: "Ask Price",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "header",
    },
    {
      field: "P",
      headerName: "Price Change",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "header",
      renderCell: (params) => {
        const color = params.value > 0 ? "success" : "error";
        const chip = params.value ? (
          <Chip label={`${params.value}%`} color={color} />
        ) : (
          "-"
        );
        return chip;
      },
    },
  ];

  const { sendMessage, readyState, lastJsonMessage } = useWebSocket(
    "wss://data-stream.binance.vision/stream",
    {
      onOpen: (event) => {
        console.log("open", event);
      },
      onClose: (event) => {
        console.log("close", event);
      },
    }
  );

  const subscribe = (symbols: Array<string>) => {
    if (readyState === ReadyState.OPEN) {
      const symbolsToSubscribe = symbols
        .map((sym) => `"${sym}@ticker"`)
        .toString()
        .toLowerCase();
      console.log(symbolsToSubscribe);
      sendMessage(`
      {
        "method": "SUBSCRIBE",
        "params": [
          ${symbolsToSubscribe}
        ],
        "id": 1
      }
      `);
    }
  };

  const toolbarComponent = () => {
    const handleChange = (event: any) => {
      context.changeList(event.target.value);
      setCurrentList(event.target.value);
    };

    return (
      <div
        style={{
          padding: 15,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={11}>
            <FormControl size="small" fullWidth>
              <Select
                id="list-select"
                labelId="list-select"
                value={currentList}
                onChange={handleChange}
              >
                {context.lists.map((list) => (
                  <MenuItem key={list.id} value={list.id}>
                    List {list.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <IconButton
              style={{ background: purple[500], borderRadius: 10 }}
              onClick={() => context.addList()}
            >
              <AddIcon style={{ color: "#FFF" }} />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    );
  };

  useEffect(() => {
    setRows(context.symbols);
    setCurrentList(context.currentList);
    if (context.symbols.length) {
      subscribe(context.symbols.map((sym) => sym.symbol));
    }
  }, [context.symbols]);

  useEffect(() => {
    const message = lastJsonMessage as unknown as IStream;
    if (message && message.data) {
      const data = message?.data;
      const updateRows = rows.filter((row) => row.symbol !== data.s);
      const newRow = { id: data.s, symbol: data.s, ...data };
      setRows([...updateRows, newRow]);
    }
  }, [lastJsonMessage]);

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
          columns={columns}
          rows={rows}
          slots={{ toolbar: toolbarComponent }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableColumnResize
          disableColumnSorting
          disableColumnMenu
          initialState={{
            sorting: {
              sortModel: [{ field: "symbol", sort: "asc" }],
            },
          }}
        />
      </Box>
    </Paper>
  );
}

export default UserTable;
