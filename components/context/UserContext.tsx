"use client";

// react
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// next
import { useRouter } from "next/navigation";

// prisma
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

// packages
import { verifyToken } from "@/lib/jwt";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  role: Role;
  schoolId: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = req.cookies.session;
        if (token) {
          const decodedToken = await verifyToken(token);
          const userData = await prisma.user.findUnique({
            where: { id: decodedToken.userId },
            include: { school: true },
          });

          if (userData) {
            setUser({
              id: userData.id,
              firstname: userData.firstname || "",
              lastname: userData.lastname || "",
              role: userData.role || "SCHOOL",
              schoolId: userData.schoolId,
            });
          }
        }
      } catch (e) {
        console.error("Error fetching user session:", e);
        setUser(null);
      }
    };
    fetchUserData();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
