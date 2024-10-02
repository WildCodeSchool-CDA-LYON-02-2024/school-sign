"use client";

// react
import { useState, useEffect } from "react";

// next
import Link from "next/link";

// ui
import { Card, CardContent } from "@/components/ui/card";

export default function StudentDetails() {
  const [school, setSchool] = useState<any | null>(null);
  const [schoolId, setSchoolId] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(school);
  

  useEffect(() => {
    const fetchSchoolId = async () => {
      try {
        const response = await fetch("/api/getClassIdByToken");
        if (response.ok) {
          const data = await response.json();

          setSchoolId(data.user.schoolId);
        } else {
          console.error("Erreur lors de la récupération du classId");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du classId", error);
      }
    };

    fetchSchoolId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/school`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data, 'DATA');
          
          setSchool(data || null);
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
  }, [schoolId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {school ? (
            <Card className="w-96 mt-10 justify-center items-center relative">
              <CardContent className="flex flex-col justify-center items-center">
                {`Establishment name :${school.name}`}
              </CardContent>
              <CardContent className="flex flex-col justify-center items-center">
                {`Address :${school.address}`}
              </CardContent>
              <CardContent className="flex flex-col justify-center items-center">
                {`Zipcode : ${school.zipcode} - City : ${school.city}`}
              </CardContent>
              <Link
                className="absolute right-0 bottom-0 p-3"
                href={`/school-dashboard/settings/profil/update`}
              >
                <button>Update</button>
              </Link>
            </Card>
          ) : (
            <p>No student found with this ID.</p>
          )}
        </>
      )}
    </div>
  );
}