import { useCallback } from "react";
import { Signature } from "@/components/ClassWithSignatures/StudentList";

export function useFetchSignatures(
  setSignatures: (signatures: Signature[]) => void,
  setError: (error: string | null) => void,
) {
  const fetchSignatures = useCallback(async () => {
    try {
      const res = await fetch("/api/signature", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("API Response Data:", data);  // Log to check the data structure
        setSignatures(data.signs || []);
      } else {
        throw new Error("Failed to fetch signatures");
      }
    } catch (error) {
      console.error("Request Error:", error);
      setError("Failed to fetch signatures");
    }
  }, [setSignatures, setError]);

  return { fetchSignatures };
}
