"use client";

// next
import { useRouter } from "next/navigation";
// ui
import { buttonVariants } from "@/components/ui/button";
import { ExitIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";
import { useToast } from "@/hooks/use-toast";

export default function Logout() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const res = await fetch("/api/logout", {
      method: "POST",
    });

    if (res.ok) {
      toast({
        className: "bg-green-400",
        description: "See you soon",
        duration: 2000,
      });
      router.push("/");
    } else {
      toast({
        title: "Logout Error",
        description: "Error during disconnection. Please try again.",
      });
    }
  };

  return (
    <>
      <Link
        href="#"
        onClick={handleLogout}
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "mt-3 bg-red-700 hover:bg-red-600 w-32",
        )}
      >
        <ExitIcon className="mr-2 h-4 w-4" />
        Logout
      </Link>
    </>
  );
}
