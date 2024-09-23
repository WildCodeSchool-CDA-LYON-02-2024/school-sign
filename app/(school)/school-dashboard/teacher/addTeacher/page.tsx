// components
import AddTeacherForm from "@/components/forms/addTeacherForm";

export default function SchoolDashboard() {
  return (
    <>
      <h1 className="text-center text-2xl pb-8">School Teachers</h1>
      <div className="flex items-center justify-center">
        <AddTeacherForm />
      </div>
    </>
  );
}
