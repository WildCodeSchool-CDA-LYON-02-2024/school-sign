import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { registerSchema } from "@/lib/schemas/registerSchema";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const data = registerSchema.parse(req.body);

      // Check if the email is already in use
      const existingUser = await prisma.school.findFirst({
        where: { email: data.email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create the school
      const school = await prisma.school.create({
        data: {
          name: data.name,
          address: data.address,
          zipcode: data.zipcode,
          city: data.city,
          email: data.email,
          password: hashedPassword,
        },
      });

      res.status(201).json({ school });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors
        return res.status(400).json({ error: "Database error" });
      }
      res.status(400).json({ error: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
