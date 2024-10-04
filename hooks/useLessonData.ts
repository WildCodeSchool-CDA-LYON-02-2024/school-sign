import { useState } from "react";
import { Lesson } from "@/components/calendar/Calendar";
import { useToast } from "@/hooks/use-toast";

export function useLessonData() {
  const [events, setEvents] = useState<Lesson[]>([]);
  const [userClassId, setUserClassId] = useState<number | null>(null);
  const { toast } = useToast();

  const getLessons = async () => {
    try {
      const response = await fetch(`/api/lessons?classId=${userClassId}`);
      if (response.ok) {
        const data: Lesson[] = await response.json();
        setEvents(data);
      } else {
        console.error("Error fetching lessons");
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const addLesson = async (lesson: Lesson) => {
    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lesson),
      });

      if (!response.ok) {
        throw new Error("Error adding lesson");
      }

      toast({
        title: "Course added successfully",
        className: "bg-green-400",
        duration: 2000,
      });

      const createdLesson = await response.json();
      setEvents((prevEvents) => [...prevEvents, createdLesson]);

      return createdLesson;
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to add lesson. Please try again.",
        className: "bg-red-500",
        duration: 2000,
      });
    }
  };

  return {
    events,
    getLessons,
    addLesson,
  };
}
