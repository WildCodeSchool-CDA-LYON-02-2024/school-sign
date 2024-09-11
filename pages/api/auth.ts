import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { createToken } from "@/lib/jwt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const school = await prisma.school.findUnique({
        where: { email },
      });

      if (school && (await bcrypt.compare(password, school.password))) {
        const token = await createToken({ userId: school.id });

        const cookie = serialize("session", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24,
          path: "/",
        });

        res.setHeader("Set-Cookie", cookie);
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else if (error.code === "P2025") {
        // Handle Prisma 'record not found'
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
