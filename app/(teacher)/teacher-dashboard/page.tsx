"use client";

import { useEffect, useState } from "react";
import { useSignatureContext } from "../../../components/context/SignatureContext";

export default function TeacherDashboard() {
  const {
    allowSignature,
    disallowSignature,
    isSignatureAllowed,
    studentSignatures, // Utiliser studentSignatures
  } = useSignatureContext();
  const [classId, setClassId] = useState<number | null>(null);

  useEffect(() => {
    const fetchClassId = async () => {
      const response = await fetch("/api/getClassIdByToken");
      if (response.ok) {
        const data = await response.json();
        setClassId(data.classId);
      } else {
        console.error("Erreur lors de la récupération du classId");
      }
    };

    fetchClassId();
  }, []);

  const handleAllowSignature = () => {
    if (classId) {
      allowSignature(classId);
    } else {
      alert("Aucune classe ne vous est affectée");
    }
  };

  return (
    <div className="h-screen py-8 w-full">
      <h1 className="text-center">Teacher Dashboard</h1>
      {classId ? (
        <div className="container mx-auto py-10">
          <button
            onClick={handleAllowSignature}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          >
            Autoriser les signatures pour la classe {classId}
          </button>
          <button
            onClick={disallowSignature}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Désactiver les signatures
          </button>
          <p className="mt-4">
            {isSignatureAllowed
              ? `Les signatures sont autorisées pour la classe ${classId}.`
              : "Les signatures sont désactivées."}
          </p>

          {/* Affichage des signatures des élèves */}
          {studentSignatures && studentSignatures.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-lg">Signatures des élèves :</h2>
              <div className="grid grid-cols-1 gap-4">
                {studentSignatures.map((signature, index) => (
                  <div key={index} className="border p-2">
                    <img
                      src={signature}
                      alt={`Signature de l'élève ${index + 1}`}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-8 text-red-500">Aucune signature reçue.</p>
          )}
        </div>
      ) : (
        <p>Aucune classe ne vous est affectée</p>
      )}
    </div>
  );
}
