"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSignatureContext } from "@/components/context/SignatureContext";
import ClassHeader from "./ClassHeader";
import SignatureActions from "./SignatureActions";
import StudentList, { Student } from "./StudentList";
import { useFetchStudents } from "@/hooks/useFetchStudents";
import { useFetchSchoolDetails } from "@/hooks/useFetchSchoolDetails";
import { useFetchClassDetails } from "@/hooks/useFetchClassDetails";
import PDFGenerator from "./PDFGenerator";

export default function ClassWithSignatures() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [className, setClassName] = useState<string | null>(null);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const { allowSignature, disallowSignature, isSignatureAllowed } =
    useSignatureContext();
  const { toast } = useToast();

  const { fetchClassId } = useFetchClassDetails(setTeacherName, setClassId);
  const { fetchStudents } = useFetchStudents(classId, setStudents, setError);
  const { fetchSchoolDetails } = useFetchSchoolDetails(setSchoolDetails);

  useEffect(() => {
    fetchClassId();
  }, []);

  useEffect(() => {
    if (classId) fetchStudents();
  }, [classId]);

  useEffect(() => {
    fetchSchoolDetails();
  }, []);

  return (
    <>
      <ClassHeader className={className} classId={classId} />
      <SignatureActions
        classId={classId}
        isSignatureAllowed={isSignatureAllowed}
        allowSignature={allowSignature}
        disallowSignature={disallowSignature}
        toast={toast}
      />
      <StudentList students={students} signatures={[]} error={error} />
      <Button
        onClick={() =>
          PDFGenerator(students, schoolDetails, className, teacherName, toast)
        }
      >
        Generate PDF
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
