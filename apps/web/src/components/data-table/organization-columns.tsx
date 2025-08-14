import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Organization } from "@recruitment/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

/**
 * 组织管理表格列定义
 *
 * 特性：
 * - 选择列：支持单选和全选
 * - 排序列：组织名称、创建时间等支持排序
 * - 状态列：带颜色的状态标签
 * - 操作列：编辑、删除等行操作
 */
export const organizationColumns = (
  onEdit: (organization: Organization) => void,
  onDelete: (id: string) => void
): ColumnDef<Organization>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="全选"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="选择行"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="组织名称" />
    ),
    cell: ({ row }) => (
      <div className="font-medium max-w-[200px] truncate">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="组织编码" />
    ),
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return code ? (
        <code className="text-sm bg-muted px-1 py-0.5 rounded">{code}</code>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="状态" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
          {status === "ACTIVE" ? "启用" : "禁用"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "admin",
    header: "管理员",
    cell: ({ row }) => {
      const admin = row.getValue("admin") as Organization["admin"];
      return admin ? (
        <div className="flex items-center space-x-2">
          <span className="max-w-[120px] truncate">{admin.username}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">未设置</span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "userCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="用户数" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline">{row.getValue("userCount") || 0}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "departmentCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="部门数" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline">{row.getValue("departmentCount") || 0}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="创建时间" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={() => onEdit(row.original)}
        onDelete={() => onDelete(row.original.id)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
