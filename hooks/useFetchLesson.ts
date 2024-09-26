import { useCallback } from "react";
import { Lesson } from "@/components/calendar/CalendarTest";

export function useFetchLessons(
  classId: number | null,
  setLessons: (lessons: Lesson[]) => void,
  setError: (error: string | null) => void
) {
  const fetchLessons = useCallback(async () => {
    if (classId) {
      try {
        const res = await fetch(`/api/lessons?classid=${classId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials for cookies/session
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Fetched lessons:", data); // Log the entire response for debugging

          // Assuming data is an array of lessons, adjust as necessary
          setLessons(data || []); // Use data directly if it is an array
        } else {
          throw new Error(`Failed to fetch Lessons: ${res.statusText}`);
        }
      } catch (error) {
        console.error("Request Error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch Lessons"
        );
      }
    }
  }, [classId, setLessons, setError]);

  return { fetchLessons };
}
