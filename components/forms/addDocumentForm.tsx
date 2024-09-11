"use client";

// ui components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AddDocumentForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get("file");
    console.log(file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        console.log("File uploaded successfully:", result);
      } else {
        const error = await response.json();
        console.error("File upload failed:", error);
      }
    } catch (error) {
      console.error("An error occurred while uploading the file:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Document</CardTitle>
        <CardDescription>Add a new document to the database</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Label>File</Label>
          <Input name="file" type="file" />
          <button type="submit">Upload</button>
        </form>
      </CardContent>
    </Card>
  );
}
