"use client";

// react
import { useState, useEffect } from "react";

// next
import Link from "next/link";

// ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ClassList() {
  const [classData, setClassData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
          console.log(data, "data class");
          
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        {error && <p className="text-red-500">{error}</p>}
        
        {loading ? ( 
          <p>Loading...</p>
        ) : classData.length > 0 ? (
          <ul className="space-y-4">
            {classData.map((cls: any) => (
              <li key={cls.id}>
                <Card className="w-40 justify-center items-center">
                  <CardContent className="flex flex-col justify-center items-center">
                    <Link href={`/school-dashboard/class/${cls.name}/student/`}>
                      <button>{cls.name}</button>
                    </Link>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p>No classes found.</p>
        )}
      </div>

      <div className="flex items-center justify-center  flex-col gap-4 p-4 md:p-36">
        <Button className="bg-purple text-seasame" variant="outline">
          <Link href="/school-dashboard/class/addClass">Add a new class</Link>
        </Button>
      </div>
    </div>
  );
}
