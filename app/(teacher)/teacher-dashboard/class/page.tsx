"use client";

import ClassWithSignatures from "@/components/ClassWithSignatures/ClassWithSignatures";

export default function TeacherClass() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-center text-2xl pb-8">Teacher Class</h1>

      <ClassWithSignatures />
    </div>
  );
}
