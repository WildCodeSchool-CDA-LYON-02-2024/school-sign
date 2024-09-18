"use client";

import { useEffect, useState } from "react";
import { useSignatureContext } from "../../../components/context/SignatureContext";

export default function TeacherDashboard() {
  const {
    allowSignature,
    disallowSignature,
    isSignatureAllowed,
    studentSignature,
  } = useSignatureContext();
  const [classId, setClassId] = useState<number | null>(null); // Stocker le classId de l'enseignant

  useEffect(() => {
    // Obtenir le classId à partir de l'API
    const fetchClassId = async () => {
      const response = await fetch("/api/getClassIdByToken");
      if (response.ok) {
        const data = await response.json();
        console.log(data);

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
      alert("Aucun ID de classe disponible.");
    }
  };

  return (
    <>
      <div className="h-screen py-8 w-full">
        <h1 className="text-center">Teacher Dashboard</h1>
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

          {/* Affichage de la signature de l'élève si présente */}
          {studentSignature ? (
            <div className="mt-8">
              <h2 className="text-lg">Signature de l&apos;élève :</h2>
              <img
                src={studentSignature}
                alt="Signature de l'élève"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          ) : (
            <p className="mt-8 text-red-500">Aucune signature reçue.</p>
          )}
        </div>
      </div>
    </>
  );
}
