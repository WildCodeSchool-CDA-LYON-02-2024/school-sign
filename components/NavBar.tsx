"use client";

import {
  BackpackIcon,
  FileTextIcon,
  GearIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nav = [
    {
      name: "Home",
      icon: <HomeIcon />,
    },
    {
      name: "Teachers",
      icon: <BackpackIcon />,
    },
    {
      name: "Documents",
      icon: <FileTextIcon />,
    },
    {
      name: "Settings",
      icon: <GearIcon />,
    },
  ];

  return (
    <Menubar className="h-auto border-none shadow-none rounded-none">
      {nav.map((el, index) => (
        <MenubarMenu key={index}>
          <Link href={`/${el.name.toLowerCase()}`}>
            <MenubarTrigger className="flex-col text-muted-foreground cursor-pointer">
              {el.icon}
              <small>{el.name}</small>
            </MenubarTrigger>
          </Link>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
