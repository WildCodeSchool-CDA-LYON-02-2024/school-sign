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
import { useToast } from "@/hooks/use-toast";

export default function AddClassForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = classSchema.safeParse({ name });

    if (!result.success) {
      setError("Invalid input: " + result.error.errors.map(e => e.message).join(", "));
      return;
    }
    setError(null);

    try {
      const res = await fetch("/api/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
        credentials: "include"
      });

      if (res.ok) {
        toast({
          title: "Success",
          className: "bg-green-400",
          description: "A new has been class added",
          duration: 5000,
        });
        router.back();
      } else {
        toast({
          title: "An error occurred while adding the class",
          description: "Please try again later",
          duration: 5000,
        });
      }
    } catch (err) {
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
            {error && <p className="text-red-500">{error}</p>} 
            <CardFooter className="flex justify-end">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
