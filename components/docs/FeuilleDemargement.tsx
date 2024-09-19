"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

export default function FeuilleDemargement() {
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [students, setStudents] = useState([{ firstname: "", lastname: "" }]);
  const [teacherName, setTeacherName] = useState("");
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      const res = await fetch("/api/school");
      const data = await res.json();
      setSchoolName(data.name);
      setSchoolAddress(data.address);
      setZipCode(data.zipCode);
      setCity(data.city);
    };
    fetchSchoolDetails();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await fetch("/api/class");
      const data = await res.json();
      setClasses(data.classSections);
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

  const handleAddStudent = () => {
    setStudents([...students, { firstname: "", lastname: "" }]);
  };

  const handleStudentChange = (
    index: number,
    field: keyof (typeof students)[number],
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

    // Header
    page.drawText(schoolName, {
      x: 50,
      y: height - 50,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText(schoolAddress, {
      x: 50,
      y: height - 65,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`${zipCode} ${city}`, {
      x: 50,
      y: height - 80,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // Title
    page.drawText("Feuille d'émargement", {
      x: width / 2 - 50,
      y: height - 150,
      size: fontSize + 4,
      font,
      color: rgb(0, 0, 0),
    });

    // Formation details
    page.drawText("Nom de la formation: " + selectedClass, {
      x: 50,
      y: height - 180,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // Table header
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

    // Table rows
    let yPosition = height - 230;
    students.forEach((student, index) => {
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
      yPosition -= 30;
    });

    // Footer
    page.drawText("Professeur: " + teacherName, {
      x: 50,
      y: 50,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "feuille_demargement.pdf";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <Input
        type="text"
        placeholder="School Name"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
      />
      <Input
        type="text"
        placeholder="School Address"
        value={schoolAddress}
        onChange={(e) => setSchoolAddress(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Zip Code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
      />
      <Input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <select
        value={selectedClass}
        onChange={(e) =>
          setSelectedClass((e.target as HTMLSelectElement).value)
        }
        className="p-2 border rounded"
      >
        <option>Sélectionnez une classe</option>
        {classes.map((classItem: any) => (
          <option key={classItem.id} value={classItem.id}>
            {classItem.name}
          </option>
        ))}
      </select>
      <select
        value={teacherName}
        onChange={(e) => setTeacherName((e.target as HTMLSelectElement).value)}
        className="p-2 border rounded"
      >
        <option>Sélectionnez un professeur</option>
        {teachers.map((teacher: any) => (
          <option
            key={teacher.id}
            value={teacher.firstname + " " + teacher.lastname}
          >
            {teacher.firstname} {teacher.lastname}
          </option>
        ))}
      </select>
      {students.map((student, index) => (
        <div key={index} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Firstname"
            value={student.firstname}
            onChange={(e) =>
              handleStudentChange(index, "firstname", e.target.value)
            }
          />
          <Input
            type="text"
            placeholder="Lastname"
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
      <Button onClick={generatePDF}>Téléchargement du PDF de présence</Button>
    </div>
  );
}
