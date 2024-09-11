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
  const { Role } = useUserContext();

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
    },
    {
      name: "Teachers",
      icon: (props) => <BackpackIcon {...props} />,
      variant: "ghost",
    },
    {
      name: "Documents",
      icon: (props) => <FileTextIcon {...props} />,
      variant: "ghost",
    },
    {
      name: "Settings",
      icon: (props) => <GearIcon {...props} />,
      variant: "ghost",
    },
  ];
  return (
    <>
      <nav>
        {!user ? (
          <Link href="#" />
        ) : (
          <>
            {isMobile ? <BottomNav links={links} /> : <SideNav links={links} />}
          </>
        )}
        {/*<ul>*/}
        {/*  {!user ? (*/}
        {/*    <li>*/}
        {/*      <Link href="/login">Login</Link>*/}
        {/*    </li>*/}
        {/*  ) : (*/}
        {/*    <>*/}
        {/*      <li>*/}
        {/*        <Link href="/">Home</Link>*/}
        {/*      </li>*/}
        {/*      {user.role === "SCHOOL" && (*/}
        {/*        <li>*/}
        {/*          <Link href="/school">School Dashboard</Link>*/}
        {/*        </li>*/}
        {/*      )}*/}
        {/*      {user.role === "TEACHER" && (*/}
        {/*        <li>*/}
        {/*          <Link href="/teacher">Teacher Dashboard</Link>*/}
        {/*        </li>*/}
        {/*      )}*/}
        {/*      {user.role === "STUDENT" && (*/}
        {/*        <li>*/}
        {/*          <Link href="/student">Student Dashboard</Link>*/}
        {/*        </li>*/}
        {/*      )}*/}
        {/*      <li>*/}
        {/*        <Link href="/profile">Profile</Link>*/}
        {/*      </li>*/}
        {/*      <li>*/}
        {/*        <Link href="/logout">Logout</Link>*/}
        {/*      </li>*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*</ul>*/}
      </nav>
    </>
  );
}
