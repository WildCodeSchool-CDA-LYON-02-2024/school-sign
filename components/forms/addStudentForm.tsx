"use client";

// react
import { useState } from "react";

// next
import { useRouter } from "next/navigation";

// context
import { useClassContext } from "@/components/context/ClassContext";

// ui
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddStudentForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { classId } = useClassContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!classId) {
      setError("Class ID is missing");
      return;
    }

    try {
      const res = await fetch("/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
          classId,
        }),
        credentials: "include",
      });

      if (res.ok) {
        alert("Student added successfully");
        router.back();
      } else {
        const errorData = await res.json();
        setError(
          errorData.error || "An error occurred while adding the student"
        );
      }
    } catch (err) {
      console.error("Request Error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-96 mt-10">
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="firstname">Firstname</Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
              <Label htmlFor="lastname">Lastname</Label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <CardFooter>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
