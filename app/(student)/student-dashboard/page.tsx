"use client";

import { useEffect, useState } from "react";
import { useSignatureContext } from "../../../components/context/SignatureContext";
import SignatureCanvas from "../../../components/SignatureCanvas";
import { useFetchLessons } from "@/hooks/useFetchLesson";
import { Lesson } from "@/components/calendar/CalendarTest";
import { useFetchSignatures } from "@/hooks/useFetchSignatures";
import { Signature } from "@/components/ClassWithSignatures/StudentList";
import Image from "next/image";

export default function StudentDashboard() {
  const { isSignatureAllowed, currentClassId } = useSignatureContext();
  const [studentClassId, setStudentClassId] = useState<number | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { fetchLessons } = useFetchLessons(
    studentClassId,
    setLessons,
    setError
  );
  const { fetchSignatures } = useFetchSignatures(setSignatures, setError);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  // Fetch the student class ID
  useEffect(() => {
    const fetchClassId = async () => {
      try {
        const response = await fetch("/api/getClassIdByToken");
        if (response.ok) {
          const data = await response.json();
          setStudentClassId(data.user.classId);
          setStudentId(data.user.id);
        } else {
          console.error("Erreur lors de la récupération du classId");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du classId", error);
      }
    };

    fetchClassId();
  }, []);

  // Fetch lessons and signatures once we have the studentClassId
  useEffect(() => {
    const fetchData = async () => {
      if (studentClassId) {
        try {
          await Promise.all([fetchSignatures(), fetchLessons()]);
        } catch (err) {
          setError("Failed to fetch class-related data.");
        }
      }
    };
    fetchData();
  }, [studentClassId, fetchSignatures, fetchLessons]);

  const canSign = isSignatureAllowed && currentClassId === studentClassId;

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const isLessonOngoing = (dateStart: Date, dateEnd: Date): boolean => {
    return currentDateTime >= dateStart && currentDateTime <= dateEnd;
  };

  // Filter signatures related to the current lesson
  const currentLessonId = lessons.length > 0 ? lessons[0].id : null;
  const filteredSignatures = currentLessonId
    ? signatures.filter(
        (signature) =>
          signature.lessonId === currentLessonId &&
          signature.userId === studentId
      )
    : [];

  return (
    <>
      <h1 className="text-center text-2xl pb-8">Student Dashboard</h1>

      {/* Render fetched signatures */}
      {filteredSignatures.length > 0 ? (
        <div className="mb-4">
          {filteredSignatures.map((signature) => (
            <div key={signature.id}>

              <div className="flex flex-col items-center">
                <h4 className="mb-4">Saved Signature</h4>
                <Image
                  src={signature.hashedSign}
                  alt="Signature"
                  width={600}
                  height={500}
                />
              </div>
            </div>
          ))}
        </div>
      ) : // Use parentheses instead of curly braces
      canSign ? (
        lessons.length > 0 &&
        isLessonOngoing(
          new Date(lessons[0].dateStart),
          new Date(lessons[0].dateEnd)
        ) ? (
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
