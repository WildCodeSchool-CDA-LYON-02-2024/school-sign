import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/jwt"; // Make sure verifyToken is correctly implemented

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Extract the token from cookies
      const tokenCookie = req.cookies.session;
      if (!tokenCookie) {
        return res.status(401).json({ error: "Authorization token required" });
      }

      // Verify the token and extract the payload
      const payload = await verifyToken(tokenCookie);
      const { schoolId, className, role } = payload;

      // Check that the user has a schoolId
      if (!schoolId) {
        return res.status(400).json({ error: "School ID missing from token" });
      }

      // Optionally restrict access to certain roles
      if (role !== "SCHOOL") {
        return res.status(403).json({ error: "Access denied. You do not have the required permissions." });
      }

      // Fetch all users associated with the class and school
      const users = await prisma.user.findMany({
        where: {
          schoolId: schoolId, // Filter by school ID
          className: className,   // Filter by classname
        },
      });

      // Respond with the list of users found
      res.status(200).json({ users });
    } catch (error: any) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
