"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Signature {
  userId: string;
  hashedSign: string;
}

interface Student {
  id: string;
  firstname: string;
  lastname: string;
  role: string;
}

interface ClassSection {
  id: number;
  name: string;
}

interface SchoolDetails {
  name: string;
  address: string;
}

export default function ClassWithSignatures() {
  const [students, setStudents] = useState<Student[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [classId, setClassId] = useState<number | null>(null);
  const [schoolDetails, setSchoolDetails] = useState<{
    name: string;
    address: string;
    zipcode: string;
    city: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassId = async () => {
      const response = await fetch("/api/getClassIdByToken");
      if (response.ok) {
        const data = await response.json();
        setClassId(data.classId);
      } else {
        console.error("Erreur lors de la récupération du classId");
      }
    };
    fetchClassId();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await fetch("/api/class");
      const data = await res.json();
      setClasses(data.classSections || []);
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const res = await fetch("/api/school"); // API pour récupérer les détails de l'école
        const data = await res.json();
        setSchoolDetails(data); // En supposant que l'API retourne les détails sous forme d'objet
      } catch (error) {
        console.error("Error fetching school details:", error);
      }
    };
    fetchSchoolDetails();
  }, []);

  useEffect(() => {
    const fetchAllStudents = async () => {
      if (classId) {
        console.log(`Fetching students for classId: ${classId}`);
        try {
          const res = await fetch(`/api/student?classid=${classId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            console.log("Response data:", data);
            if (data.users && data.users.length > 0) {
              setStudents(data.users);
            } else {
              console.warn("No students found in the response.");
              setStudents([]);
            }
          } else {
            const errorData = await res.json();
            console.error("Error fetching students:", errorData);
            setError(errorData.error || "An error occurred while fetching students");
          }
        } catch (err) {
          console.error("Request Error:", err);
          setError("An unexpected error occurred. Please try again later.");
        }
      }
    };
    fetchAllStudents();
  }, [classId]);

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const res = await fetch("/api/signature");
        const data = await res.json();
        setSignatures(data.signs || []);
      } catch (error) {
        console.error("Error fetching signatures:", error);
      }
    };
    fetchSignatures();
  }, []);

  const findSignatureForStudent = (studentId: string) => {
    const signature = signatures.find((sig) => sig.userId === studentId);
    return signature ? signature.hashedSign : null;
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    page.drawText("Feuille d'émargement", {
      x: width / 2 - 50,
      y: height - 150,
      size: fontSize + 4,
      font,
      color: rgb(0, 0, 0),
    });

    // Ajout des détails de l'école
    if (schoolDetails) {
      page.drawText(schoolDetails.name, {
        x: 50,
        y: height - 50,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(schoolDetails.address, {
        x: 50,
        y: height - 65,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`${schoolDetails.zipcode} ${schoolDetails.city}`, {
        x: 50,
        y: height - 80,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }
    page.drawText("Nom", {
      x: 100,
      y: height - 240,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("Signature", {
      x: 400,
      y: height - 240,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    let yPosition = height - 260;
    const rowHeight = 50;

    for (const [index, student] of students.entries()) {
      if (student.role === "STUDENT") {
        page.drawText(`${student.firstname} ${student.lastname}`, {
          x: 100,
          y: yPosition,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        const studentSignature = findSignatureForStudent(student.id);

        if (studentSignature) {
          try {
            const response = await fetch(studentSignature);
            if (!response.ok)
              throw new Error(`Failed to fetch signature: ${response.statusText}`);
            const signatureImageBytes = await response.arrayBuffer();
            const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
            const signatureDims = signatureImage.scale(0.4);

            page.drawImage(signatureImage, {
              x: 400,
              y: yPosition - 25,
              width: signatureDims.width,
              height: signatureDims.height,
            });
          } catch (error) {
            console.error("Error loading signature image:", error);
            page.drawText("Signature non disponible", {
              x: 400,
              y: yPosition,
              size: fontSize,
              font,
              color: rgb(1, 0, 0),
            });
          }
        } else {
          page.drawText("Signature absente", {
            x: 400,
            y: yPosition,
            size: fontSize,
            font,
            color: rgb(1, 0, 0),
          });
        }

        yPosition -= rowHeight;
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "feuille_demargement.pdf";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      {students.length > 0 ? (
        <ul className="space-y-4">
          {students
            .filter((student) => student.role === "STUDENT")
            .map((student: Student) => (
              <li key={student.id}>
                <Card className="w-80 justify-center items-center">
                  <CardContent className="flex flex-col justify-center items-center">
                    <p>{`Name: ${student.firstname} ${student.lastname}`}</p>
                    {findSignatureForStudent(student.id) ? (
                      <div className="mt-4">
                        <Image
                          src={findSignatureForStudent(student.id) || ""}
                          alt={`Signature de ${student.firstname} ${student.lastname}`}
                          width={600}
                          height={500}
                        />
                      </div>
                    ) : (
                      <p className="mt-4 text-red-500">Aucune signature reçue.</p>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
        </ul>
      ) : (
        <p>Aucun étudiant trouvé pour cette classe.</p>
      )}

      {/* Button to generate PDF */}
      <Button onClick={generatePDF}>Générer PDF</Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
