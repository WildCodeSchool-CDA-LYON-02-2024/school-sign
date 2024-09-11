"use client";

// react
import { useEffect, useState } from "react";
import { useUserContext } from "@/components/context/UserContext";

// components
import SideNav from "@/components/navigation/components/SideNav";
import BottomNav from "@/components/navigation/components/BottomNav";
import { NavLink } from "@/components/navigation/components/navTypes";

// ui
import {
  BackpackIcon,
  FileTextIcon,
  GearIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

export default function NavigationBar() {
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useUserContext();

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
      name: "Class",
      icon: (props) => <BackpackIcon {...props} />,
      variant: "ghost",
      href: "/school-dashboard/class",
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
    // ...(user?.role === "SCHOOL" || user?.role === "TEACHER"
    //   ? [
    //       {
    //         name: "Teachers",
    //         icon: (props) => <BackpackIcon {...props} />,
    //         variant: "ghost",
    //         href: "/teachers",
    //       },
    //     ]
    //   : []),
    // ...(user?.role === "SCHOOL" || user?.role === "STUDENT"
    //   ? [
    //       {
    //         name: "Documents",
    //         icon: (props) => <FileTextIcon {...props} />,
    //         variant: "ghost",
    //         href: "/documents",
    //       },
    //     ]
    //   : []),
    // ...(user?.role === "SCHOOL"
    //   ? [
    //       {
    //         name: "Settings",
    //         icon: (props) => <GearIcon {...props} />,
    //         variant: "ghost",
    //         href: "/settings",
    //       },
    //     ]
    //   : []),
  ];

  return (
    <>
      <nav>
        {/*{user?.role ? (*/}
        {/*  <>*/}
        {isMobile ? <BottomNav links={links} /> : <SideNav links={links} />}
        {/*  </>*/}
        {/*) : (*/}
        {/*  <Link href="#" />*/}
        {/*)}*/}
      </nav>
    </>
  );
}
