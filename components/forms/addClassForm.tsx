"use client";

// React
import { useState } from "react";
import { useRouter } from "next/navigation";
import { classSchema } from "@/lib/schemas/classSchema";

// UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddClassForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null); // For error handling
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate input data using Zod
    const result = classSchema.safeParse({ name });

    if (!result.success) {
      setError("Invalid input: " + result.error.errors.map(e => e.message).join(", "));
      return;
    }

    // Reset error if validation passes
    setError(null);

    try {
      // Send the data to the API
      const res = await fetch("/api/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No need to manually set the Authorization header if using cookies
        },
        body: JSON.stringify(result.data),
        credentials: "include" // Ensure cookies are sent with the request
      });

      if (res.ok) {
        alert("Class added successfully");
        router.push("/school/class");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "An error occurred while adding the class");
      }
    } catch (err) {
      console.error("Request Error:", err); // Log error for debugging
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-96 mt-10 justify-center items-center">
        <CardHeader>
          <CardTitle>Nouvelle classe</CardTitle>
          <CardDescription>Ajoutez une nouvelle classe</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>} {/* Displaying errors */}
            <CardFooter className="flex justify-end">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
