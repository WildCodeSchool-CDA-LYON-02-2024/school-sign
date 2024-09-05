"use client";

// next
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center h-screen flex-col gap-4 p-4 md:p-36">
        <Button className="bg-purple text-seasame" variant="outline">
          <Link href="/school/class/addClass">Add a new class</Link>
        </Button>
      </div>
    </div>
  );
}