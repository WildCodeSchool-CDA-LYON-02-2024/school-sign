import "../../globals.css";
import React from "react";
import { ClassProvider } from "@/components/context/ClassContext";
import SchoolNavBar from "@/components/navigation/SchoolNavBar";
import { Toaster } from "@/components/ui/toaster";

export default function SchoolLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="sm:flex bg-seasame h-screen ">
      <ClassProvider>
        <nav>
          <SchoolNavBar />
        </nav>
        <main className="w-full scroll md:pr-10">
          <div className="h-full pt-8 w-full">{children}</div>
        </main>
        <Toaster />
      </ClassProvider>
    </div>
  );
}
