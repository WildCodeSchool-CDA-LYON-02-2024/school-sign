"use client";

import { useEffect, useState } from "react";
import { useSignatureContext } from "../../../components/context/SignatureContext";
import SignatureCanvas from "../../../components/SignatureCanvas";
import { useFetchLessons } from "@/hooks/useFetchLesson";
import { Lesson } from "@/components/calendar/CalendarTest";

export default function StudentDashboard() {
  const { isSignatureAllowed, currentClassId } = useSignatureContext();
  const [studentClassId, setStudentClassId] = useState<number | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { fetchLessons } = useFetchLessons(
    studentClassId,
    setLessons,
    setError
  );
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const fetchClassId = async () => {
      try {
        const response = await fetch("/api/getClassIdByToken");
        if (response.ok) {
          const data = await response.json();
          setStudentClassId(data.user.classId);
        } else {
          console.error("Erreur lors de la récupération du classId");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du classId", error);
      }
    };

    fetchClassId();
  }, []);

  // Fetch lessons once we have the studentClassId
  useEffect(() => {
    const fetchData = async () => {
      if (studentClassId) {
        try {
          await fetchLessons();
        } catch (err) {
          setError("Failed to fetch class-related data.");
        }
      }
    };
    fetchData();
  }, [studentClassId, fetchLessons]);

  const canSign = isSignatureAllowed && currentClassId === studentClassId;

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const isLessonOngoing = (dateStart: Date, dateEnd: Date): boolean => {
    return currentDateTime >= dateStart && currentDateTime <= dateEnd;
  };

  return (
    <>
      <h1 className="text-center text-2xl pb-8">Student Dashboard</h1>

      {canSign ? (
        lessons.length > 0 && isLessonOngoing(new Date(lessons[0].dateStart), new Date(lessons[0].dateEnd)) ? (
          <SignatureCanvas lessonId={lessons[0].id} />
        ) : (
          <p className="text-gray-500">Aucune leçon en cours pour signer.</p>
        )
      ) : (
        <p className="text-red-500">
          {isSignatureAllowed
            ? "Vous ne pouvez pas signer, car votre ID de classe ne correspond pas."
            : "Les signatures ne sont pas encore autorisées."}
        </p>
      )}
    </>
  );
}
