import { MoreHorizontal } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
  onView?: (data: TData) => void;
  actions?: Array<{
    label: string;
    onClick: (data: TData) => void;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: "default" | "destructive";
  }>;
}

/**
 * 数据表格行操作组件
 *
 * 功能特性：
 * - 通用的行操作菜单
 * - 支持编辑、删除、查看等常用操作
 * - 支持自定义操作
 * - 支持图标和变体样式
 */
export function DataTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
  onView,
  actions = [],
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {onView && (
          <DropdownMenuItem onClick={() => onView(row.original)}>
            查看详情
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            编辑
          </DropdownMenuItem>
        )}

        {/* 自定义操作 */}
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(row.original)}
            className={
              action.variant === "destructive"
                ? "text-red-600 focus:text-red-600 focus:bg-red-50"
                : ""
            }
          >
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            {action.label}
          </DropdownMenuItem>
        ))}

        {(onEdit || onView || actions.length > 0) && onDelete && (
          <DropdownMenuSeparator />
        )}

        {onDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(row.original)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            删除
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
