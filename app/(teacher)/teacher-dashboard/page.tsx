"use client";

// react
import { useEffect, useState } from "react";
// hooks
import { useFetchStudents } from "@/hooks/useFetchStudents";
import { useFetchClassDetails } from "@/hooks/useFetchClassDetails";
import { useFetchSignatures } from "@/hooks/useFetchSignatures";

// tanstack
import { DataTable } from "@/components/table/data-table";
import { columns, ClassCol } from "@/components/table/columns";
import {
  Signature,
  Student,
} from "@/components/ClassWithSignatures/StudentList";
import { useSignatureContext } from "@/components/context/SignatureContext";
import {
  SchoolDetails,
  useFetchSchoolDetails,
} from "@/hooks/useFetchSchoolDetails";
import { useToast } from "@/hooks/use-toast";

export default function TeacherDashboard() {
  const [data, setData] = useState<ClassCol[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [className, setClassName] = useState<string | null>(null);
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);

  const { allowSignature, disallowSignature, isSignatureAllowed } =
    useSignatureContext();
  const { toast } = useToast();

  const { fetchClassId, fetchClassName } = useFetchClassDetails(
    setTeacherName,
    setClassId,
    setClassName,
    classId,
  );
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

  // Combine students and signatures to populate the table data
  useEffect(() => {
    if (students.length > 0) {
      console.log();
      const combinedData = students
        .filter((student) => student.role === "STUDENT")
        .map((student) => {
          const studentSignature = signatures.find(
            (signature) => signature.userId === student.id,
          );
          return {
            id: student.id.toString(),
            lastname: student.lastname,
            firstname: student.firstname,
            email: student.email,
            signature: studentSignature?.status || "pending",
          };
        });

      setData(combinedData);
    }
  }, [students]);

  return (
    <>
      <h1 className="text-center text-2xl pb-8">Teacher Dashboard</h1>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
