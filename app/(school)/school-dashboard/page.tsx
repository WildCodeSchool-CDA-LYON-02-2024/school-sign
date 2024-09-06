// next
import Link from "next/link";

// components
import Logout from "@/components/logout";

// ui
import { Button } from "@/components/ui/button";


export default function SchoolDashboard() {
  return (
    <>
      <Button className="bg-purple text-seasame" variant="outline">
        <Link href="/school-dashboard/class">Class</Link>
      </Button>
      <Button className="bg-purple text-seasame" variant="outline">
        <Link href="/school-dashboard/student">Student</Link>
      </Button>
      <Logout />;
    </>
  );
}
