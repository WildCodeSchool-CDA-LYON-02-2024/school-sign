import { Separator } from "@/components/ui/separator";
import React from "react";

export default function SchoolDashboard() {
  return (
    <>
      <div className="space-y-6 pl-10 pb-16 md:block">
        <div className="space-y-0.5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          </div>
        </div>
        <Separator />
      </div>
    </>
  );
}
