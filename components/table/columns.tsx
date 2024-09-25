"use client";

// tanstack
import { ColumnDef } from "@tanstack/react-table";

// ui
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import {
  CheckCircledIcon,
  Cross2Icon,
  LapTimerIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: LapTimerIcon,
  },
  {
    value: "processing",
    label: "Processing",
    icon: UpdateIcon,
  },
  {
    value: "received",
    label: "Received",
    icon: CheckCircledIcon,
  },
  {
    value: "failed",
    label: "Failed",
    icon: Cross2Icon,
  },
];

export type ClassCol = {
  id: string;
  lastname: string;
  firstname: string;
  email: string;
  signature: "pending" | "processing" | "received" | "failed";
};

export const columns: ColumnDef<ClassCol>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lastname" />
    ),
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Firstname" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "signature",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Signature" />
    ),
  },
];
