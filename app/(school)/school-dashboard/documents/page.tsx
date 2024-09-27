import AttendanceSheet from "@/components/docs/AttendanceSheet";

export default function Docs() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>

      <div className="flex flex-col items-center justify-center gap-6">
        <AttendanceSheet />
      </div>
    </>
  );
}
