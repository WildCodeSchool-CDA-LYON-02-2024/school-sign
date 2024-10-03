"use client";

// react
import { useState, useEffect } from "react";
import React from "react";

// next
import Link from "next/link";
import { useParams } from "next/navigation";

// ui
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function StudentDetails() {
  const [student, setStudent] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams<{ id: string; name: string }>() || null;

  const id = params?.id || null;
  const className = params?.name || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/student?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setStudent(data.user || null);
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
  }, [id]);

  return (
    <div className="h-full w-full px-10 pb-16 ">
      <div className="space-y-0.5 ">
        <h1 className="text-2xl font-bold tracking-tight pb-6">Informations</h1>
        <Separator />
      </div>
      <div className="flex flex-col items-center justify-center ">
        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {student ? (
              <Card className=" mt-10 flex flex-col justify-center items-center relative p-10 sm:w-full  md:w-8/12 lg:w-6/12  sm:p-5 md:p-7">
                <div className="flex sm:flex-col md:flex-row p-6 md:w-10/12 sm:items-center  md:text-left  sm:text-center">
                  <CardContent className="h-8 p-0 md:w-6/12 md:pl-14">
                    {`Firstname :`}
                  </CardContent>
                  <CardContent className="h-8 w-6/12 p-0 overflow-x-scroll">
                    {`${student.firstname}`}
                  </CardContent>
                </div>
                <div className="flex sm:flex-col md:flex-row p-6 md:w-10/12 sm:items-center  md:text-left  sm:text-center">
                  <CardContent className="h-8 p-0 md:w-6/12 md:pl-14">
                    {`Lastname :`}
                  </CardContent>
                  <CardContent className="h-8 w-6/12 p-0 overflow-x-scroll">
                    {`${student.lastname}`}
                  </CardContent>
                </div>
                <div className="flex  sm:flex-col md:flex-row p-6 md:w-10/12 sm:items-center  md:text-left  sm:text-center">
                  <CardContent className="h-8 p-0 md:w-6/12 md:pl-14">
                    {`Email :`}
                  </CardContent>
                  <CardContent className="w-6/12 p-0 h-8 overflow-x-scroll">
                    {`${student.email}`}
                  </CardContent>
                </div>

                <Link
                  className="absolute right-0 bottom-0 p-3"
                  href={`/school-dashboard/class/${className}/student/${student.id}/update`}
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
    </div>
  );
}
