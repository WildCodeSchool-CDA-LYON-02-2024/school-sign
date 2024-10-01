"use client";

// components
import CalendarTest from "@/components/calendar/CalendarTest";
import { Separator } from "@/components/ui/separator";

export default function TeacherSchedule() {
  return (
    <>
      <div className="space-y-6 pl-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        </div>
        <Separator />
        {/* <Calendar /> */}
        <div className="w-full pt-6 md:pr-10 lg:pr-24">
          <CalendarTest />
        </div>
      </div>
    </>
  );
}
