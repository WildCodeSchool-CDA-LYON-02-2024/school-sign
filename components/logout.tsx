"use client";

// next
import { useRouter } from "next/navigation";

// ui
import { Button } from "@/components/ui/button";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
    });

    if (res.ok) {
      router.push("/school-login");
    } else {
      alert("Erreur lors de la déconnexion");
    }
  };

  return (
    <div className=" mt-10 flex flex-col items-center justify-center">
      <Button onClick={handleLogout} className="flex rounded">
        Se déconnecter
      </Button>
    </div>
  );
}
