import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Student } from "@/components/ClassWithSignatures/StudentList";

interface PDFGeneratorProps {
  students: Student[];
  schoolDetails: (
    details: {
      name: string;
      address: string;
      zipcode: string;
      city: string;
    } | null,
  ) => void;
  className: string | null;
  teacherName: string | null;
  toast: any;
}

export default async function PDFGenerator({
  students,
  schoolDetails,
  className,
  teacherName,
  toast,
}: PDFGeneratorProps) {
  toast({
    title: "Attendance sheet PDF generated",
    className: "bg-green-400",
    duration: 2000,
  });
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  page.drawText("Attendance sheet", {
    x: width / 2 - 70,
    y: height - 120,
    size: fontSize + 4,
    font,
    color: rgb(0, 0, 0),
  });

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
      y: height - 70,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText(`${schoolDetails.zipcode} ${schoolDetails.city}`, {
      x: 50,
      y: height - 90,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  if (className) {
    page.drawText(`Class: ${className}`, {
      x: 50,
      y: height - 160,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  if (teacherName) {
    page.drawText(`Teacher: ${teacherName}`, {
      x: 50,
      y: height - 180,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  page.drawText("Name", {
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

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "feuille_demargement.pdf";
  link.click();
}
