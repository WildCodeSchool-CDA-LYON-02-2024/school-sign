// components
import AddTeacherForm from "@/components/forms/addTeacherForm";

export default function SchoolDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
      <div className="flex items-center justify-center">
        <AddTeacherForm />
      </div>
    </>
  );
}
