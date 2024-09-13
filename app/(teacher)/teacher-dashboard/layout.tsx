import "../../globals.css";
import { ClassProvider } from "@/components/context/ClassContext";
import TeacherNavBar from "@/components/navigation/TeacherNavBar";
import { Toaster } from "@/components/ui/toaster";

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={" bg-seasame"}>
      <ClassProvider>
        <TeacherNavBar />
        <main>{children}</main>
        <Toaster />
      </ClassProvider>
    </div>
  );
}
