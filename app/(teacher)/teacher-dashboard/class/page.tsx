"use client";

import ClassWithSignatures from "@/components/ClassWithSignatures/ClassWithSignatures";

export default function TeacherClass() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold tracking-tight">Class</h1>
      <ClassWithSignatures />
    </div>
  );
}
