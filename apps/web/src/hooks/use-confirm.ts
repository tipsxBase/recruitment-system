import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { isBoolean, isPromise } from "@recruitment/shared";
import React, { useState } from "react";

export interface ConfirmState {
  confirms: InnerConfirmProps[];
}

export interface ConfirmProps extends Omit<AlertDialogProps, "children"> {
  id: string;
  title?: React.ReactNode;
  content?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => Promise<void | any> | boolean | void;
}

interface InnerConfirmProps
  extends Omit<ConfirmProps, "onCancel" | "onConfirm"> {
  onCancel?: () => void;
  onConfirm?: () => void;
}

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

enum ActionType {
  ADD_CONFIRM = "ADD_CONFIRM",
  UPDATE_CONFIRM = "UPDATE_CONFIRM",
  REMOVE_CONFIRM = "REMOVE_CONFIRM",
}

const listeners: Array<(state: ConfirmState) => void> = [];

type Confirm = Omit<ConfirmProps, "id">;

const reducer = (
  state: ConfirmState,
  action: { type: ActionType; confirm: InnerConfirmProps }
) => {
  switch (action.type) {
    case ActionType.ADD_CONFIRM:
      return {
        ...state,
        confirms: [...state.confirms, action.confirm],
      };
    case ActionType.UPDATE_CONFIRM:
      return {
        ...state,
        confirms: state.confirms.map((confirm) =>
          confirm.id === action.confirm.id
            ? { ...confirm, ...action.confirm }
            : confirm
        ),
      };
    case ActionType.REMOVE_CONFIRM:
      return {
        ...state,
        confirms: state.confirms.filter(
          (confirm) => confirm.id !== action.confirm.id
        ),
      };
    default:
      return state;
  }
};

let memoryState: ConfirmState = { confirms: [] };

const dispatch = (action: { type: ActionType; confirm: InnerConfirmProps }) => {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
};

const confirm = (props: Confirm) => {
  const { onCancel, onConfirm, onOpenChange, ...restProps } = props;
  const id = genId();
  const update = (props: Confirm) =>
    dispatch({
      type: ActionType.UPDATE_CONFIRM,
      confirm: { ...props, id },
    });
  const close = () =>
    dispatch({ type: ActionType.REMOVE_CONFIRM, confirm: { id } });

  const innerOnOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    if (!open) {
      close();
    }
  };

  const innerOnConfirm = () => {
    const result = onConfirm && onConfirm();
    if (isBoolean(result)) {
      if (result === false) {
        return;
      }
      close();
    } else if (isPromise(result)) {
      result.then(() => {
        close();
      });
    } else {
      close();
    }
  };

  const innerOnCancel = () => {
    if (onCancel) {
      onCancel();
    }
    close();
  };

  dispatch({
    type: ActionType.ADD_CONFIRM,
    confirm: {
      ...restProps,
      onConfirm: innerOnConfirm,
      onCancel: innerOnCancel,
      id,
      open: true,
      onOpenChange: innerOnOpenChange,
    },
  });

  return {
    id,
    close,
    update,
  };
};

export const useConfirm = () => {
  const [state, setState] = useState<ConfirmState>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    confirm,
    close: (confirmId?: string) => {
      dispatch({ type: ActionType.REMOVE_CONFIRM, confirm: { id: confirmId } });
    },
  };
};
