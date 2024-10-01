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
        <nav>
          <StudentNavBar />
        </nav>
        <main className="basis-11/12 scroll md:pr-10">
          <div className="h-screen py-8 w-full">{children}</div>
        </main>
        <Toaster />
      </ClassProvider>
    </div>
  );
}
