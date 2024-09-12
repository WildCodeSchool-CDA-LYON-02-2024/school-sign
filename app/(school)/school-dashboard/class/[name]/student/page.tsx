"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useClassContext } from "@/components/context/ClassContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Student {
  id: number;
  firstname: string;
  lastname: string;
  role: string;
}

interface Teacher {
  id: number;
  firstname: string;
  lastname: string;
  role: string;
}

export default function StudentList({ params }: { params: { name: string } }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  const [loadingTeachers, setLoadingTeachers] = useState<boolean>(true);
  const { classId } = useClassContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teachers
        const teacherRes = await fetch(`/api/teacher?classid=${classId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (teacherRes.ok) {
          const teacherData = await teacherRes.json();
          setTeachers(teacherData.users || []);
        } else {
          const teacherErrorData = await teacherRes.json();
          setError(
            teacherErrorData.error ||
              "An error occurred while fetching teachers"
          );
        }
        setLoadingTeachers(false);

        // Fetch students
        const studentRes = await fetch(`/api/student?classid=${classId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (studentRes.ok) {
          const studentData = await studentRes.json();
          setStudents(studentData.users || []);
        } else {
          const studentErrorData = await studentRes.json();
          setError(
            studentErrorData.error ||
              "An error occurred while fetching students"
          );
        }
        setLoadingStudents(false);
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
        setLoadingStudents(false);
        setLoadingTeachers(false);
      }
    };

    fetchData();
  }, [classId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error && <p className="text-red-500">{error}</p>}

      {loadingStudents || loadingTeachers ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Display teachers */}
          <div className="flex items-center justify-center flex-col gap-4 p-4  w-full">
            <h2 className="text-xl font-bold">Teachers</h2>
            {teachers.length > 0 ? (
              <ul className="space-y-4">
                {teachers
                  .filter((teacher) => teacher.role === "TEACHER")
                  .map((teacher) => (
                    <li key={teacher.id}>
                      <Card className="w-96 mt-10 justify-center items-center">
                        <CardContent className="flex flex-col justify-center items-center">
                          <Link
                            href={`/school-dashboard/class/${params.name}/teacher/${teacher.id}`}
                          >
                            <button>
                              {`${teacher.firstname} ${teacher.lastname}`}
                            </button>
                          </Link>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No teachers found in this class.</p>
            )}
          </div>

          {/* Display students */}
          <div className="flex items-center justify-center flex-col gap-4 p-8 w-full">
            <h2 className="text-xl font-bold">Students</h2>
            {students.length > 0 ? (
              <ul className="space-y-4">
                {students
                  .filter((student) => student.role === "STUDENT")
                  .map((student) => (
                    <li key={student.id}>
                      <Card className="w-96 mt-10 justify-center items-center">
                        <CardContent className="flex flex-col justify-center items-center">
                          <Link
                            href={`/school-dashboard/class/${params.name}/student/${student.id}`}
                          >
                            <button>
                              {`${student.firstname} ${student.lastname}`}
                            </button>
                          </Link>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No students found in this class.</p>
            )}
          </div>
        </>
      )}

      <div className="flex items-center justify-center flex-col gap-4 p-4 md:p-36">
        <Link
          href={`/school-dashboard/class/${params.name}/student/addStudent`}
        >
          <Button className="bg-purple text-seasame" variant="outline">
            Add a new student
          </Button>
        </Link>
      </div>
    </div>
  );
}
