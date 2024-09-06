"use client";

// next
import Link from "next/link";

// components
import { LogoIcon } from "@/components/icons/logo";
import { SchoolIcon } from "@/components/icons/SchoolIcon";

import { Button } from "@/components/ui/button";
import { TeacherIcon } from "@/components/icons/TeacherIcon";
import { StudentIcon } from "@/components/icons/StudentIcon";

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center h-screen flex-col gap-4 p-4 md:p-36">
        <LogoIcon size={250} />
        <Button className="bg-purple text-seasame w-40" variant="outline">
          <Link href="/school-login" className="flex">
            <SchoolIcon className="w-5 mr-2" />
            School
          </Link>
        </Button>
        <Button className="bg-purple text-seasame w-40" variant="outline">
          <Link href="/teacher-login" className="flex">
            <TeacherIcon className="w-5 mr-2" />
            Teacher
          </Link>
        </Button>
        <Button className="bg-purple text-seasame w-40" variant="outline">
          <Link href="/student-login" className="flex">
            <StudentIcon className="w-5 mr-2" />
            Student
          </Link>
        </Button>
      </div>
    </div>
  );
}
