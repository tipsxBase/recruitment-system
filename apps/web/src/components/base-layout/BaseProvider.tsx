import React from "react";
import { createContext, useContext } from "react";
import createStore from "./createStore";

export type BaseContextProps = ReturnType<typeof createStore>;

const BaseContext = createContext<BaseContextProps>({} as BaseContextProps);

export const BaseProvider = ({
  children,
  store,
}: Readonly<{
  children: React.ReactNode;
  store: BaseContextProps;
}>) => {
  return <BaseContext.Provider value={store}>{children}</BaseContext.Provider>;
};

export const useBaseStore = () => {
  return useContext(BaseContext);
};
