"use client";

// react
import { useEffect, useState } from "react"; // next
import Link from "next/link"; // context
import { useClassContext } from "@/components/context/ClassContext"; // ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ClassList() {
  const [classData, setClassData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { setClassId } = useClassContext();

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
            errorData.error || "An error occurred while fetching classes",
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

  const handleClassClick = (id: number) => {
    setClassId(id);
  };

  return (
    <>
      <h1 className="text-center text-2xl pb-8">Teacher Class</h1>

      <div className="flex items-center justify-center">
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : classData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classData.map((cls: any) => (
              <Link
                key={cls.id}
                href={`/school-dashboard/class/${cls.name}/student/`}
                passHref
              >
                <Card
                  onClick={() => handleClassClick(cls.id)}
                  className="w-40 max-w-40 cursor-pointer"
                >
                  <CardContent>
                    <p>{cls.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p>No classes found.</p>
        )}
      </div>

      <div className="flex items-center justify-center flex-col gap-4 p-4 md:p-36">
        <Link href="/school-dashboard/class/addClass" passHref>
          <Button className="bg-purple text-seasame" variant="outline">
            Add a new class
          </Button>
        </Link>
      </div>
    </>
  );
}
