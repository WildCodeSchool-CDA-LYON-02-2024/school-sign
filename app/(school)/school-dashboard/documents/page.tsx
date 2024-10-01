import AttendanceSheet from "@/components/docs/AttendanceSheet";
import { Separator } from "@/components/ui/separator";

export default function Docs() {
  return (
    <>
      <div className="space-y-6 px-10 lg:px-0 pb-16 md:block">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Generate an attendance sheet.</p>
        </div>
        <Separator />
        <div className="flex flex-col items-center justify-center gap-6">
          <AttendanceSheet />
        </div>
      </div>
    </>
  );
}
