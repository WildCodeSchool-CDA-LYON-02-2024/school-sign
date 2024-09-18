"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { columns, Payment } from "@/components/table/columns";
import { useSignatureContext } from "../../../components/context/SignatureContext";

async function getData(): Promise<Payment[]> {
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
  ];
}

export default function TeacherDashboard() {
  const {
    allowSignature,
    disallowSignature,
    isSignatureAllowed,
    studentSignature,
  } = useSignatureContext();
  const [data, setData] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="h-screen py-8 w-full">
        <h1 className="text-center">Teacher Dashboard</h1>
        <div className="container mx-auto py-10">
          <button
            onClick={allowSignature}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          >
            Autoriser les signatures
          </button>
          <button
            onClick={disallowSignature}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Désactiver les signatures
          </button>
          <p className="mt-4">
            {isSignatureAllowed
              ? "Les signatures sont autorisées."
              : "Les signatures sont désactivées."}
          </p>

          {/* Afficher la signature de l'élève si elle est présente */}
          {studentSignature ? (
            <div className="mt-8">
              <h2 className="text-lg">Signature de l&apos;élève :</h2>
              <img
                src={studentSignature}
                alt="Student's Signature"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          ) : (
            <p className="mt-8 text-red-500">Aucune signature reçue.</p>
          )}

          {/* DataTable pour les autres données */}
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
