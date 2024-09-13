// next
// components
// ui

import { DataTable } from "@/components/table/data-table";
import { columns, Payment } from "@/components/table/columns";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    // ...
  ];
}

export default async function TeacherDashboard() {
  const data = await getData();
  return (
    <>
      <div className="h-screen py-8 w-full">
        <h1 className="text-center">Teacher Dashboard</h1>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
