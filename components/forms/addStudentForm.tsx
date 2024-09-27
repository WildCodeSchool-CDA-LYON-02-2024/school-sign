"use client";

// react
import { useState } from "react";

// next
import { useRouter } from "next/navigation";

// context
import { useClassContext } from "@/components/context/ClassContext";

// ui
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AddStudentForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { classId } = useClassContext();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      console.log(res);

      if (res.ok) {
        toast({
          className: "bg-green-400",
          description: "Student added",
          duration: 2000,
        });
        router.back();
      } else {
        // toast({
        //   className: "bg-red-500",
        //   description: "Email already in use",
        //   duration: 2000,
        // });
        const errorData = await res.json();
        console.log(errorData.details);

        if (errorData.error) {
          setError(errorData.error);
        } else if (res.status === 409) {
          setError("The email is already associated with another student.");
        } else if (res.status === 400) {
          setError("Invalid input data. Please check the form fields.");
        } else {
          setError("An error occurred while adding the student.");
        }
      }
    } catch (err) {
      console.error("Request Error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-96 mt-10">
        <CardHeader>
          <CardTitle className="text-center">Add a Student</CardTitle>
        </CardHeader>
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
            <div className="flex justify-end items-center pt-6">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
