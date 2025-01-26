"use client";

import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { JobEntity } from "@recruitment/schema";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "../data-table";
import { getJobs } from "@/lib/service/JobService";
import { formatDate } from "@recruitment/shared";
import AutoTooltip from "../auto-tooltip";
const JobTable = () => {
  const columns = useMemo<ColumnDef<JobEntity>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="岗位名称" />
        ),
        cell: ({ row }) => (
          <div className="w-[80px]">{row.getValue("name")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="岗位描述" />
        ),
        cell: ({ row }) => {
          return (
            <div className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              <AutoTooltip
                renderTooltip={(text) => <pre>{text}</pre>}
                text={row.getValue("description")}
              />
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="状态" />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex w-[100px] items-center">
              <span>{row.getValue("status")}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="创建时间" />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center">
              {formatDate(row.getValue("createdAt"))} {}
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="修改时间" />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center">
              {formatDate(row.getValue("updatedAt"))} {}
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        id: "actions",
        cell: ({ row }) => <></>,
      },
    ];
  }, []);

  return <DataTable columns={columns} loadData={getJobs} />;
};
export default JobTable;
