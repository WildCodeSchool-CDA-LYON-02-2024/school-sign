"use client";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";
import { NavProps } from "@/components/Navigation/navTypes";

export default function BottomNav({ links }: NavProps) {
  return (
    <Menubar className="flex justify-center h-auto border-none shadow-none rounded-none">
      {links.map((link, index) => (
        <MenubarMenu key={index}>
          <Link href={`/${link.name.toLowerCase()}`}>
            <MenubarTrigger className="text-muted-foreground cursor-pointer flex-col text-center">
              <link.icon className="mr-2 h-4 w-4" />
              <small>{link.name}</small>
            </MenubarTrigger>
          </Link>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
