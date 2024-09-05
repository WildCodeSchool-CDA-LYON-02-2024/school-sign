"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function GetAllClass() {
  const [classData, setClassData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex items-center justify-center">
      {error && <p className="text-red-500">{error}</p>}
      {classData.length > 0 ? (
        <ul>
          {classData.map((cls: any) => (
            <Card
              key={cls.id}
              className="w-96 mt-10 justify-center items-center"
            >
              <CardContent className="flex flex-col justify-center items-center">
                <button>{cls.name}</button>
              </CardContent>
            </Card>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
