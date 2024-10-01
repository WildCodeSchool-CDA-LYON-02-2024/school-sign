import { Separator } from "@/components/ui/separator";
import Logout from "@/components/logout";

export default function SchoolDashboard() {
  return (
    <>
      <div className="space-y-6 px-10 lg:px-0 pb-16 md:block">
        <div className="space-y-0.5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          </div>
        </div>
        <Separator />
      </div>
    </>
  );
}
