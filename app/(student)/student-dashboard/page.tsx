"use client";

import { useEffect, useState } from "react";
import { useSignatureContext } from "../../../components/context/SignatureContext";
import SignatureCanvas from "../../../components/SignatureCanvas";

export default function StudentDashboard() {
  const { isSignatureAllowed, currentClassId } = useSignatureContext();
  const [studentClassId, setStudentClassId] = useState<number | null>(null);

  useEffect(() => {
    // Obtenir le classId à partir de l'API
    const fetchClassId = async () => {
      const response = await fetch("/api/getClassIdByToken");
      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setStudentClassId(data.classId);
      } else {
        console.error("Erreur lors de la récupération du classId");
      }
    };

    fetchClassId();
  }, []);

  const canSign = isSignatureAllowed && currentClassId === studentClassId;

  return (
    <>
      <div className="flex flex-col justify-center items-center py-8">
        <h1 className="text-center">Student Dashboard</h1>
        {canSign ? (
          <SignatureCanvas />
        ) : (
          <p className="text-red-500">
            {isSignatureAllowed
              ? "Vous ne pouvez pas signer, car votre ID de classe ne correspond pas."
              : "Les signatures ne sont pas encore autorisées."}
          </p>
        )}
      </div>
    </>
  );
}