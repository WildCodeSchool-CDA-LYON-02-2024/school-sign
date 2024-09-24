import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/jwt"; // Assurez-vous d'avoir une fonction pour vérifier le token

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const token = req.cookies.session;
      if (!token) {
        return res.status(401).json({ error: "Authorization token required" });
      }

      const payload = await verifyToken(token);
      const schoolId = payload.schoolId;

      if (!schoolId) {
        return res.status(400).json({ error: "School ID missing from token" });
      }

      const school = await prisma.school.findUnique({
        where: { id: schoolId },
      });

      if (school) {
        res.status(200).json(school);
      } else {
        res.status(404).json({ error: "School not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
