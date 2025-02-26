"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type JobStore, createJobStore } from "@/stores/job-store";

export type JobStoreApi = ReturnType<typeof createJobStore>;

export const CounterStoreContext = createContext<JobStoreApi>(undefined);

export interface CounterStoreProviderProps {
  children: ReactNode;
}

export const JobStoreProvider = ({ children }: CounterStoreProviderProps) => {
  const storeRef = useRef<JobStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createJobStore();
  }

  return (
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  );
};

export const useJobStore = <T,>(selector: (store: JobStore) => T): T => {
  const jobStoreContext = useContext(CounterStoreContext);

  if (!jobStoreContext) {
    throw new Error(`useJobStore must be used within JobStoreProvider`);
  }

  return useStore(jobStoreContext, selector);
};
