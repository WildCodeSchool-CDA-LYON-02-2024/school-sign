"use client";

// React
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { classSchema } from "@/lib/schemas/classSchema";

// UI components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useClassContext } from "../context/ClassContext";

export default function UpdateClassForm() {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { classId } = useClassContext();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await fetch(`/api/class?id=${classId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();

          setClassName(data.classSection.name || []);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching classes",
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      }
    };

    fetchClassData();
  }, [classId]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = classSchema.safeParse({ name });

    if (!result.success) {
      setError(
        "Invalid input: " +
          result.error.errors.map((e) => e.message).join(", "),
      );
      return;
    }
    setError(null);

    try {
      const res = await fetch(`/api/class?id=${classId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
        credentials: "include",
      });

      if (res.ok) {
        toast({
          className: "bg-green-400",
          description: "New class added",
          duration: 2000,
        });
        router.back();
      } else {
        toast({
          title: "An error occurred while adding the class",
          description: "Please try again later",
          duration: 2000,
        });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="text-center">Update Class</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdate}>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={className}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end items-center pt-6">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
