import "../../globals.css";
import React from "react";
import { ClassProvider } from "@/components/context/ClassContext";
import TeacherNavBar from "@/components/navigation/TeacherNavBar";
import { Toaster } from "@/components/ui/toaster";

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="md:flex bg-seasame h-screen">
      <ClassProvider>
        <nav>
          <TeacherNavBar />
        </nav>
        <main className="basis-5/6 scroll">
          <div className="h-screen py-8 w-full">{children}</div>
        </main>
        <Toaster />
      </ClassProvider>
    </div>
  );
}
