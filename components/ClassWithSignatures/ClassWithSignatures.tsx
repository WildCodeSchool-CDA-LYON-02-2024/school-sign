"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSignatureContext } from "@/components/context/SignatureContext";
import ClassComponent from "./ClassComponent";
import SignatureActions from "./SignatureActions";
import StudentList, { Student, Signature } from "./StudentList"; 
import { useFetchStudents } from "@/hooks/useFetchStudents";
import { SchoolDetails, useFetchSchoolDetails } from "@/hooks/useFetchSchoolDetails";
import { useFetchClassDetails } from "@/hooks/useFetchClassDetails";
import { useFetchSignatures } from "@/hooks/useFetchSignatures"; 
import PDFGenerator from "./PDFGenerator";

export default function ClassWithSignatures() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [className, setClassName] = useState<string | null>(null);
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]); 

  const { allowSignature, disallowSignature, isSignatureAllowed } = useSignatureContext();
  const { toast } = useToast();

  const { fetchClassId, fetchClassName } = useFetchClassDetails(setTeacherName, setClassId, setClassName, classId);
  const { fetchStudents } = useFetchStudents(classId, setStudents, setError);
  const { fetchSchoolDetails } = useFetchSchoolDetails(setSchoolDetails);
  const { fetchSignatures } = useFetchSignatures(setSignatures, setError); 

  useEffect(() => {
    fetchClassId();
  }, [fetchClassId]);

  useEffect(() => {
    if (classId) {
      fetchStudents();
      fetchClassName();
      fetchSignatures(); 
    }
  }, [classId, fetchStudents, fetchClassName, fetchSignatures]); 

  useEffect(() => {
    fetchSchoolDetails();
  }, [fetchSchoolDetails]);

  const handleGeneratePDF = async () => {
    const studentSignatures = students.map(student => {
      const studentSignature = signatures.find(sig => sig.userId === student.id);
      return { 
        userId: student.id, 
        hashedSign: studentSignature ? studentSignature.hashedSign : "" 
      }; 
    });

    try {
      await PDFGenerator({
        students,
        signatures: studentSignatures,
        schoolDetails,
        className,
        teacherName,
        toast,
      });
      toast({
        title: "PDF generated successfully!",
        className: "bg-green-400",
        duration: 2000,
      });
    } catch (error: unknown) { // Explicitly typing the error as unknown
      console.error("Error generating PDF:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Failed to generate PDF.",
        description: errorMessage,
        className: "bg-red-500",
        duration: 2000,
      });
    }
};


  return (
    <>
      {classId ? (
        <div className="flex flex-col items-center">
          <ClassComponent className={className} classId={classId} />
          <SignatureActions
            classId={classId}
            isSignatureAllowed={isSignatureAllowed}
            allowSignature={allowSignature}
            disallowSignature={disallowSignature}
            toast={toast}
          />
          <StudentList students={students} signatures={signatures} error={error} />
        </div>
      ) : (
        <p>No class is assigned to you.</p>
      )}

      <Button onClick={handleGeneratePDF} disabled={students.length === 0}>
        Generate PDF
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
