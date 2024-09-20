"use client";
// react
import { useState, useEffect } from "react";

// next
import Link from "next/link";

// context
import { useClassContext } from "@/components/context/ClassContext";

// component
import SelectMenu from "@/components/SelectMenu";

// ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
  classId?: string | null;
}

export default function StudentList({ params }: { params: { name: string } }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  const [loadingTeachers, setLoadingTeachers] = useState<boolean>(true);
  const { classId } = useClassContext();
  const { toast } = useToast();

  // Fetch all teachers for selection
  useEffect(() => {
    const fetchAllTeachers = async () => {
      try {
        const res = await fetch("/api/teacher", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setAllTeachers(data.users || []);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching teachers"
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchAllTeachers();
  }, []);

  // Fetch users by class (students and teachers)
  useEffect(() => {
    const fetchUsersByClass = async () => {
      try {
        const [teacherRes, studentRes] = await Promise.all([
          fetch(`/api/teacher?classid=${classId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }),
          fetch(`/api/student?classid=${classId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }),
        ]);

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
        setLoadingTeachers(false);
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
        setLoadingStudents(false);
        setLoadingTeachers(false);
      }
    };

    fetchUsersByClass();
  }, [classId]);

  const handleUpdate = async () => {
    if (!selectedTeacher) {
      setError("Please select a teacher.");
      return;
    }

    try {
      const res = await fetch(`/api/teacher?id=${selectedTeacher.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ classId }),
      });

      if (res.ok) {
        toast({
          className: "bg-green-400",
          description: "The teacher has been added to the class",
          duration: 2000,
        });
        
        const updatedTeacher = await res.json();

        // Update the list of teachers with the newly added teacher
        setTeachers((prevTeachers) =>
          prevTeachers.some((teacher) => teacher.id === updatedTeacher.id)
            ? prevTeachers.map((teacher) =>
                teacher.id === updatedTeacher.id ? updatedTeacher : teacher
              )
            : [...prevTeachers, updatedTeacher]
        );
        setSelectedTeacher(null);
        setError(null);
      } else {
        const errorData = await res.json();
        setError(
          errorData.error || "An error occurred while updating the teacher."
        );
      }
    } catch (err) {
      console.error("Request Error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error && <p className="text-red-500">{error}</p>}

      {loadingStudents || loadingTeachers ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Display teachers */}
          <div className="flex items-center justify-center flex-col gap-4 p-4 w-full">
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
              <div className="flex flex-col items-center justify-center ">
                <SelectMenu
                  selected={selectedTeacher}
                  setSelected={setSelectedTeacher}
                  options={allTeachers}
                  displayValue={(teacher) =>
                    `${teacher.firstname} ${teacher.lastname}`
                  }
                  label="Select a Teacher"
                />
                <Button onClick={handleUpdate} className="mt-4">
                  Update
                </Button>
              </div>
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
              <p>No student found in this class.</p>
            )}
          </div>
        </>
      )}

      {/* Add new student button */}
      <div className="flex items-center justify-center flex-col gap-4 p-4 md:p-10">
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
