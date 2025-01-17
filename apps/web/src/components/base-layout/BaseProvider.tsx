import React from "react";
import { createContext, useContext } from "react";
import { MenuEntity, UserEntity } from "@recruitment/schema/interface";

export interface BaseContextProps {
  menus: MenuEntity[];
  user: UserEntity;
}

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
