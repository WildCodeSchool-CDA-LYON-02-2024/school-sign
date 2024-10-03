"use client";

// components
import CalendarTest from "@/components/calendar/CalendarTest";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function StudentSchedule() {
  return (
    <>
      <div className="h-full w-full px-10 pb-16">
        <div className="space-y-0.5 pb-6">
          <h1 className="text-2xl font-bold tracking-tight pb-6">Schedule</h1>
        <Separator />
        </div>
        <div className="flex flex-col items-center justify-center gap-6">
          <CalendarTest />
        </div>
      </div>
    </>
  );
}
