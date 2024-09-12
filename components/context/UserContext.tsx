// "use client";
//
// // react
// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
//
// // next
// import { useRouter } from "next/navigation";
//
// // prisma
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
//
// interface User {
//   id: number;
//   firstname: string;
//   lastname: string;
//   role: Role;
//   schoolId: number;
// }
//
// interface UserContextType {
//   user: User | null;
//   setUser: (user: User | null) => void;
// }
//
// const UserContext = createContext<UserContextType | undefined>(undefined);
//
// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();
//
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch("/api/user");
//         if (response.ok) {
//           const userData: User = await response.json();
//           setUser(userData);
//         } else {
//           setUser(null);
//         }
//       } catch (e) {
//         console.error("Error fetching user session:", e);
//         setUser(null);
//       }
//     };
//     fetchUserData();
//   }, [router]);
//
//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
//
// export const useUserContext = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUserContext must be used within a UserProvider");
//   }
//   return context;
// };
