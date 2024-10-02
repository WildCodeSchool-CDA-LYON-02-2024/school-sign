"use client";

// components
import { Separator } from "@/components/ui/separator";
import CalendarTest from "@/components/calendar/CalendarTest";

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
          <CalendarTest />
          {/*<Calendar />*/}
        </div>
      </div>
    </>
  );
}
