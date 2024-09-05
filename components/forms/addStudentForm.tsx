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

export default function AddStudentForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // For error handling
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate input data using Zod
    const result = classSchema.safeParse({ name });

    if (!result.success) {
      setError(
        "Invalid input: " + result.error.errors.map((e) => e.message).join(", ")
      );
      return;
    }

    // Reset error if validation passes
    setError(null);

    try {
      // Send the data to the API
      const res = await fetch("/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No need to manually set the Authorization header if using cookies
        },
        body: JSON.stringify(result.data),
        credentials: "include", // Ensure cookies are sent with the request
      });

      if (res.ok) {
        alert("Student added successfully");
        router.push("/school/student");
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
          <CardTitle>Nouvel élève</CardTitle>
          <CardDescription>Ajoutez un nouvel élève</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="firstname">Firstname</Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
              <Label htmlFor="lastname">Lastname</Label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
              <Label htmlFor="name">Name</Label>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="VictorSchoelcher@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* Displaying errors */}
            <CardFooter className="flex justify-end">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
