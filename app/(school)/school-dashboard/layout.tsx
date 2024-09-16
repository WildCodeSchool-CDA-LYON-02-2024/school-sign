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
    <div className="md:flex bg-seasame h-screen">
      <ClassProvider>
        <SchoolNavBar />
        <main className="basis-4/5">{children}</main>
        <Toaster />
      </ClassProvider>
    </div>
  );
}
