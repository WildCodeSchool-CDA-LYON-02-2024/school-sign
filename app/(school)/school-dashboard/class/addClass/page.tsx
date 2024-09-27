// components
import AddClassForm from "@/components/forms/addClassForm";

export default function SchoolDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Add a Class</h1>
      <div className="flex items-center justify-center">
        <AddClassForm />
      </div>
    </>
  );
}
