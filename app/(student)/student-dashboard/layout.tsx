import "../../globals.css";
import React from "react";
import { ClassProvider } from "@/components/context/ClassContext";
import StudentNavBar from "@/components/navigation/StudentNavBar";
import { Toaster } from "@/components/ui/toaster";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="md:flex bg-seasame h-screen">
      <ClassProvider>
        <nav className="basis-1/6">
          <StudentNavBar />
        </nav>
        <main className="basis-5/6">{children}</main>
        <Toaster />
      </ClassProvider>
    </div>
  );
}
