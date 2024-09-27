import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Student {
  id: string;
  class: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  signature?: string;
}

export interface Signature {
  id: number;
  hashedSign: string;
  lessonId?: number;
  userId?: string; 
  date?: string;
}

interface StudentListProps {
  students: Student[];
  signatures: Signature[];
  currentLessonId: number;
  error?: string | null;
}

export default function StudentList({
  students,
  signatures,
  currentLessonId,
  error,
}: StudentListProps) {
  const findSignatureForStudent = (studentId: string) => {
    const signature = signatures.find(
      (sig) =>
        sig.userId === studentId && sig.lessonId === currentLessonId
    );
    return signature ? signature.hashedSign : null;
  };

  return (
    <>
      {students?.length ? ( 
        <ul className="flex justify-center gap-6 my-10 flex-wrap">
          {students
            .filter((student) => student.role === "STUDENT")
            .map((student) => {
              const studentSignature = findSignatureForStudent(student.id);
              return (
                <li key={student.id} className="h-48 min-h-16">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">
                        {`${student.firstname} ${student.lastname}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                      {studentSignature ? (
                        <Image
<<<<<<< HEAD
                          src={
                            findSignatureForStudent(student.id) ||
                            "/default-signature.png"
                          }
                          alt={`Signature of ${student.firstname} ${student.lastname}`}
                          width={600}
                          height={500}
=======
                          src={studentSignature || "/default-signature.png"} 
                          alt={`Signature of ${student.firstname} ${student.lastname}`}
                          width={160}
                          height={100}
>>>>>>> dev
                          priority
                        />
                      ) : (
                        <p className=" h-20 min-h-20 w-40 min-w-36 text-center text-red-500 font-light">
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
