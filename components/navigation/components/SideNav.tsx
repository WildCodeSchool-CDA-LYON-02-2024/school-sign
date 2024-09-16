"use client";

// next
import Link from "next/link";

// ui
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NavProps } from "@/components/navigation/components/navTypes";
import Logout from "@/components/logout";

export default function SideNav({ links }: NavProps) {
  return (
    <>
      <div className="flex flex-col items-center gap-2 py-8 px-4 border-r h-screen w-fit">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              buttonVariants({ variant: link.variant, size: "sm" }),
              link.variant &&
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white w-32",
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.name && (
              <span
                className={cn(
                  "mr-auto",
                  link.variant === "default" &&
                    "text-background dark:text-white",
                )}
              >
                {link.name}
              </span>
            )}
          </Link>
        ))}
        <Logout />
      </div>
    </>
  );
}
