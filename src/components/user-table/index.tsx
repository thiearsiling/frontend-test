import React, { useState, useContext, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { userContext } from "../../contexts/userContext";
import { IRows, IStream } from "../interfaces";
import { MenuItem, Select } from "@mui/material";
import useWebSocket, { ReadyState } from "react-use-websocket";

function UserTable() {
  const context = useContext(userContext);
  const [rows, setRows] = useState<Array<IRows>>([]);
  const [currentList, setCurrentList] = useState("A");
  const columns: GridColDef[] = [
    { field: "symbol", headerName: "Symbol", flex: 1 },
    { field: "c", headerName: "Last Price", flex: 1 },
    { field: "b", headerName: "Bid Price", flex: 1 },
    { field: "a", headerName: "Ask Price", flex: 1 },
    { field: "p", headerName: "Price Change", flex: 1 },
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
      <Select
        id="list-select"
        labelId="list-select"
        label="List"
        value={currentList}
        onChange={handleChange}
      >
        {context.lists.map((list) => (
          <MenuItem key={list.id} value={list.id}>
            List {list.id}
          </MenuItem>
        ))}
      </Select>
    );
  };

  useEffect(() => {
    setRows(context.symbols);
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
    <Paper elevation={2}>
      <DataGrid
        columns={columns}
        rows={rows}
        slots={{ toolbar: toolbarComponent }}
        initialState={{
          sorting: {
            sortModel: [{ field: "symbol", sort: "asc" }],
          },
        }}
      />
    </Paper>
  );
}

export default UserTable;
