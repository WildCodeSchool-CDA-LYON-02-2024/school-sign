"use client";

// next
// components
// ui

import SignatureCanvas from "@/components/SignatureCanvas";
import { useSignatureContext } from "@/components/context/SignatureContext";

export default function StudentDashboard() {
  const { isSignatureAllowed } = useSignatureContext();
  return (
    <>
      <div className="flex flex-col justify-center items-center py-8">
        <h1>Student Dashboard</h1>
        <div className="flex flex-col justify-center items-center mt-20">
        {!isSignatureAllowed ? (
        <p>Les signatures ne sont pas encore autorisées par l'enseignant.</p>
      ) : (
        <SignatureCanvas />
      )}
        </div>
      </div>
    </>
  );
}
