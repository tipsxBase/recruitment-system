import { JobEntity } from "@recruitment/schema";
import { createStore } from "zustand/vanilla";

export enum JobEditorMode {
  Create = "Create",
  Edit = "Edit",
  Copy = "Copy",
  View = "View",
}

export type JobState = {
  mode: JobEditorMode;
  currentRow: JobEntity;
};

export type JobStore = JobState & JobActions;

export type JobActions = {
  updateMode: (mode: JobEditorMode) => void;
  updateCurrentRow: (row: JobEntity) => void;
};

const defaultInitState: JobState = {
  mode: null,
  currentRow: null,
};

export const createJobStore = (initState: JobState = defaultInitState) => {
  return createStore<JobStore>()((set) => ({
    ...initState,
    updateMode: (mode) =>
      set((state) => {
        const nextMode = mode === state.mode ? null : mode;
        return {
          ...state,
          mode: nextMode,
        };
      }),
    updateCurrentRow: (row) => set((state) => ({ ...state, currentRow: row })),
  }));
};
