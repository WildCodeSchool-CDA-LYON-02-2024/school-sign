import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { registerSchemaSchool } from "@/lib/schemas/registerSchemaSchool"; // Assurez-vous que le schéma est adapté aux utilisateurs
import bcrypt from "bcrypt";
import { registerSchema } from "@/lib/schemas/registerSchema";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Validation des données d'entrée avec le schéma
      const data = registerSchemaSchool.parse(req.body);
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create the school (optional, depending on your use case)
      let school;
      if (data.schoolId) {
        // User provided an existing school ID
        school = await prisma.school.findUnique({
          where: { id: data.schoolId },
        });
      } else {
        // Create a new school if no ID provided
        school = await prisma.school.create({
          data: {
            name: data.name,
            address: data.address,
            zipcode: data.zipcode,
            city: data.city,
          },
        });
      }

      if (!school) {
        return res.status(400).json({ error: "School not found or created" });
      }

      // Create the user with the school association
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          school: { connect: { id: school.id } },
        },
      });

      res.status(201).json({ user });
    } catch (error: any) {
      // ... error handling logic
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
