"use client";

import { useEffect, useState } from "react";
import { useSignatureContext } from "../../../components/context/SignatureContext";
import Image from "next/image";
import { DataTable } from "@/components/table/data-table";
import { columns, Payment } from "@/components/table/columns";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    // ...
  ];
}

export default function TeacherDashboard() {
  const [data, setData] = useState<Payment[]>([]);
  const [classId, setClassId] = useState<number | null>(null);
  const {
    allowSignature,
    disallowSignature,
    isSignatureAllowed,
    studentSignatures,
  } = useSignatureContext();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getData();
      setData(fetchedData);
    };

    const fetchClassId = async () => {
      const response = await fetch("/api/getClassIdByToken");
      if (response.ok) {
        const data = await response.json();
        setClassId(data.classId);
      } else {
        console.error("Erreur lors de la récupération du classId");
      }
    };

    fetchData();
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
    <>
      <h1 className="text-center text-2xl pb-8">Teacher Dashboard</h1>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />

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
                      <Image
                        src={signature}
                        alt={`Signature de l'élève ${index + 1}`}
                        width={600}
                        height={500}
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
    </>
  );
}
