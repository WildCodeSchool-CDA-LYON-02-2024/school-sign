"use client";

import ClassWithSignatures from "@/components/ClassWithSignatures/ClassWithSignatures";
import { Separator } from "@/components/ui/separator";

export default function TeacherClass() {
  return (
    <div className="space-y-6 px-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
        <p className="text-muted-foreground">Consult School Classes.</p>
      </div>
      <Separator />
      <ClassWithSignatures />
    </div>
  );
}
