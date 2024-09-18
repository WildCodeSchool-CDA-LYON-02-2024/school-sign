"use client";

import { createContext, useContext, useState } from "react";
import { verifyToken } from "@/lib/jwt"; // Votre utilitaire JWT

// Type pour le contexte
interface SignatureContextType {
  isSignatureAllowed: boolean;
  studentSignature: string | null;
  currentClassId: number | null;  // Le classId est maintenant un nombre
  allowSignature: (classId: number) => void;
  disallowSignature: () => void;
  setStudentSignature: (signature: string) => void;
}

// Création du contexte
const SignatureContext = createContext<SignatureContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const useSignatureContext = () => {
  const context = useContext(SignatureContext);
  if (!context) {
    throw new Error("useSignatureContext must be used within a SignatureProvider");
  }
  return context;
};

// Provider pour le contexte
export const SignatureProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSignatureAllowed, setIsSignatureAllowed] = useState(false);
  const [studentSignature, setStudentSignature] = useState<string | null>(null);
  const [currentClassId, setCurrentClassId] = useState<number | null>(null);

  const allowSignature = (classId: number) => {
    setIsSignatureAllowed(true);
    setCurrentClassId(classId);
  };

  const disallowSignature = () => {
    setIsSignatureAllowed(false);
    setCurrentClassId(null);
    setStudentSignature(null); // Réinitialise la signature quand désactivé
  };

  return (
    <SignatureContext.Provider
      value={{
        isSignatureAllowed,
        studentSignature,
        currentClassId,
        allowSignature,
        disallowSignature,
        setStudentSignature,
      }}
    >
      {children}
    </SignatureContext.Provider>
  );
};
