import { useEffect, useState } from "react";

export default function PdfLink() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const response = await fetch("/api/documents");
        const documents = await response.json();
        if (documents.length > 0) {
          setPdfUrl(documents[0].url); // Assurez-vous de sélectionner le bon document
        }
      } catch (error) {
        console.error("Error fetching PDF URL:", error);
      }
    };

    fetchPdfUrl();
  }, []);

  if (!pdfUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
        Open PDF in new tab
      </a>
    </div>
  );
}
