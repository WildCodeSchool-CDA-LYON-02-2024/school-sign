// next
import Link from "next/link";

// components
import Logout from "@/components/logout";

// ui
import { Button } from "@/components/ui/button";

export default function SchoolDashboard() {
  return (
    <>
      <div className=" flex flex-col items-center justify-center  h-screen">
        <Button className="bg-purple text-seasame" variant="outline">
          <Link href="/school-dashboard/class">Class</Link>
        </Button>
        <Button className="bg-purple text-seasame mt-10" variant="outline">
          <Link href="/school-dashboard/teacher">Teacher</Link>
        </Button>
        <Logout />
      </div>
    </>
  );
}
