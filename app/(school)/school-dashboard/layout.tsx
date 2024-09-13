// Suppression des balises <html> et <body>
import "../../globals.css";
import { ClassProvider } from "@/components/context/ClassContext";
import NavigationBar from "@/components/navigation/NavigationBar";
import { Toaster } from "@/components/ui/toaster";

export default function SubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={" bg-seasame"}>
      <ClassProvider>
        <NavigationBar />
        <main>{children}</main>
        <Toaster />
      </ClassProvider>
    </div>
  );
}

