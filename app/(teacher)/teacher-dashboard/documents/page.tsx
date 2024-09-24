"use client";

// components
import CardComponent from "@/components/card/CardComponent";
import { CardEl } from "@/components/card/cardTypes";

export default function TeacherDocuments() {
  const elements: CardEl[] = [
    {
      name: "Schooling contract",
    },
    {
      name: "Schooling certificate",
    },
    {
      name: "Attendance sheet",
    },
    {
      name: "Authorisation to leave",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-center text-2xl pb-8">Teacher Documents</h1>
      <div className="grid gap-6 px-6 justify-center xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CardComponent elements={elements} />
      </div>
    </div>
  );
}
