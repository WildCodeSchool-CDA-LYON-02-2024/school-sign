"use client";

// react
import { useState, useEffect } from "react";

// next
import Link from "next/link";

// context
import { useClassContext } from "@/components/context/ClassContext";

// ui
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      <div className="space-y-6 pl-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Consult School Classes.</p>
        </div>
        <Separator />
        <div className="flex flex-col items-center justify-center gap-6">
          {error && <p className="text-red-500">{error}</p>}

          {loading ? (
            <p>Loading...</p>
          ) : classData.length > 0 ? (
            <ul>
              {classData.map((cls: any) => (
                <li key={cls.id}>
                  <Card className="w-40">
                    <CardHeader>
                      <CardTitle className="flex gap-2 flex-wrap justify-center">
                        <Link
                          href={`/school-dashboard/class/${cls.name}/student/`}
                        >
                          <button onClick={() => handleClassClick(cls.id)}>
                            {cls.name}
                          </button>
                        </Link>
                        <Link
                          href={`/school-dashboard/class/${cls.name}/update`}
                        >
                          <button onClick={() => handleClassClick(cls.id)}>
                            modify
                          </button>
                        </Link>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <p>No classes found.</p>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-4 p-4 md:p-10">
          <Button className="bg-purple text-seasame" variant="outline">
            <Link href="/school-dashboard/class/addClass">Add a new class</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
