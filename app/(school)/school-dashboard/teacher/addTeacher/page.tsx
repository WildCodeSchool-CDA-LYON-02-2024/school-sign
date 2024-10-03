// components
import AddTeacherForm from "@/components/forms/addTeacherForm";
import { Separator } from "@/components/ui/separator";

export default function SchoolDashboard() {
  return (
    <div className="w-full space-y-6 px-10 pb-16 md:block ">
      <h1 className="text-2xl font-bold tracking-tight ">Teachers</h1>
      <Separator />
      <div className="flex items-center justify-center mt-20">
        <AddTeacherForm />
      </div>
    </div>
  );
}
