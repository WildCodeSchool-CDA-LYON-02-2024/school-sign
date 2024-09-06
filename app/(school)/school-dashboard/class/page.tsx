"use client";

// next
import Link from "next/link";

// ui
import { Button } from "@/components/ui/button";
import GetAllClass from "@/components/getClass";

// TODO: supprimer le composant et mettre la logique de getAllClass dans ce fichier

export default function ClassList() {

  return (
    <div>
      <GetAllClass/>
      <div className="flex items-center justify-center h-screen flex-col gap-4 p-4 md:p-36">
        <Button className="bg-purple text-seasame" variant="outline">
          <Link href="/school-dashboard/class/addClass">Add a new class</Link>
        </Button>
      </div>
    </div>
  );
}