"use client";

// components
import CalendarTest from "@/components/calendar/CalendarTest";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Calendar from "@/components/calendar/Calendar";

export default function TeacherSchedule() {
  return (
    <>
      <div className="space-y-6 px-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        </div>
        <Separator />
        <div className="w-full pt-6">
          {/* <OldCalendar /> */}
          {/*<CalendarTest />*/}
          <Calendar />
        </div>
      </div>
    </>
  );
}
