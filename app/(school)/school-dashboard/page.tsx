// next
import Link from "next/link";

// components
import Logout from "@/components/logout";

// ui
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/navigation/NavigationBar";

export default function SchoolDashboard() {
  return (
    <>
      <NavigationBar />
      <div className=" mt-10 flex flex-col items-center justify-center h-screen">
        <Button className="bg-purple text-seasame" variant="outline">
          <Link href="/school-dashboard/class">Class</Link>
        </Button>
        <Logout />
      </div>
    </>
  );
}
