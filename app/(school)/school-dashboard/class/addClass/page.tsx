// components
import AddClassForm from "@/components/forms/addClassForm";

export default function SchoolDashboard() {
  return (
    <>
      <h1 className="text-center text-2xl pb-8">Add a Class</h1>
      <div className="flex items-center justify-center">
        <AddClassForm />
      </div>
    </>
  );
}
