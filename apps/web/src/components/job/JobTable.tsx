"use client";

import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { JobEntity } from "@recruitment/schema";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "../data-table";
import { getJobs } from "@/services/JobService";
import { formatDate } from "@recruitment/shared";
import AutoTooltip from "../auto-tooltip";
import { cn } from "@/lib/utils";
import { JobTableRowActions } from "./JobTableRowActions";

const JobTable = () => {
  const columns = useMemo<ColumnDef<JobEntity>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="岗位名称" />
        ),
        cell: ({ row }) => (
          <div className="w-[120px]">{row.getValue("name")}</div>
        ),
        meta: {
          className: cn(
            "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
            "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
            "sticky left-0 md:table-cell"
          ),
        },
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
            <div className="w-full max-h-20 font-medium sm:w-72 md:w-[36rem] lg:w-[48rem]">
              <AutoTooltip Wrapper="pre" text={row.getValue("description")} />
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
        meta: {
          className: "w-fit text-nowrap",
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
        meta: {
          className: "w-fit text-nowrap",
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        id: "actions",
        cell: ({ row }) => <JobTableRowActions row={row} />,
        meta: {
          className: "bg-background w-[40px] sticky right-0",
        },
      },
    ];
  }, []);

  return <DataTable columns={columns} loadData={getJobs} />;
};
export default JobTable;
