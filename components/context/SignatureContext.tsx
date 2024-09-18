"use client"

import { createContext, useContext, useState } from "react";

// Le type pour le contexte
interface SignatureContextType {
  isSignatureAllowed: boolean;
  studentSignature: string | null;
  allowSignature: () => void;
  disallowSignature: () => void;
  setStudentSignature: (signature: string) => void;
}

// Création du contexte
const SignatureContext = createContext<SignatureContextType | undefined>(undefined);

// Utilisation du contexte
export const useSignatureContext = () => {
  const context = useContext(SignatureContext);
  if (!context) {
    throw new Error("useSignatureContext must be used within a SignatureProvider");
  }
  return context;
};

// Provider du contexte
export const SignatureProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSignatureAllowed, setIsSignatureAllowed] = useState(false);
  const [studentSignature, setStudentSignature] = useState<string | null>(null);

  const allowSignature = () => setIsSignatureAllowed(true);
  const disallowSignature = () => {
    setIsSignatureAllowed(false);
  };

  return (
    <SignatureContext.Provider
      value={{
        isSignatureAllowed,
        studentSignature,
        allowSignature,
        disallowSignature,
        setStudentSignature,
      }}
    >
      {children}
    </SignatureContext.Provider>
  );
};