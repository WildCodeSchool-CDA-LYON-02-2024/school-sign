"use client";

import { Separator } from "@/components/ui/separator";
import Logout from "@/components/logout";
import { useIsMobile } from "@/hooks/useIsMobile";

// next
import Link from "next/link";

// ui
import { Button } from "@/components/ui/button";

export default function SchoolSettings() {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="space-y-6 px-10 pb-16 md:block">
        <div className="space-y-0.5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings.
              </p>
            </div>
            {isMobile && <Logout />}
          </div>
        </div>
        <Separator />

        <Button className="bg-purple text-seasame" variant="outline">
            <Link href="/school-dashboard/settings/profil">School informations</Link>
          </Button>
      </div>
    </>
  );
}
