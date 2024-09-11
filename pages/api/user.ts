import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const token = req.cookies.session;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const decodedToken = await verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      include: { school: true },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
