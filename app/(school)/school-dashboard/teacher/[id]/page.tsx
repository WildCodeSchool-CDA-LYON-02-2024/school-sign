"use client";

// react
import { useState, useEffect } from "react";

// ui
import { Card, CardContent } from "@/components/ui/card";
import SelectMenu from "@/components/SelectMenu";

export default function StudentDetails({
  params,
}: {
  params: { id: string; className: string };
}) {
  const [teacher, setTeacher] = useState<any | null>(null);
  const [classData, setClassData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
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
          setLoading(false);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching the student"
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
  }, [params.id]);




  useEffect(() => {
    const fetchData = async () => {
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
      <SelectMenu setSelected={classData} />
    </div>
  );
}
