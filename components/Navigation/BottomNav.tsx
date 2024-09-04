"use client";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";
import { NavProps } from "@/components/Navigation/navTypes";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function BottomNav({ links }: NavProps) {
  return (
    <Menubar className="justify-center items-center h-auto border-none shadow-none">
      {links.map((link, index) => (
        <MenubarMenu key={index}>
          <Link
            href={`/${link.name.toLowerCase()}`}
            className={cn(
              buttonVariants({ variant: link.variant, size: "lg" }),
              link.variant &&
                "flex flex-col items-center dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white h-full py-1 m-1",
            )}
          >
            {/*<MenubarTrigger className="flex-col cursor-pointer m-1">*/}
            <link.icon className="h-4 w-4" />
            <small>{link.name}</small>
            {/*</MenubarTrigger>*/}
          </Link>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
