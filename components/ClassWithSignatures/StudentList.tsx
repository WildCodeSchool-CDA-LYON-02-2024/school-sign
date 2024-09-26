import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Student {
  id: string;
  class: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  signature?: string; // Optional property if you want to allow null
}

export interface Signature {
  id: number;            // Ensure this property exists
  hashedSign: string;    // Ensure this property exists
  lessonId?: number;     // Optional property
  userId?: number;       // Optional property
  date?: string;         // Optional property
}

interface StudentListProps {
  students: Student[];
  signatures: Signature[];
  error?: string | null;
}

export default function StudentList({
  students,
  signatures,
  error,
}: StudentListProps) {
  // Ensure the userId is treated as a string
  const findSignatureForStudent = (studentId: string) => {
    const signature = signatures.find((sig) => sig.userId?.toString() === studentId); // Convert userId to string for comparison
    return signature ? signature.hashedSign : null;
  };

  return (
    <>
      {students && students.length > 0 ? (
        <ul className="flex gap-6 my-10">
          {students
            .filter((student) => student.role === "STUDENT")
            .map((student) => {
              const studentSignature = findSignatureForStudent(student.id);
              return (
                <li key={student.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {`Name: ${student.firstname} ${student.lastname}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                      {studentSignature ? (
                        <Image
                          src={studentSignature || "/default-signature.png"} 
                          alt={`Signature of ${student.firstname} ${student.lastname}`}
                          width={600}
                          height={500}
                          priority
                        />
                      ) : (
                        <p className="text-red-500 font-light">
                          No signature received.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </li>
              );
            })}
        </ul>
      ) : (
        <p>No students were found for this class.</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
