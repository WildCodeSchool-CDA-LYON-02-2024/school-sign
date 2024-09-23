import Image from "next/image";

export interface Student {
  id: string;
  firstname: string;
  lastname: string;
  role: string;
}

export interface Signature {
  userId: string;
  hashedSign: string;
}

interface StudentListProps {
  students: Student[];
  signatures: Signature[];
  error?: string;
}

export default function StudentList({
  students,
  signatures,
  error,
}: StudentListProps) {
  const findSignatureForStudent = (studentId: string) => {
    const signature = signatures.find((sig) => sig.userId === studentId);
    return signature ? signature.hashedSign : null;
  };

  return (
    <>
      {students && students.length > 0 ? (
        <ul className="space-y-4 flex flex-col justify-center items-center">
          {students
            .filter((student) => student.role === "STUDENT")
            .map((student) => (
              <li key={student.id}>
                <div className="card w-80 justify-center items-center">
                  <div className="card-content flex flex-col justify-center items-center">
                    <p>{`Nom: ${student.firstname} ${student.lastname}`}</p>
                    {findSignatureForStudent(student.id) ? (
                      <Image
                        src={findSignatureForStudent(student.id) || ""}
                        alt={`Signature de ${student.firstname} ${student.lastname}`}
                        width={600}
                        height={500}
                      />
                    ) : (
                      <p className="mt-4 text-red-500">
                        No signatures received.
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <p>No students were found for this class.</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
