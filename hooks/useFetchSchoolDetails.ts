export function useFetchSchoolDetails(
  setSchoolDetails: (
    details: {
      name: string;
      address: string;
      zipcode: string;
      city: string;
    } | null,
  ) => void,
) {
  const fetchSchoolDetails = async () => {
    try {
      const res = await fetch("/api/school", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setSchoolDetails(data);
      } else {
        throw new Error("Failed to fetch school details");
      }
    } catch (error) {
      console.error("Error fetching school details:", error);
      setSchoolDetails(null); // Handle failure
    }
  };

  return { fetchSchoolDetails };
}
