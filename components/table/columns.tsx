"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ClassCol = {
  id: string;
  lastname: string;
  firstname: string;
  email: string;
  signature: "pending" | "processing" | "success" | "failed";
};

export const columns: ColumnDef<ClassCol>[] = [
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
