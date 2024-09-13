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
    <div className={" bg-seasame"}>
      <ClassProvider>
        <StudentNavBar />
        <main>{children}</main>
        <Toaster />
      </ClassProvider>
    </div>
  );
}
