"use client";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Copy, Edit, Ellipsis, Trash2, UserPen, View } from "lucide-react";
import { useJobStore } from "@/providers/job-store-provider";
import { JobEditorMode } from "@/stores/job-store";
import { JobEntity } from "@recruitment/schema";

interface JobTableRowActionsProps {
  row: Row<JobEntity>;
}

export function JobTableRowActions({ row }: JobTableRowActionsProps) {
  const updateMode = useJobStore((store) => store.updateMode);
  const updateCurrentRow = useJobStore((store) => store.updateCurrentRow);
  const onEditRow = () => {
    updateMode(JobEditorMode.Edit);
    updateCurrentRow(row.original);
  };

  const onViewRow = () => {
    updateMode(JobEditorMode.View);
    updateCurrentRow(row.original);
  };

  const onDeleteRow = () => {};

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={onViewRow}>
          查看
          <DropdownMenuShortcut>
            <View size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEditRow}>
          修改
          <DropdownMenuShortcut>
            <UserPen size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          复制
          <DropdownMenuShortcut>
            <Copy size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>
          删除
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
