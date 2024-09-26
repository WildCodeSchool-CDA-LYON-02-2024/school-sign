"use client";

import { Separator } from "@/components/ui/separator";
import Logout from "@/components/logout";

export default function TeacherSettings() {
  return (
    <>
      <div className="space-y-6 px-10 pb-16 md:block">
        <div className="space-y-0.5">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <Logout />
          </div>
          <p className="text-muted-foreground">Manage your account settings.</p>
        </div>
        <Separator />
      </div>
    </>
  );
}
