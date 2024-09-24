"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Class = {
  id: string;
  lastname: string;
  firstname: string;
  email: string;
  signature: "pending" | "processing" | "success" | "failed";
};

export const columns: ColumnDef<Class>[] = [
  {
    accessorKey: "lastname",
    header: "Lastname",
  },
  {
    accessorKey: "firstname",
    header: "Firstname",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "signature",
    header: "Signature",
  },
];
