"use client";

// react
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/lib/schemas/loginSchema";

// next
import Link from "next/link";

// ui
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
import { useToast } from "@/hooks/use-toast";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err: z.ZodIssue) => err.message)
        .join(", ");
      toast({
        title: "Error",
        description: errorMessage,
        duration: 5000,
      });
      return;
    }

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      toast({
        title: "Login Successful",
        className: "bg-green-400",
        description: "Welcome back!",
        duration: 5000,
      });
      router.push("/student-dashboard");
    } else {
      toast({
        title: "Login failed",
        className: "bg-red-700 text-white",
        description: "Invalid email or password.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-96 mt-10 justify-center items-center">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your login details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
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
              <p>
                New here?
                <Button variant="link" asChild>
                  <Link href="/school-register">Click here to register</Link>
                </Button>
              </p>
            </div>
            <CardFooter className="flex justify-end">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}