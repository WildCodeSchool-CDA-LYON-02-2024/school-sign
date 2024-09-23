import { PDFDocument, StandardFonts } from "pdf-lib";

export default async function PDFGenerator(
  students: Student[],
  schoolDetails: any,
  className: string | null,
  teacherName: string | null,
  toast: any,
) {
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

  // PDF content rendering (same as before)

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "feuille_demargement.pdf";
  link.click();
}
