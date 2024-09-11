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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { school: true },
    });

    if (
      user &&
      user.role === "SCHOOL" &&
      (await bcrypt.compare(password, user.password))
    ) {
      const token = await createToken({
        userId: user.id,
        schoolId: user.schoolId,
        classId: user.classId ?? null,
        role: user.role ?? null,
      });

      const cookie = serialize("session", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      res.setHeader("Set-Cookie", cookie);
      return res.status(200).json({ token });
    }

    res.status(401).json({ error: "Invalid email or password" });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
