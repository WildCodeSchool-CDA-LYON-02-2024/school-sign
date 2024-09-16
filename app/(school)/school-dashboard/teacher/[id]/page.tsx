"use client";

// react
import { useState, useEffect } from "react";

// next
import Link from "next/link";

// component
import SelectMenu from "@/components/SelectMenu";

// ui
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Teacher {
  firstname: string;
  lastname: string;
  email: string;
  classId?: string | null;
}

interface ClassSection {
  id: string;
  name: string;
}

export default function StudentDetails({
  params,
}: {
  params: { id: string; className: string };
}) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classData, setClassData] = useState<ClassSection[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassSection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await fetch(`/api/student?id=${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setTeacher(data.user || null);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching the student."
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [params.id]);

  // Fetch class data
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await fetch("/api/class", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setClassData(data.classSections || []);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching classes."
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      }
    };

    fetchClassData();
  }, []);

  // Function to get the class name based on teacher's classId
  const getClassName = () => {
    if (teacher?.classId && classData.length > 0) {
      const classSection = classData.find((cls) => cls.id === teacher.classId);
      return classSection ? classSection.name : "Class not found";
    }
    return null;
  };

  const className = getClassName();

  const handleUpdate = async () => {
    if (!selectedClass) {
      setError("Please select a class.");
      return;
    }

    try {
      const res = await fetch(`/api/teacher?id=${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ classId: selectedClass.id }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          className: "bg-green-400",
          description: "The teacher has been assigned to the selected class",
          duration: 5000,
        });
        const updatedTeacher = await res.json();
        setTeacher(updatedTeacher);
        setError(null);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "An error occurred while updating the class.");
      }
    } catch (err) {
      console.error("Request Error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {teacher ? (
            <Card className="w-96 mt-10 justify-center items-center">
              <CardContent className="flex flex-col justify-center items-center">
                {`${teacher.firstname}`}
              </CardContent>
              <CardContent className="flex flex-col justify-center items-center">
                {`${teacher.lastname}`}
              </CardContent>
              <CardContent className="flex flex-col justify-center items-center">
                {`${teacher.email}`}
              </CardContent>
            </Card>
          ) : (
            <p>No teacher found with this ID.</p>
          )}
        </>
      )}

      <div className="flex flex-col items-center justify-center mt-10">
        {teacher?.classId ? (
          <p>
            Assigned Class:{" "}
            <Link href={`/school-dashboard/class/${className}/student/`}>
              {getClassName()}
            </Link>
          </p>
        ) : (
          <>
            <SelectMenu
              selected={selectedClass}
              setSelected={setSelectedClass}
              options={classData}
              displayValue={(classSection) => classSection.name} 
              label="Select a Class"
            />
            <Button onClick={handleUpdate} className="mt-4">
              Update
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
