import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "user ID is required" });
      }

      const userId = Number(id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      const tokenCookie = req.cookies.session;
      if (!tokenCookie) {
        return res.status(401).json({ error: "Authorization token required" });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ user: user });
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
