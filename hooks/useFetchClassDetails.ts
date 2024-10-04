import { useCallback, useEffect } from "react";

export interface ClassSection {
  id: number;
  name: string;
}

export function useFetchClassDetails(
  setClassId: (id: number | null) => void,
  setClassName: (name: string | null) => void,
  classId: number | null,
) {
  const fetchClassName = useCallback(async () => {
    if (classId === null) return;

    try {
      const res = await fetch("/api/class");
      if (!res.ok) {
        throw new Error("Failed to fetch classes");
      }

      const data = await res.json();
      const currentClass = data.classSections.find(
        (cls: ClassSection) => cls.id === classId,
      );
      if (currentClass) {
        setClassName(currentClass.name);
      } else {
        console.warn("Class not found");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  }, [setClassName, classId]);

  const fetchClassId = useCallback(async () => {
    try {
      const response = await fetch("/api/getClassIdByToken");
      if (response.ok) {
        const data = await response.json();
        setClassId(data.user.classId);
      } else {
        throw new Error("Failed to fetch class ID");
      }
    } catch (error) {
      console.error("Error fetching class ID:", error);
      setClassId(null);
    }
  }, [setClassId]);

  return { fetchClassId, fetchClassName };
}
