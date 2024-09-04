"use client";

import { useEffect, useState } from "react";
import SideNav from "@/components/Navigation/SideNav";
import BottomNav from "@/components/Navigation/BottomNav";
import {
  BackpackIcon,
  FileTextIcon,
  GearIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import { NavLink } from "@/components/Navigation/navTypes";

export default function Page() {
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
        {isMobile ? <BottomNav links={links} /> : <SideNav links={links} />}
      </nav>
    </>
  );
}
