"use client";

import { useConfirm } from "@/hooks/use-confirm";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

const Confirm = () => {
  const { confirms } = useConfirm();

  return confirms.map((confirm) => (
    <AlertDialog
      key={confirm.id}
      open={confirm.open}
      onOpenChange={confirm.onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirm.title}</AlertDialogTitle>
          <AlertDialogDescription>{confirm.content}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button variant="outline" onClick={confirm.onCancel}>
            取消
          </Button>
          <Button onClick={confirm.onConfirm}>确认</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ));
};

export default Confirm;
