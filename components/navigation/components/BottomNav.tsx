"use client";

// next
import Link from "next/link";

// component
import { NavProps } from "@/components/navigation/components/navTypes";

// ui
import { cn } from "@/lib/utils";
import { Menubar, MenubarMenu } from "@/components/ui/menubar";
import { buttonVariants } from "@/components/ui/button";

export default function BottomNav({ links }: NavProps) {
  return (
    <Menubar className="fixed bottom-0 w-full justify-center items-center h-auto border-none shadow-none dark:bg-black">
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
            <link.icon className="h-4 w-4" />
            <small>{link.name}</small>
          </Link>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
