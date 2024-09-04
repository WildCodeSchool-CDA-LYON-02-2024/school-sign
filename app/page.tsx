"use client";

// next
import Link from "next/link";

// components
import { LogoIcon } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center h-screen flex-col gap-4 p-4 md:p-36">
        <LogoIcon size={500} />
        <Button className="bg-purple text-seasame" variant="outline">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
