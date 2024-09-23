export function useFetchClassDetails(
  setTeacherName: (name: string) => void,
  setClassId: (id: number | null) => void,
) {
  const fetchClassId = async () => {
    try {
      const response = await fetch("/api/getClassIdByToken");
      if (response.ok) {
        const data = await response.json();
        setTeacherName(`${data.user.firstname} ${data.user.lastname}`);
        setClassId(data.user.classId);
      } else {
        throw new Error("Failed to fetch class ID");
      }
    } catch (error) {
      console.error("Error fetching class ID:", error);
      setClassId(null); // Handle failure
    }
  };

  return { fetchClassId };
}
