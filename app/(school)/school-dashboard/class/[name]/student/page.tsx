"use client";

// react
import { useState, useEffect } from "react";

// next
import Link from "next/link";

// ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentList({ params }: { params: { name: string } }) {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/student?classname=${params.name}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setStudents(data.users || []);
          setLoading(false);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching students"
          );
          setLoading(false);
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [params.name]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {students.length > 0 ? (
            <ul className="space-y-4">
              {students
                .filter((student: any) => student.role === "STUDENT")
                .map((student: any) => (
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
