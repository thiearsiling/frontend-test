import React, { ReactNode, createContext, useState } from "react";

const initialValues: IContext = {
  lists: [
    {
      id: "A",
      symbols: [],
    },
    {
      id: "B",
      symbols: [],
    },
  ],
  currentList: "A",
  changeList: () => {},
  symbols: [],
  addSymbols: () => {},
};

export const userContext = createContext(initialValues);

export interface IContext {
  lists: Array<any>;
  currentList: string;
  changeList: Function;
  symbols: Array<any>;
  addSymbols: Function;
}

interface IProps {
  children: ReactNode;
}

const UserContextComponent = ({ children }: IProps) => {
  const [symbols, setSymbols] = useState<Array<any>>([]);
  const [lists, setLists] = useState<Array<any>>(initialValues.lists);
  const [currentList, setCurrentList] = useState<string>(
    initialValues.currentList
  );

  const addSymbols = (newSymbols: any) => {
    const oldLists = lists.filter((list) => list.id !== currentList);
    setLists([...oldLists, { id: currentList, symbols: newSymbols }]);
    setSymbols(newSymbols);
  };

  const changeList = (newList: string) => {
    const listIndex = lists.findIndex((list) => list.id === newList);
    setSymbols(lists[listIndex].symbols);
    setCurrentList(newList);
    // setSymbols(lists)
  };

  const value = { lists, currentList, changeList, symbols, addSymbols };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export default UserContextComponent;
