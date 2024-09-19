"use client";

// react
import { useEffect, useState } from "react";
// components
import SideNav from "@/components/navigation/components/SideNav";
import BottomNav from "@/components/navigation/components/BottomNav";
import { NavLink } from "@/components/navigation/components/navTypes"; // ui
import {
  CalendarIcon,
  FileTextIcon,
  GearIcon,
  HomeIcon,
} from "@radix-ui/react-icons";

export default function StudentNavBar() {
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
      href: "/student-dashboard",
    },
    {
      name: "Schedule",
      icon: (props) => <CalendarIcon {...props} />,
      variant: "ghost",
      href: "/student-dashboard/schedule",
    },
    {
      name: "Documents",
      icon: (props) => <FileTextIcon {...props} />,
      variant: "ghost",
      href: "/documents",
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
      <nav>
        {isMobile ? <BottomNav links={links} /> : <SideNav links={links} />}
      </nav>
    </>
  );
}
