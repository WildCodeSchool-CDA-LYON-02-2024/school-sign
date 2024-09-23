"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSignatureContext } from "@/components/context/SignatureContext";
import ClassComponent from "./ClassComponent";
import SignatureActions from "./SignatureActions";
import StudentList, { Student } from "./StudentList";
import { useFetchStudents } from "@/hooks/useFetchStudents";
import {
  SchoolDetails,
  useFetchSchoolDetails,
} from "@/hooks/useFetchSchoolDetails";
import { useFetchClassDetails } from "@/hooks/useFetchClassDetails";
import PDFGenerator from "./PDFGenerator";

export default function ClassWithSignatures() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [className, setClassName] = useState<string | null>(null);
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const { allowSignature, disallowSignature, isSignatureAllowed } =
    useSignatureContext();
  const { toast } = useToast();

  const { fetchClassId } = useFetchClassDetails(setTeacherName, setClassId);
  const { fetchStudents } = useFetchStudents(classId, setStudents, setError);
  const { fetchSchoolDetails } = useFetchSchoolDetails(setSchoolDetails);

  useEffect(() => {
    fetchClassId();
  }, [fetchClassId]);

  useEffect(() => {
    if (classId) fetchStudents();
  }, [classId, fetchStudents]);

  useEffect(() => {
    fetchSchoolDetails();
  }, [fetchSchoolDetails]);

  return (
    <>
      <h1 className="text-center text-2xl pb-8">Teacher Class</h1>
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
          <StudentList students={students} signatures={[]} error={error} />
        </div>
      ) : (
        <p>No class is assigned to you.</p>
      )}

      <Button
        onClick={() =>
          PDFGenerator({
            students,
            schoolDetails,
            className,
            teacherName,
            toast,
          })
        }
      >
        Generate PDF
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
