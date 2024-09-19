"use client";

// react
import { useEffect, useState } from "react";
// components
import SideNav from "@/components/navigation/components/SideNav";
import BottomNav from "@/components/navigation/components/BottomNav";
import { NavLink } from "@/components/navigation/components/navTypes"; // ui
import {
  BackpackIcon,
  FileTextIcon,
  GearIcon,
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

export default function SchoolNavBar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links: NavLink[] = [
    {
      name: "Home",
      icon: (props) => <HomeIcon {...props} />,
      variant: "default",
      href: "/school-dashboard",
    },
    {
      name: "Teacher",
      icon: (props) => <BackpackIcon {...props} />,
      variant: "ghost",
      href: "/school-dashboard/teacher",
    },
    {
      name: "Class",
      icon: (props) => <PersonIcon {...props} />,
      variant: "ghost",
      href: "/school-dashboard/class",
    },
    {
      name: "Documents",
      icon: (props) => <FileTextIcon {...props} />,
      variant: "ghost",
      href: "/school-dashboard/docs",
    },
    {
      name: "Settings",
      icon: (props) => <GearIcon {...props} />,
      variant: "ghost",
      href: "/settings",
    },
  ];

  return (
    <>
      <nav className="basis-1/5">
        {isMobile ? <BottomNav links={links} /> : <SideNav links={links} />}
      </nav>
    </>
  );
}
