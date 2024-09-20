"use client";

// components
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderIcon } from "@/components/icons/FolderIcon";

// ui
import { Pencil1Icon } from "@radix-ui/react-icons";
import { CardEl } from "@/components/documents/cardTypes";

export default function TeacherDocuments() {
  const documents: CardEl[] = [
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
    <>
      <h1 className="text-center text-2xl pb-8">Teacher Documents</h1>
      <div className="grid gap-6 px-6 justify-center xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {documents.map((document, index) => (
          <Card key={index} className="cursor-pointer max-w-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <FolderIcon className="w-8" />
              <CardTitle className="text-md font-normal">
                {document.name}
              </CardTitle>
              <Pencil1Icon />
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
