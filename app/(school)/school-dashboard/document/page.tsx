"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DocumentPage() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("/api/documents");
        if (res.ok) {
          const data = await res.json();
          setDocuments(data);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching documents"
          );
        }
      } catch (err: any) {
        console.error("Request Error:", err);
        setError(err.message);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <Link href="/school-dashboard/document/addDocument">
        <Button>Add Document</Button>
      </Link>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {documents?.length > 0 ? (
          documents.map((doc: any) => <li key={doc.id}>{doc.name}</li>)
        ) : (
          <p>No documents available</p>
        )}
      </ul>
    </div>
  );
}
