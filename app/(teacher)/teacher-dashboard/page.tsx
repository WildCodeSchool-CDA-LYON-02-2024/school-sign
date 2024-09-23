"use client";

import { useEffect, useState } from "react";
import { useSignatureContext } from "@/components/context/SignatureContext";
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
      </div>
    </>
  );
}
