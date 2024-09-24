"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { columns, ClassCol } from "@/components/table/columns";

async function getData(): Promise<ClassCol[]> {}

export default function TeacherDashboard() {
  const [data, setData] = useState<ClassCol[]>([]);

  return (
    <>
      <h1 className="text-center text-2xl pb-8">Teacher Dashboard</h1>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
