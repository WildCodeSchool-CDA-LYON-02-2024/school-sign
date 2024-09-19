"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

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

export default function FeuilleDemargement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherName, setTeacherName] = useState("");
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [teachers, setTeachers] = useState<
    { id: string; firstname: string; lastname: string }[]
  >([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [schoolDetails, setSchoolDetails] = useState<{
    name: string;
    address: string;
    zipcode?: string;  // Utilisez 'zipcode' au lieu de 'zipCode'
    city: string;
  } | null>(null);

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      const res = await fetch("/api/school");
      const data = await res.json();
      console.log(data, 'DATA'); // Debug: check API response

      setSchoolDetails({
        name: data.name,
        address: data.address,
        zipcode: data.zipcode,  // Assurez-vous de correspondre au nom de la propriété renvoyée
        city: data.city,
      });
    };
    fetchSchoolDetails();
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
    const fetchTeachers = async () => {
      const res = await fetch("/api/teacher");
      const data = await res.json();
      setTeachers(data.users || []);
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const fetchStudents = async () => {
        const res = await fetch(`/api/student?classid=${selectedClass}`);
        const data = await res.json();
        setStudents(data.users || []);
      };
      fetchStudents();
    }
  }, [selectedClass]);

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

  useEffect(() => {
    // Update selectedClassName when selectedClass changes
    const classItem = classes.find((classItem) => classItem.id === parseInt(selectedClass));
    if (classItem) {
      setSelectedClassName(classItem.name);
    } else {
      setSelectedClassName(""); // Clear if not found
    }
  }, [selectedClass, classes]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setSelectedClass(classId);
  };

  const handleAddStudent = () => {
    setStudents([...students, { id: "", firstname: "", lastname: "", role: "STUDENT" }]);
  };

  const handleStudentChange = (
    index: number,
    field: keyof Student,
    value: string
  ) => {
    const newStudents = [...students];
    newStudents[index][field] = value;
    setStudents(newStudents);
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    if (schoolDetails) {
      console.log('School Details in PDF:', schoolDetails); // Debug: Check if school details are correct

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
      page.drawText(
        schoolDetails.zipcode ? `${schoolDetails.zipcode} ${schoolDetails.city}` : `Adresse non disponible`,
        {
          x: 50,
          y: height - 80,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        }
      );
    }

    page.drawText("Feuille d'émargement", {
      x: width / 2 - 50,
      y: height - 150,
      size: fontSize + 4,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText("Nom de la formation: " + selectedClassName, {
      x: 50,
      y: height - 180,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText("N°", {
      x: 50,
      y: height - 210,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("Nom", {
      x: 100,
      y: height - 210,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("Signature", {
      x: 400,
      y: height - 210,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    const rowHeight = 50;
    let yPosition = height - 230;

    for (const [index, student] of students.entries()) {
      if (student.role === "STUDENT") {
        page.drawText((index + 1).toString(), {
          x: 50,
          y: yPosition,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        page.drawText(`${student.firstname} ${student.lastname}`, {
          x: 100,
          y: yPosition,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawLine({
          start: { x: 40, y: yPosition - 5 },
          end: { x: width - 40, y: yPosition - 5 },
          thickness: 1,
          color: rgb(0, 0, 0),
        });

        yPosition -= rowHeight;
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "feuille_demargement.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <select
        value={selectedClass}
        onChange={handleClassChange}
        className="p-2 border rounded"
      >
        <option value="">Sélectionnez une classe</option>
        {classes.map((classItem) => (
          <option key={classItem.id} value={classItem.id}>
            {classItem.name}
          </option>
        ))}
      </select>
      {students.filter(student => student.role === "STUDENT").map((student, index) => (
        <div key={index} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Prénom"
            value={student.firstname}
            onChange={(e) =>
              handleStudentChange(index, "firstname", e.target.value)
            }
          />
          <Input
            type="text"
            placeholder="Nom"
            value={student.lastname}
            onChange={(e) =>
              handleStudentChange(index, "lastname", e.target.value)
            }
          />
        </div>
      ))}
      <Button
        onClick={handleAddStudent}
        className="flex items-center space-x-2"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Ajouter un élève</span>
      </Button>
      <Button onClick={generatePDF}>Générer PDF</Button>
    </div>
  );
}
