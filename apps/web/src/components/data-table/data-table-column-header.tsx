"use client";
import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

interface ColumnSorterProps {
  column: Column<any, any>;
}

const ColumnSorter = (props: ColumnSorterProps) => {
  const { column } = props;
  return (
    <div className="flex flex-col items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-chevrons-up-down"
      >
        <path
          d="m7 15 5 5 5-5z"
          fill={
            column.getIsSorted() === "desc"
              ? "hsl(var(--primary))"
              : "hsl(var(--input))"
          }
          stroke={
            column.getIsSorted() === "desc"
              ? "hsl(var(--primary))"
              : "hsl(var(--input))"
          }
        />
        <path
          d="m7 9 5-5 5 5Z"
          fill={
            column.getIsSorted() === "asc"
              ? "hsl(var(--primary))"
              : "hsl(var(--input))"
          }
          stroke={
            column.getIsSorted() === "asc"
              ? "hsl(var(--primary))"
              : "hsl(var(--input))"
          }
        />
      </svg>
    </div>
  );
};

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent [&_svg]:size-4"
        onClick={() => column.toggleSorting()}
      >
        <span>{title}</span>
        <ColumnSorter column={column} />
      </Button>
    </div>
  );
}
