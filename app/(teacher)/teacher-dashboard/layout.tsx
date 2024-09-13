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
        <TeacherNavBar />
        <main className="basis-4/5">{children}</main>
        <Toaster />
      </ClassProvider>
    </div>
  );
}
