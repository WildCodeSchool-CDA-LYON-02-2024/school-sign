"use client";

// react
import { useState, useEffect } from "react";

//next
import Link from "next/link";

// ui
import { Card, CardContent } from "@/components/ui/card";

// context
import { useClassContext } from "@/components/context/ClassContext";

interface ClassSection {
  id: number;
  name: string;
}

export default function GetAllClass() {
  const [classData, setClassData] = useState<ClassSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setClassId } = useClassContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/getClass", {
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
            errorData.error || "An error occurred while fetching classes"
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleClassClick = (id: number) => {
    setClassId(id);
  };

  return (
    <div className="flex items-center justify-center">
      {error && <p className="text-red-500">{error}</p>}
      {classData.length > 0 ? (
        <ul className="space-y-4">
          {classData.map((cls) => (
            <li key={cls.id}>
              <Card className="w-96 mt-10 justify-center items-center">
                <CardContent className="flex flex-col justify-center items-center">
                  <button onClick={() => handleClassClick(cls.id)}>
                    <Link href="/school-dashboard/student/addStudent">
                      {cls.name}
                    </Link>
                  </button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
